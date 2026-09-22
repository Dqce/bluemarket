import { factories } from '@strapi/strapi'

/** Public API: Homepage find only. Create/update/delete stay admin-only. */
export default factories.createCoreRouter('api::homepage.homepage', {
  only: ['find'],
})
