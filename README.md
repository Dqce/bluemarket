# BlueMarket

Nuxt 4 marketing site + Strapi 5 CMS.

## Apps

| App | Stack | Local URL |
| --- | --- | --- |
| `apps/web` | Nuxt 4, Vue 3, Tailwind CSS v4, shadcn-vue | http://localhost:3000 |
| `apps/cms` | Strapi 5, SQLite | http://localhost:1337/admin |

## Local start

```bash
# Terminal 1 — CMS
cd apps/cms
cp .env.example .env   # then replace every tobemodified secret
npm install
npm run develop

# Terminal 2 — Web
cd apps/web
cp .env.example .env
npm install
npm run dev
```

From the repo root: `npm run develop` then `npm run dev`.

First CMS boot: create the admin user at `/admin`. Homepage copy seeds automatically. Public API is **Homepage find only**.

## Editing copy

Strapi → Content Manager → Homepage. Save, refresh the site.

If Strapi is down, the web app renders from `apps/web/app/lib/homepage-fallback.ts`.

Contact is mailto only (`hello@bluemarket.co.za`). No inquiry form.

## Security notes (production)

- Never commit `.env`. Generate fresh `APP_KEYS`, salts, and JWT secrets per environment.
- Homepage router exposes `find` only; create/update/delete stay in admin.
- Bootstrap grants Public role `homepage.find` only.
- SQLite (`.tmp/data.db`) is fine for demos; use Postgres for real production.
- Put Strapi behind HTTPS. Restrict admin to trusted IPs if possible.

## Static preview (GitHub Pages)

The marketing site can ship as a static export (fallback copy, no live CMS):

```bash
cd apps/web
NUXT_APP_BASE_URL=/bluemarket/ npm run generate
```

Output: `apps/web/.output/public`. That folder is what GitHub Pages serves on the `gh-pages` branch.

Full stack (Nuxt + Strapi) needs a real host (Vercel/Netlify/Fly/Railway/etc.), not Pages alone.
