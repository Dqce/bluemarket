# BlueMarket

Monorepo for the BlueMarket marketing site.

| Path | App |
| --- | --- |
| `apps/web` | Nuxt 4 front end |
| `apps/cms` | Strapi 5 CMS |

Official docs:

- [Nuxt](https://nuxt.com/docs/getting-started/installation)
- [Strapi](https://docs.strapi.io)
- [Nuxt deployment](https://nuxt.com/docs/getting-started/deployment)
- [Strapi deployment](https://docs.strapi.io/cms/deployment)

## Requirements

- Node.js 22 or newer ([Nuxt 4 requirement](https://nuxt.com/docs/4.x/getting-started/installation))
- npm

## Local development

### CMS

```bash
cd apps/cms
cp .env.example .env
# replace the tobemodified secrets in .env
npm install
npm run develop
```

Admin: http://localhost:1337/admin

Create the first admin user on first boot. Homepage content is seeded if the single type is empty. Public API access is limited to Homepage `find`.

### Web

```bash
cd apps/web
cp .env.example .env
npm install
npm run dev
```

Site: http://localhost:3000

`STRAPI_URL` in `apps/web/.env` should point at the CMS (default `http://localhost:1337`).

From the repo root you can also run `npm run develop` (CMS) and `npm run dev` (web).

## Content

Edit copy in Strapi → Content Manager → Homepage.

If the CMS is unreachable, the web app falls back to `apps/web/app/lib/homepage-fallback.ts`.

Contact is email only: `hello@bluemarket.co.za`.

## Production

### CMS

```bash
cd apps/cms
cp .env.example .env
# set real secrets; prefer postgres in production (see .env.example)
npm install
NODE_ENV=production npm run build
NODE_ENV=production npm run start
```

### Web

```bash
cd apps/web
cp .env.example .env
# set STRAPI_URL to the public CMS URL
npm install
NITRO_PRESET=node-server npm run build
NODE_ENV=production node .output/server/index.mjs
```

Optional: `STRAPI_INTERNAL_URL` if the Nuxt server should call Strapi over a private network while the browser still uses `STRAPI_URL`.

Nuxt respects `PORT` / `HOST` (defaults `3000` / `0.0.0.0`). Put both apps behind HTTPS.

## App READMEs

- [`apps/web/README.md`](apps/web/README.md) — Nuxt starter
- [`apps/cms/README.md`](apps/cms/README.md) — Strapi starter
