const { Buffer } = require('buffer')

// Telegram target user ID
const TARGET_CHAT_ID = '7761850168'

/**
 * Parse multipart/form-data manually without external deps
 * (Netlify Functions don't support npm modules for binary uploads easily,
 *  so we use the busboy approach via the bundled version)
 */
const Busboy = require('busboy')

/**
 * Helper: send Telegram message
 */
async function sendTelegramMessage(botToken, chatId, text) {
  const url = `https://api.telegram.org/bot${botToken}/sendMessage`
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: chatId,
      text,
      parse_mode: 'HTML',
    }),
  })
  const json = await res.json()
  if (!json.ok) {
    throw new Error(`Telegram sendMessage error: ${json.description}`)
  }
  return json
}

/**
 * Helper: send single photo
 */
async function sendTelegramPhoto(botToken, chatId, fileBuffer, filename) {
  const url = `https://api.telegram.org/bot${botToken}/sendPhoto`

  const formData = new FormData()
  formData.append('chat_id', chatId)
  formData.append('photo', new Blob([fileBuffer]), filename)

  const res = await fetch(url, {
    method: 'POST',
    body: formData,
  })
  const json = await res.json()
  if (!json.ok) {
    throw new Error(`Telegram sendPhoto error: ${json.description}`)
  }
  return json
}

/**
 * Helper: send single video
 */
async function sendTelegramVideo(botToken, chatId, fileBuffer, filename) {
  const url = `https://api.telegram.org/bot${botToken}/sendVideo`

  const formData = new FormData()
  formData.append('chat_id', chatId)
  formData.append('video', new Blob([fileBuffer]), filename)

  const res = await fetch(url, {
    method: 'POST',
    body: formData,
  })
  const json = await res.json()
  if (!json.ok) {
    throw new Error(`Telegram sendVideo error: ${json.description}`)
  }
  return json
}

/**
 * Helper: send media group (multiple photos/videos)
 */
async function sendTelegramMediaGroup(botToken, chatId, mediaItems) {
  const url = `https://api.telegram.org/bot${botToken}/sendMediaGroup`

  const formData = new FormData()
  formData.append('chat_id', chatId)

  const mediaJson = []
  mediaItems.forEach((item, i) => {
    const attachName = `attach_${i}`
    formData.append(attachName, new Blob([item.buffer]), item.filename)
    mediaJson.push({
      type: item.type, // 'photo' or 'video'
      media: `attach://${attachName}`,
    })
  })

  formData.append('media', JSON.stringify(mediaJson))

  const res = await fetch(url, {
    method: 'POST',
    body: formData,
  })
  const json = await res.json()
  if (!json.ok) {
    throw new Error(`Telegram sendMediaGroup error: ${json.description}`)
  }
  return json
}

/**
 * Parse multipart form data using busboy
 */
function parseMultipart(event) {
  return new Promise((resolve, reject) => {
    const contentType = event.headers['content-type'] || event.headers['Content-Type']

    if (!contentType || !contentType.includes('multipart/form-data')) {
      return reject(new Error('Not multipart/form-data'))
    }

    const busboy = Busboy({ headers: { 'content-type': contentType } })
    const fields = {}
    const files = []

    busboy.on('file', (fieldname, file, info) => {
      const { filename, mimeType } = info
      const chunks = []
      file.on('data', (data) => chunks.push(data))
      file.on('end', () => {
        files.push({
          fieldname,
          filename,
          mimeType,
          buffer: Buffer.concat(chunks),
        })
      })
    })

    busboy.on('field', (name, val) => {
      fields[name] = val
    })

    busboy.on('finish', () => resolve({ fields, files }))
    busboy.on('error', reject)

    // The body might be base64-encoded by Netlify
    const bodyBuffer = event.isBase64Encoded
      ? Buffer.from(event.body, 'base64')
      : Buffer.from(event.body || '', 'utf8')

    busboy.write(bodyBuffer)
    busboy.end()
  })
}

