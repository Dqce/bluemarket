import tailwindcss from '@tailwindcss/vite'

const rawBase = process.env.NUXT_APP_BASE_URL || '/'
const baseURL = rawBase.endsWith('/') ? rawBase : `${rawBase}/`

function asset(path: string) {
  return `${baseURL}${path.replace(/^\//, '')}`
}

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: process.env.NODE_ENV !== 'production' },
  css: ['~/assets/css/tailwind.css'],
  vite: {
    plugins: [tailwindcss()],
  },
  modules: ['@nuxt/fonts', 'shadcn-nuxt', '@nuxtjs/strapi'],
  shadcn: {
    prefix: '',
    componentDir: '@/components/ui',
  },
  runtimeConfig: {
    strapiInternalUrl: process.env.STRAPI_INTERNAL_URL || '',
    public: {
      strapiUrl: process.env.STRAPI_URL || 'http://localhost:1337',
    },
  },
  strapi: {
    url: process.env.STRAPI_URL || 'http://localhost:1337',
    prefix: '/api',
    version: 'v5',
  },
  fonts: {
    families: [
      { name: 'Inter', provider: 'google' },
      { name: 'JetBrains Mono', provider: 'google' },
    ],
  },
  app: {
    baseURL,
    head: {
      htmlAttrs: { lang: 'en' },
      title: 'BlueMarket | Critical Software, Delivered',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        {
          name: 'description',
          content:
            'BlueMarket develops production-grade systems for aviation and fintech operators who demand reliability, speed, and security.',
        },
        { property: 'og:title', content: 'BlueMarket | Critical Software, Delivered' },
        {
          property: 'og:description',
          content:
            'Serious software for serious systems. Resilient mobile and web apps, high-throughput backends, hardened infrastructure.',
        },
        { property: 'og:image', content: asset('bluemarket-icon.png') },
        { property: 'og:type', content: 'website' },
      ],
      link: [
        { rel: 'icon', type: 'image/png', href: asset('bluemarket-icon.png') },
        { rel: 'apple-touch-icon', href: asset('bluemarket-icon.png') },
      ],
      script: [
        {
          innerHTML:
            "(function(){try{var s=localStorage.getItem('bluemarket-theme');if(s!=='light')document.documentElement.classList.add('dark')}catch(e){document.documentElement.classList.add('dark')}})()",
          tagPosition: 'head',
        },
      ],
    },
  },
})
