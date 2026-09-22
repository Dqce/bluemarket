import type { Homepage } from '~/types/homepage'
import { homepageFallback } from '~/lib/homepage-fallback'

export function useHomepage() {
  const config = useRuntimeConfig()
  const base = config.public.strapiUrl

  return useAsyncData<Homepage>('homepage', async () => {
    try {
      const res = await $fetch<{ data: Homepage }>('/api/homepage', {
        baseURL: base,
        query: { populate: '*' },
      })

      if (res?.data?.heroTitle) {
        return {
          ...homepageFallback,
          ...res.data,
          heroEmphasis: res.data.heroEmphasis ?? homepageFallback.heroEmphasis,
        }
      }
      return homepageFallback
    }
    catch {
      return homepageFallback
    }
  }, {
    default: () => homepageFallback,
  })
}
