# Telegram Supplier Verification App

A production-ready Telegram Web App for supplier verification with a premium dark UI and nude gradient accents.

---

## 🏗️ Project Structure

```
telegram-supplier-app/
├── frontend/               # React + Vite app
│   ├── src/
│   │   ├── components/
│   │   │   ├── Step1.jsx        # ФИО + Company
│   │   │   ├── Step2.jsx        # INN with validation
│   │   │   ├── Step3.jsx        # Links
│   │   │   ├── Step4.jsx        # Media upload
│   │   │   ├── ProgressBar.jsx  # Step progress
│   │   │   └── CommentModal.jsx # Comment modal
│   │   ├── hooks/
│   │   │   └── useTelegram.js   # Telegram SDK hook
│   │   ├── App.jsx              # Main app with all screens
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── package.json
├── netlify/
│   └── functions/
│       ├── submit.js            # Main serverless function
│       └── package.json
├── netlify.toml                 # Netlify build config
├── .env.example
└── README.md
```

---

## 🚀 Deployment Guide

### Step 1 — Prerequisites

- A Netlify account (free tier works)
- A Telegram Bot Token from [@BotFather](https://t.me/BotFather)
- Node.js 18+
- Git

---

### Step 2 — Get Your Bot Token

1. Open Telegram and message [@BotFather](https://t.me/BotFather)
2. Send `/newbot` (or use your existing bot with `/mybots`)
3. Copy the **HTTP API token** — it looks like: `1234567890:ABCdef...`

---

### Step 3 — Deploy to Netlify

#### Option A — via Netlify UI (recommended)

1. Push this entire project to a GitHub repository
2. Go to [app.netlify.com](https://app.netlify.com) → **Add new site** → **Import an existing project**
3. Connect GitHub and select your repository
4. Set build settings:
   - **Base directory:** `frontend`
   - **Build command:** `npm install && npm run build`
   - **Publish directory:** `../dist`
5. Click **Deploy site**

#### Option B — via Netlify CLI

```bash
npm install -g netlify-cli

cd telegram-supplier-app
netlify login
netlify init   # Follow prompts, link to new site
netlify deploy --build --prod
```

---

### Step 4 — Set the Bot Token Environment Variable

#### In Netlify Dashboard:
1. Go to your site → **Site configuration** → **Environment variables**
2. Click **Add a variable**
3. Key: `TELEGRAM_BOT_TOKEN`
4. Value: `your_bot_token_here` (from Step 2)
5. Click **Save**
6. **Redeploy** the site: Deploys → Trigger deploy → Deploy site

#### For local development:
```bash
cp .env.example .env
# Edit .env and fill in TELEGRAM_BOT_TOKEN=your_token
```

---

### Step 5 — Connect the Web App to Your Bot

1. Message [@BotFather](https://t.me/BotFather) in Telegram
2. Select your bot → **Edit Bot** → **Bot Settings** → **Menu Button** → **Configure menu button**
3. Set the URL to your Netlify deployment URL, e.g.:
   `https://your-site-name.netlify.app`
4. Set the button text: `Верификация`

**OR** add a Web App command via BotFather:
1. `/newapp` → Select your bot → Set the URL to your Netlify URL
2. Users can then access it via the bot's menu button

---

## 🔧 Local Development

```bash
# Install all dependencies
cd frontend && npm install
cd ../netlify/functions && npm install
cd ../../

# Install Netlify CLI globally
npm install -g netlify-cli

# Create local .env
cp .env.example .env
# Fill in TELEGRAM_BOT_TOKEN in .env

# Start local dev server (runs both Vite + Netlify functions)
cd frontend
npx netlify dev
```

The app will be available at `http://localhost:8888`

---

## 📤 How Submission Works

When a user submits the form:

1. **Media files** are sent first:
   - Single file → `sendPhoto` or `sendVideo`
   - Multiple files → `sendMediaGroup` (max 10 per group, auto-chunked)

2. **Structured message** is sent to chat ID `7761850168`:

```
🆕 Новая заявка на проверку

1. ФИО / Компания: Иванов Иван / ООО «Рога»
   💬 [optional comment]

2. ИНН:
   Тип: Юр. лицо (10 цифр)
   Значение: 1234567890
   💬 [optional comment]

3. Ссылки:
   https://...
   💬 [optional comment]

4. Медиа: (см. вложения)
   💬 [optional comment]

Пользователь:
Telegram ID: 123456789
Username: @username
```

---

## 🎨 UI Screens

| Screen | Description |
|--------|-------------|
| Landing | Welcome screen with CTA |
| Intro | Process overview (4 steps listed) |
| Step 1 | ФИО + Company (optional) |
| Step 2 | INN with type selector + validation |
| Step 3 | Links textarea (optional) |
| Step 4 | Media upload (required) |
| Success | Confirmation screen |
| Error | Error state with retry |

---

## ⚙️ Environment Variables Reference

| Variable | Required | Description |
|----------|----------|-------------|
| `TELEGRAM_BOT_TOKEN` | ✅ Yes | Your Telegram bot HTTP API token |

---

## 🔒 Security Notes

- Bot token is **never exposed to the frontend** — it lives only in Netlify environment variables
- The Netlify function validates that files are present before sending
- Telegram `initData` is forwarded but full signature verification can be added server-side if needed

---

## 🐛 Troubleshooting

**"Server configuration error: missing bot token"**
→ Add `TELEGRAM_BOT_TOKEN` in Netlify Environment Variables and redeploy

**Media not sending / 400 from Telegram**
→ Check that the file size is under 50MB (Telegram limit for bots)

**Web App not opening in Telegram**
→ Make sure the URL is HTTPS (Netlify provides this by default)

**Dev proxy errors**
→ Make sure you're running `netlify dev` from the `frontend/` directory, not the root
