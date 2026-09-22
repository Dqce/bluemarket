<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref } from 'vue'
import gsap from 'gsap'
import { Button } from '@/components/ui/button'

const props = defineProps<{
  title: string
  /** Phrase inside title to underline. Editable in Strapi as heroEmphasis. */
  emphasis?: string
  lead: string
  primaryCta: string
  secondaryCta: string
}>()

const argument = computed(() => {
  const lead = props.lead.trim()
  const end = lead.search(/[.!?](?:\s|$)/)
  return end === -1 ? lead : lead.slice(0, end + 1)
})

function stripPunct(word: string) {
  return word.replace(/[^\p{L}\p{N}]+/gu, '').toLowerCase()
}

/**
 * Split title around an editable emphasis phrase from Strapi.
 * Matches by word (ignoring punctuation), so “serious systems” hits “systems.”
 */
const titleParts = computed(() => {
  const tokens = props.title.trim().split(/\s+/).filter(Boolean)
  const emRaw = (props.emphasis ?? '').trim()
  if (!emRaw || !tokens.length) {
    return { before: tokens, emphasis: [] as string[], after: [] as string[] }
  }

  const emWords = emRaw.split(/\s+/).filter(Boolean)
  const normTokens = tokens.map(stripPunct)
  const normEm = emWords.map(stripPunct)

  for (let i = 0; i <= tokens.length - normEm.length; i++) {
    const hit = normEm.every((w, j) => normTokens[i + j] === w)
    if (!hit) continue
    return {
      before: tokens.slice(0, i),
      emphasis: tokens.slice(i, i + normEm.length),
      after: tokens.slice(i + normEm.length),
    }
  }

  return { before: tokens, emphasis: [] as string[], after: [] as string[] }
})

const heroRef = ref<HTMLElement | null>(null)
let ctx: gsap.Context | undefined

onMounted(async () => {
  await nextTick()
  if (!heroRef.value) return

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const underlines = heroRef.value.querySelectorAll<HTMLElement>('[data-hero-underline]')

  if (reduce) {
    underlines.forEach((el) => gsap.set(el, { scaleX: 1 }))
    return
  }

  ctx = gsap.context(() => {
    const wordInners = heroRef.value!.querySelectorAll('.bm-word-inner')
    const fades = heroRef.value!.querySelectorAll('[data-hero-fade]')

    gsap.set(wordInners, { yPercent: 110 })
    gsap.set(fades, { y: 20, autoAlpha: 0 })
    gsap.set(underlines, { scaleX: 0 })

    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })

    tl.to(wordInners, {
      yPercent: 0,
      duration: 0.4,
      stagger: 0.1,
      ease: 'power4.out',
      clearProps: 'transform',
    })

    tl.to(
      fades,
      {
        y: 0,
        autoAlpha: 1,
        duration: 0.4,
        stagger: 0.1,
        ease: 'power2.out',
      },
      '-=0.12',
    )

    if (underlines.length) {
      tl.to(
        underlines,
        {
          scaleX: 1,
          duration: 0.45,
          stagger: 0.08,
          ease: 'power3.inOut',
        },
        '+=0.15',
      )
    }
  }, heroRef.value)
})

onUnmounted(() => {
  ctx?.revert()
})
</script>

<template>
  <section
    id="top"
    ref="heroRef"
    class="bm-chapter relative overflow-hidden bg-background text-foreground"
  >
    <div class="bm-shell bm-gutter relative z-10 grid min-h-0 flex-1 grid-cols-1 items-center gap-10 pt-[5.75rem] pb-16 md:pb-20 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.95fr)] lg:gap-12">
      <div>
        <h1 class="bm-display max-w-[16ch] text-[clamp(2.85rem,8.5vw,5.5rem)] leading-[0.95] tracking-[-0.04em] text-foreground">
          <span
            v-for="(word, wi) in titleParts.before"
            :key="`before-${word}-${wi}`"
            class="bm-word mr-[0.18em] inline-block overflow-hidden align-bottom px-[0.04em] pt-[0.06em] pb-[0.14em]"
          >
            <span class="bm-word-inner inline-block will-change-transform">
              {{ word }}
            </span>
          </span>

          <span
            v-for="(word, wi) in titleParts.emphasis"
            :key="`em-${word}-${wi}`"
            class="bm-word relative mr-[0.18em] inline-block overflow-hidden align-bottom px-[0.04em] pt-[0.06em] pb-[0.14em]"
          >
            <span class="bm-word-inner inline-block will-change-transform">
              {{ word }}
            </span>
            <span
              data-hero-underline
              class="pointer-events-none absolute inset-x-[0.04em] bottom-[0.06em] h-[0.09em] origin-left rounded-full bg-primary"
              aria-hidden="true"
            />
          </span>

          <span
            v-for="(word, wi) in titleParts.after"
            :key="`after-${word}-${wi}`"
            class="bm-word mr-[0.18em] inline-block overflow-hidden align-bottom px-[0.04em] pt-[0.06em] pb-[0.14em]"
          >
            <span class="bm-word-inner inline-block will-change-transform">
              {{ word }}
            </span>
          </span>
        </h1>

        <p
          data-hero-fade
          class="mt-8 max-w-2xl text-base leading-[1.65] text-muted-foreground md:mt-10 md:text-lg"
        >
          {{ argument }}
        </p>

        <div
          data-hero-fade
          class="mt-10 flex flex-col items-stretch gap-4 sm:flex-row sm:items-center"
        >
          <Button
            as="a"
            href="#contact"
            size="lg"
            class="h-12 md:h-14 md:px-8"
          >
            {{ primaryCta }}
          </Button>
          <a
            href="#what-we-do"
            class="text-left text-base text-foreground underline decoration-border underline-offset-4 hover:decoration-primary"
          >{{ secondaryCta }}</a>
        </div>
      </div>

      <div
        data-hero-fade
        class="pointer-events-none relative hidden h-[min(38rem,70dvh)] min-h-[22rem] w-full lg:block"
      >
        <BmHeroGlyphField class="h-full w-full" />
      </div>
    </div>
  </section>
</template>
