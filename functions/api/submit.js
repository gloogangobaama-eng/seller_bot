const TARGET_CHAT_ID = '7761850168'
const MAX_PHOTO_BYTES = 10 * 1024 * 1024
const MAX_FILE_BYTES = 50 * 1024 * 1024
const MAX_TOTAL_UPLOAD_BYTES = 90 * 1024 * 1024

const json = (body, status = 200) => new Response(JSON.stringify(body), {
  status,
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
  },
})

function getFileLimit(file) {
  return file.type.startsWith('image/') ? MAX_PHOTO_BYTES : MAX_FILE_BYTES
}

function getFileLimitMb(file) {
  return file.type.startsWith('image/') ? 10 : 50
}

async function readTelegramJson(res, method) {
  const data = await res.json()
  if (!data.ok) {
    throw new Error(`Telegram ${method} error: ${data.description}`)
  }
  return data
}

async function sendTelegramMessage(botToken, chatId, text) {
  const method = 'sendMessage'
  const res = await fetch(`https://api.telegram.org/bot${botToken}/${method}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: chatId,
      text,
      parse_mode: 'HTML',
    }),
  })
  return readTelegramJson(res, method)
}

async function sendTelegramPhoto(botToken, chatId, file) {
  const method = 'sendPhoto'
  const formData = new FormData()
  formData.append('chat_id', chatId)
  formData.append('photo', file, file.name || 'photo.jpg')

  const res = await fetch(`https://api.telegram.org/bot${botToken}/${method}`, {
    method: 'POST',
    body: formData,
  })
  return readTelegramJson(res, method)
}

async function sendTelegramDocument(botToken, chatId, file) {
  const method = 'sendDocument'
  const formData = new FormData()
  formData.append('chat_id', chatId)
  formData.append('document', file, file.name || 'file')

  const res = await fetch(`https://api.telegram.org/bot${botToken}/${method}`, {
    method: 'POST',
    body: formData,
  })
  return readTelegramJson(res, method)
}

function buildMessage(data, tgUser) {
  const esc = (s) => (s ? String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;') : '-')

  const step1 = data.step1 || {}
  const step2 = data.step2 || {}
  const step3 = data.step3 || {}

  const fioCompany = [step1.fullName, step1.company].filter(Boolean).join(' / ') || '-'
  const innType = step2.entityType === 'individual' ? 'Физ. лицо / ИП (12 цифр)' : 'Юр. лицо (10 цифр)'
  const innValue = step2.inn || '-'
  const links = step3.links || '-'

  const userInfo = tgUser
    ? `Telegram ID: <code>${esc(tgUser.id)}</code>\nUsername: ${tgUser.username ? `@${esc(tgUser.username)}` : '-'}`
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

export async function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}

export async function onRequestPost({ request, env }) {
  const botToken = env.TELEGRAM_BOT_TOKEN

  if (!botToken) {
    return json({ error: 'Server configuration error: missing bot token' }, 500)
  }

  const contentLength = Number(request.headers.get('content-length') || 0)
  if (contentLength > MAX_TOTAL_UPLOAD_BYTES) {
    return json({ error: 'Общий размер файлов больше 90 MB. Оставьте меньше файлов или сожмите видео.' }, 413)
  }

  try {
    const formData = await request.formData()
    const files = formData.getAll('media').filter((file) => file instanceof File && file.size > 0)
    const totalSize = files.reduce((sum, file) => sum + file.size, 0)

    if (files.length === 0) {
      return json({ error: 'No media files provided' }, 400)
    }

    if (totalSize > MAX_TOTAL_UPLOAD_BYTES) {
      return json({ error: 'Общий размер файлов больше 90 MB. Оставьте меньше файлов или сожмите видео.' }, 413)
    }

    const oversized = files.find((file) => file.size > getFileLimit(file))
    if (oversized) {
      return json({
        error: `Файл "${oversized.name}" больше ${getFileLimitMb(oversized)} MB. Сожмите его или выберите файл поменьше.`,
      }, 413)
    }

    let payload = {}
    const data = formData.get('data')
    if (typeof data === 'string') {
      try {
        payload = JSON.parse(data)
      } catch {
        payload = {}
      }
    }

    for (const file of files) {
      if (file.type.startsWith('image/')) {
        await sendTelegramPhoto(botToken, TARGET_CHAT_ID, file)
      } else {
        await sendTelegramDocument(botToken, TARGET_CHAT_ID, file)
      }
    }

    const {
      step1 = {},
      step2 = {},
      step3 = {},
      step4Comment = '',
      tgUser = null,
    } = payload

    const message = buildMessage({ step1, step2, step3, step4Comment }, tgUser)
    await sendTelegramMessage(botToken, TARGET_CHAT_ID, message)

    return json({ ok: true })
  } catch (err) {
    console.error('Handler error:', err)
    return json({ error: err.message || 'Internal server error' }, 500)
  }
}
