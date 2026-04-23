# Telegram Supplier Verification App

Telegram Web App for supplier verification, deployed on Cloudflare Pages with a Pages Function backend.

## Project Structure

```text
telegram-supplier-app/
├── frontend/                 # React + Vite app
├── functions/api/submit.js   # Cloudflare Pages Function
├── dist/                     # Production build output
├── wrangler.toml             # Cloudflare Pages local config
└── README.md
```

## Deployment

### Cloudflare Pages

1. Push the repository to GitHub.
2. In Cloudflare Dashboard open `Workers & Pages`.
3. Click `Create application`.
4. Choose `Pages`.
5. Click `Connect to Git`.
6. Select the repository.
7. Use these build settings:

```text
Build command: npm run build
Build output directory: dist
Root directory: (leave empty)
```

8. Add environment variable:

```text
TELEGRAM_BOT_TOKEN=your_bot_token
```

9. Redeploy after saving the variable.

## Telegram Setup

1. Open [@BotFather](https://t.me/BotFather).
2. Choose your bot.
3. Open `Bot Settings` -> `Menu Button` -> `Configure menu button`.
4. Set the URL to your Cloudflare Pages URL:

```text
https://your-project.pages.dev
```

## Local Development

Frontend only:

```bash
npm run dev
```

Cloudflare Pages local preview:

```bash
npm run dev:cloudflare
```

## Upload Limits

- Photos: up to 10 MB
- Videos and files: up to 50 MB
- Total request size: up to 90 MB

These limits match the current Cloudflare Pages Function flow and Telegram Bot API constraints.

## Notes

- Frontend sends submissions to `/api/submit`.
- `functions/api/submit.js` sends files to Telegram and then posts the structured text message.
- The bot token must live only in Cloudflare environment variables.