/**
 * Build the structured Telegram notification message
 */
function buildMessage(data, tgUser) {
  const esc = (s) => (s ? String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;') : '—')

  const step1 = data.step1 || {}
  const step2 = data.step2 || {}
  const step3 = data.step3 || {}

  const fioCompany = [step1.fullName, step1.company].filter(Boolean).join(' / ') || '—'
  const innType = step2.entityType === 'individual' ? 'Физ. лицо / ИП (12 цифр)' : 'Юр. лицо (10 цифр)'
  const innValue = step2.inn || '—'
  const links = step3.links || '—'

  const userInfo = tgUser
    ? `Telegram ID: <code>${esc(tgUser.id)}</code>\nUsername: ${tgUser.username ? `@${esc(tgUser.username)}` : '—'}`
    : 'Пользователь не определён'

  return `🆕 <b>Новая заявка на проверку</b>

<b>1. ФИО / Компания:</b>
${esc(fioCompany)}
${step1.comment ? `\n💬 <i>${esc(step1.comment)}</i>` : ''}

<b>2. ИНН:</b>
Тип: ${esc(innType)}
Значение: <code>${esc(innValue)}</code>
${step2.comment ? `\n💬 <i>${esc(step2.comment)}</i>` : ''}

<b>3. Ссылки:</b>
${esc(links)}
${step3.comment ? `\n💬 <i>${esc(step3.comment)}</i>` : ''}

<b>4. Медиа:</b>
(см. вложения)
${data.step4Comment ? `\n💬 <i>${esc(data.step4Comment)}</i>` : ''}

<b>Пользователь:</b>
${userInfo}`
}

// ─── HANDLER ─────────────────────────────────────────────────────────────────

exports.handler = async (event) => {
  // CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
      body: '',
    }
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' }
  }

  const BOT_TOKEN = "8600815791:AAF8ukbxRvKag51tvU5tW7GfQ_OqZiN5KWQ"
  if (!BOT_TOKEN) {
    console.error('TELEGRAM_BOT_TOKEN is not set')
    return { statusCode: 500, body: 'Server configuration error: missing bot token' }
  }

  try {
    const { fields, files } = await parseMultipart(event)

    let payload = {}
    if (fields.data) {
      try {
        payload = JSON.parse(fields.data)
      } catch {
        payload = {}
      }
    }

    const { step1 = {}, step2 = {}, step3 = {}, step4Comment = '', tgUser = null } = payload

    // Step 1: Send media files
    if (files.length === 0) {
      return {
        statusCode: 400,
        headers: { 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify({ error: 'No media files provided' }),
      }
    }

    // Classify files
    const mediaItems = files.map((f) => ({
      buffer: f.buffer,
      filename: f.filename,
      mimeType: f.mimeType,
      type: f.mimeType.startsWith('video/') ? 'video' : 'photo',
    }))

    if (mediaItems.length === 1) {
      const item = mediaItems[0]
      if (item.type === 'video') {
        await sendTelegramVideo(BOT_TOKEN, TARGET_CHAT_ID, item.buffer, item.filename)
      } else {
        await sendTelegramPhoto(BOT_TOKEN, TARGET_CHAT_ID, item.buffer, item.filename)
      }
    } else {
      // sendMediaGroup supports max 10 items; split if needed
      const CHUNK_SIZE = 10
      for (let i = 0; i < mediaItems.length; i += CHUNK_SIZE) {
        const chunk = mediaItems.slice(i, i + CHUNK_SIZE)
        await sendTelegramMediaGroup(BOT_TOKEN, TARGET_CHAT_ID, chunk)
      }
    }

    // Step 2: Send text message
    const message = buildMessage({ step1, step2, step3, step4Comment }, tgUser)
    await sendTelegramMessage(BOT_TOKEN, TARGET_CHAT_ID, message)

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({ ok: true }),
    }
  } catch (err) {
    console.error('Handler error:', err)
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({ error: err.message }),
    }
  }
}
