<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

const props = defineProps<{
  titleOne: string
  bodyOne: string
  titleTwo: string
  bodyTwo: string
}>()

/** “Small team, big outcomes” → two display lines when a comma is present. */
const headline = computed(() => {
  const raw = props.titleOne.trim()
  const comma = raw.indexOf(',')
  if (comma === -1) {
    return { lead: raw, punch: '' }
  }
  return {
    lead: raw.slice(0, comma + 1).trim(),
    punch: raw.slice(comma + 1).trim(),
  }
})

const rootRef = ref<HTMLElement | null>(null)
let ctx: gsap.Context | undefined

onMounted(async () => {
  await nextTick()
  if (!rootRef.value) return
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

  gsap.registerPlugin(ScrollTrigger)

  ctx = gsap.context(() => {
    const lead = rootRef.value!.querySelector('[data-about-lead]')
    const punch = rootRef.value!.querySelector('[data-about-punch]')
    const rule = rootRef.value!.querySelector('[data-about-rule]')
    const body = rootRef.value!.querySelector('[data-about-body]')
    const side = rootRef.value!.querySelector('[data-about-side]')

    gsap.set([lead, punch, body, side].filter(Boolean), { autoAlpha: 0 })
    if (lead) gsap.set(lead, { y: 40 })
    if (punch) gsap.set(punch, { y: 56, scale: 0.92, transformOrigin: 'left center' })
    if (rule) gsap.set(rule, { scaleX: 0 })
    if (body) gsap.set(body, { y: 24 })
    if (side) gsap.set(side, { y: 32 })

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: rootRef.value,
        start: 'top 78%',
        toggleActions: 'play none none none',
        once: true,
      },
      defaults: { ease: 'power3.out' },
    })

    // Brief beat on “Small team,” then a short pop on “big outcomes.”
    if (lead) {
      tl.to(lead, { y: 0, autoAlpha: 1, duration: 0.7 })
      tl.to({}, { duration: 0.22 })
    }
    if (punch) {
      tl.fromTo(
        punch,
        { y: 40, autoAlpha: 0, scale: 0.94 },
        { y: 0, autoAlpha: 1, scale: 1.1, duration: 0.45, ease: 'power3.out' },
      )
      tl.to(punch, { scale: 1, duration: 0.28, ease: 'power2.out' })
    }
    if (rule) {
      tl.to(rule, { scaleX: 1, duration: 0.55, ease: 'power2.inOut' }, '-=0.2')
    }
    if (body) {
      tl.to(body, { y: 0, autoAlpha: 1, duration: 0.5 }, '-=0.3')
    }
    if (side) {
      tl.to(side, { y: 0, autoAlpha: 1, duration: 0.55 }, '-=0.35')
    }
  }, rootRef.value)
})

onUnmounted(() => {
  ctx?.revert()
})
</script>

<template>
  <div
    ref="rootRef"
    class="bm-shell bm-gutter bm-chapter-body"
  >
    <p class="mb-8 text-sm tracking-wide text-white/55 uppercase md:mb-10">
      Who we are
    </p>

    <div class="grid grid-cols-1 items-end gap-12 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:gap-16">
      <div>
        <h2 class="bm-display text-white">
          <span
            data-about-lead
            class="block max-w-[12ch] text-[clamp(2.5rem,6vw,4.25rem)] leading-[0.92] tracking-[-0.035em] text-white/70"
          >
            {{ headline.lead }}
          </span>
          <span
            v-if="headline.punch"
            data-about-punch
            class="mt-1 block max-w-[12ch] text-[clamp(2.75rem,7vw,5rem)] leading-[0.9] tracking-[-0.04em] text-white"
          >
            {{ headline.punch }}
          </span>
        </h2>

        <div
          data-about-rule
          class="mt-8 h-px w-full max-w-md origin-left bg-white/25 md:mt-10"
          aria-hidden="true"
        />

        <p
          data-about-body
          class="mt-8 max-w-xl text-base leading-[1.65] text-white/75 md:mt-10 md:text-lg"
        >
          {{ bodyOne }}
        </p>
      </div>

      <div
        data-about-side
        class="border-t border-white/15 pt-8 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-10"
      >
        <h3 class="bm-display max-w-[14ch] text-[clamp(1.65rem,3vw,2.35rem)] leading-[1.05] text-white">
          {{ titleTwo }}
        </h3>
        <p class="mt-5 max-w-xl text-base leading-[1.65] text-white/75 md:text-lg">
          {{ bodyTwo }}
        </p>
      </div>
    </div>
  </div>
</template>
