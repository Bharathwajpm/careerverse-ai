# CareerVerse AI — Deployment

## Prerequisites

- Node.js 20+
- `npm ci`
- Copy `.env.example` → `.env.local` and set production values

## Environment variables (client)

| Variable | Required | Description |
|----------|----------|-------------|
| `VITE_API_URL` | Recommended | Backend API base URL in production |
| `VITE_GOOGLE_CLIENT_ID` | Optional | Google sign-in |
| `VITE_DEV_API_PROXY` | Dev only | Local API proxy target |

## Build & validate

```bash
npm run build:validate
```

Produces `dist/client` (static assets) and `dist/server` (SSR/worker — Cloudflare).  
`build:validate` auto-generates `dist/client/index.html` for Vercel/Netlify static hosting.

## Preview locally

```bash
npm run preview
```

## Vercel

1. Import repository
2. Framework preset: **Other**
3. Build command: `npm run build:validate`
4. Output directory: `dist/client`
5. Add environment variables in project settings
6. `vercel.json` includes SPA rewrites

For full SSR + API on Vercel, add a separate Node/Edge API deployment and set `VITE_API_URL`.

## Netlify

1. Build command: `npm run build:validate`
2. Publish directory: `dist/client`
3. `netlify.toml` includes SPA redirects and security headers

## Cloudflare (TanStack Start default)

Use the generated `dist/server` worker bundle with Wrangler if deploying the full Start stack.

## Notes

- Auth and data APIs require the backend (`backend/`) when not using demo mode.
- Static hosts serve the client only; configure `VITE_API_URL` to your API origin.
