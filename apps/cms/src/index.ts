import type { Core } from '@strapi/strapi'
import { homepageSeed } from './seed/homepage'

async function ensurePublicPermissions(strapi: Core.Strapi) {
  const publicRole = await strapi.db
    .query('plugin::users-permissions.role')
    .findOne({ where: { type: 'public' } })

  if (!publicRole) return

  const action = 'api::homepage.homepage.find'
  const existing = await strapi.db
    .query('plugin::users-permissions.permission')
    .findOne({ where: { action, role: publicRole.id } })

  if (!existing) {
    await strapi.db.query('plugin::users-permissions.permission').create({
      data: { action, role: publicRole.id },
    })
  }
}

async function seedHomepage(strapi: Core.Strapi) {
  const existing = await strapi.documents('api::homepage.homepage').findFirst()
  if (existing) return

  await strapi.documents('api::homepage.homepage').create({ data: homepageSeed })
  strapi.log.info('Seeded homepage content.')
}

export default {
  register() {},

  async bootstrap({ strapi }: { strapi: Core.Strapi }) {
    await ensurePublicPermissions(strapi)
    await seedHomepage(strapi)
  },
}
