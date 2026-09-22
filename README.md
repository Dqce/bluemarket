# BlueMarket

Monorepo for the BlueMarket marketing site.

| Path | App |
| --- | --- |
| `apps/web` | Nuxt 4 front end |
| `apps/cms` | Strapi 5 CMS |

Official docs:

- [Nuxt](https://nuxt.com/docs/getting-started/installation)
- [Strapi](https://docs.strapi.io)
- [Strapi Docker](https://docs.strapi.io/cms/installation/docker)
- [Nuxt deployment](https://nuxt.com/docs/getting-started/deployment)

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

## Production (without Docker)

### CMS

Follow [Strapi deployment](https://docs.strapi.io/cms/deployment). Typical flow:

```bash
cd apps/cms
cp .env.example .env
# set real secrets; prefer postgres in production (see .env.example)
npm install
NODE_ENV=production npm run build
NODE_ENV=production npm run start
```

### Web

Follow [Nuxt Node server deployment](https://nuxt.com/docs/getting-started/deployment):

```bash
cd apps/web
cp .env.example .env
# set STRAPI_URL to the public CMS URL (browser-reachable)
npm install
NITRO_PRESET=node-server npm run build
NODE_ENV=production node .output/server/index.mjs
```

Optional: `STRAPI_INTERNAL_URL` for server-side fetches inside a private network (e.g. Docker service name). Public `STRAPI_URL` is still what the browser uses.

Env vars for the Node process:

- `PORT` / `HOST` (Nuxt/Nitro defaults: `3000` / `0.0.0.0`)
- `STRAPI_URL`
- `STRAPI_INTERNAL_URL` (optional)

Put both apps behind HTTPS (nginx, Caddy, Traefik, etc.).

## Docker Compose

`docker-compose.yml` at the repo root runs Postgres, Strapi, and the Nuxt server. The Dockerfiles follow Strapi’s production image pattern and Nuxt’s Node server output.

```bash
cp .env.docker.example .env
# edit secrets and URLs
docker compose up --build
```

- Site: http://localhost:3000
- CMS admin: http://localhost:1337/admin

Adapt ports, reverse proxy, and secrets for your host. Do not commit real `.env` files.

## App READMEs

Scaffold notes from each framework:

- [`apps/web/README.md`](apps/web/README.md)
- [`apps/cms/README.md`](apps/cms/README.md)
