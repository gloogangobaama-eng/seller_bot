const DEFAULT_WEB_APP_URL = 'https://postavka.online'

async function telegramRequest(botToken, method, payload) {
  const res = await fetch(`https://api.telegram.org/bot${botToken}/${method}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })

  const json = await res.json()
  if (!json.ok) {
    throw new Error(`Telegram ${method} error: ${json.description}`)
  }

  return json
}

async function sendWelcomeMessage(botToken, chatId, webAppUrl, firstName) {
  const greetingName = firstName ? `, ${firstName}` : ''

  return telegramRequest(botToken, 'sendMessage', {
    chat_id: chatId,
    text: `Привет${greetingName}! Нажми кнопку ниже, чтобы открыть приложение для верификации поставщика.`,
    reply_markup: {
      inline_keyboard: [[{
        text: 'Открыть приложение',
        web_app: { url: webAppUrl },
      }]],
    },
  })
}

export async function onRequestPost({ request, env }) {
  const botToken = env.TELEGRAM_BOT_TOKEN
  const webAppUrl = env.PUBLIC_WEB_APP_URL || DEFAULT_WEB_APP_URL

  if (!botToken) {
    return new Response('Missing TELEGRAM_BOT_TOKEN', { status: 500 })
  }

  try {
    const update = await request.json()
    const message = update.message

    if (message?.text?.startsWith('/start')) {
      await sendWelcomeMessage(
        botToken,
        message.chat.id,
        webAppUrl,
        message.from?.first_name
      )
    }

    return new Response('ok')
  } catch (err) {
    console.error('telegram-webhook error:', err)
    return new Response('ok')
  }
}
