# BlueMarket agent notes

## Stack map

- `apps/web` — Nuxt 4 + Vue 3 + Tailwind CSS v4 + shadcn-vue (`shadcn-nuxt`) + TypeScript. Dev: `http://localhost:3000`
- `apps/cms` — Strapi 5 + SQLite (`better-sqlite3`). Admin: `http://localhost:1337/admin`
- Web talks to CMS via `@nuxtjs/strapi` and `STRAPI_URL` (default `http://localhost:1337`)

## Design contract

See [`.cursor/rules/bluemarket-ui.mdc`](.cursor/rules/bluemarket-ui.mdc) and tokens in [`apps/web/app/assets/css/tailwind.css`](apps/web/app/assets/css/tailwind.css).

Hybrid layout: bold hero + shadcn Table / Accordion / Tabs / Card for the rest. GSAP for hero character stagger and section reveals (`prefers-reduced-motion` respected). Theme toggle in header and mobile menu (`html.dark`).

## Hard constraints

- No purple gradients, glassmorphism, neon terminal aesthetics, or DEMO watermarks
- Fonts follow the TweakCN file (Inter, JetBrains Mono). Do not add Geist, Poppins, or Montserrat
- No Unsplash, AI images, or stock photography
- No invented clients, logos, testimonials, or extra scale claims
- No em-dash marketing filler in new copy
- Left-align default layouts
- Mobile menu must not use a shadcn Sheet — custom overlay only
- Contact is mailto only. Do not add an Inquiry collection or form unless asked
- Commits: do not add a Cursor co-author trailer
