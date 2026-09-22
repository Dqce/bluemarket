import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

/**
 * Section + staggered list reveals. Honour prefers-reduced-motion.
 * Start early so the full motion plays before the section hits center.
 */
export function useSectionReveal(root: Ref<HTMLElement | null>) {
  let ctx: gsap.Context | undefined

  onMounted(() => {
    if (!root.value) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    gsap.registerPlugin(ScrollTrigger)

    ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach((el) => {
        gsap.from(el, {
          y: 36,
          autoAlpha: 0,
          duration: 1.15,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 95%',
            toggleActions: 'play none none none',
            once: true,
          },
        })
      })

      gsap.utils.toArray<HTMLElement>('[data-stagger]').forEach((group) => {
        const items = group.querySelectorAll<HTMLElement>('[data-stagger-item]')
        if (!items.length) return

        gsap.from(items, {
          y: 28,
          autoAlpha: 0,
          duration: 0.95,
          ease: 'power2.out',
          stagger: 0.16,
          scrollTrigger: {
            trigger: group,
            start: 'top 92%',
            toggleActions: 'play none none none',
            once: true,
          },
        })
      })
    }, root.value)
  })

  onUnmounted(() => {
    ctx?.revert()
  })
}
