# BlueMarket

Marketing site + CMS.

```
apps/web  Nuxt 4
apps/cms  Strapi 5
```

Docs: [Nuxt](https://nuxt.com/docs) · [Strapi](https://docs.strapi.io)

## Setup

Node.js **22+** ([Nuxt requirement](https://nuxt.com/docs/4.x/getting-started/installation)).

Dependencies (including GSAP, Tailwind, Strapi, etc.) install from each app’s `package.json`. You do not install packages by hand.

### 1. CMS

```bash
cd apps/cms
cp .env.example .env   # fill in the tobemodified values
npm install
npm run develop
```

Open http://localhost:1337/admin and create the admin user. Homepage data seeds on first boot.

### 2. Web

```bash
cd apps/web
cp .env.example .env   # STRAPI_URL=http://localhost:1337
npm install
npm run dev
```

Open http://localhost:3000.

## Editing copy

Strapi admin → Content Manager → Homepage.

If Strapi is down, the site uses `apps/web/app/lib/homepage-fallback.ts`.

## Build / run (production)

Same commands as the [Strapi](https://docs.strapi.io/cms/deployment) and [Nuxt](https://nuxt.com/docs/getting-started/deployment) deployment guides:

```bash
# CMS
cd apps/cms
npm install
NODE_ENV=production npm run build
NODE_ENV=production npm run start

# Web
cd apps/web
npm install
NITRO_PRESET=node-server npm run build
NODE_ENV=production node .output/server/index.mjs
```

Set `STRAPI_URL` on the web app to the public CMS URL before building/running.

CMS defaults to SQLite (`.env.example`). For production, switch to Postgres using the commented vars in `apps/cms/.env.example`.

Ports: CMS `1337`, web `3000` (override with `PORT` / `HOST`).
