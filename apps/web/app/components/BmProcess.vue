<script setup lang="ts">
import type { ProcessStep } from '~/types/homepage'
import { nextTick, onMounted, onUnmounted, ref } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

defineProps<{
  steps: ProcessStep[]
}>()

const rootRef = ref<HTMLElement | null>(null)
let ctx: gsap.Context | undefined

onMounted(async () => {
  await nextTick()
  if (!rootRef.value) return
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

  gsap.registerPlugin(ScrollTrigger)

  ctx = gsap.context(() => {
    const steps = gsap.utils.toArray<HTMLElement>('[data-process-step]')
    const arrows = gsap.utils.toArray<HTMLElement>('[data-process-arrow]')

    gsap.set(steps, { y: 36, autoAlpha: 0, scale: 0.96 })
    gsap.set(arrows, { autoAlpha: 0, scale: 0.6 })

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: rootRef.value,
        start: 'top 82%',
        toggleActions: 'play none none none',
        once: true,
      },
      defaults: { ease: 'power3.out' },
    })

    steps.forEach((step, i) => {
      tl.to(step, {
        y: 0,
        autoAlpha: 1,
        scale: 1,
        duration: 0.45,
      })

      const arrow = arrows[i]
      if (arrow) {
        tl.to(
          arrow,
          {
            autoAlpha: 1,
            scale: 1,
            duration: 0.28,
            ease: 'back.out(1.6)',
          },
          '-=0.08',
        )
      }
    })
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
    <div
      data-reveal
      class="max-w-3xl"
    >
      <p class="mb-4 text-sm tracking-wide text-muted-foreground uppercase">
        How we work
      </p>
      <h2 class="bm-display text-[clamp(2.1rem,4vw,3.25rem)] leading-[0.95] text-foreground">
        How a piece of work actually moves
      </h2>
    </div>

    <div
      class="mt-12 flex flex-col md:mt-16 md:flex-row md:items-stretch"
      role="list"
    >
      <template
        v-for="(step, i) in steps"
        :key="step.id ?? i"
      >
        <div
          data-process-step
          role="listitem"
          class="flex min-w-0 flex-1 flex-col border border-border bg-card p-5 md:p-6"
        >
          <span class="font-mono text-sm text-muted-foreground tabular-nums">
            {{ String(i + 1).padStart(2, '0') }}
          </span>
          <h3 class="bm-display mt-5 text-lg leading-[1.15] text-foreground md:text-xl">
            {{ step.title }}
          </h3>
          <p class="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground md:text-base">
            {{ step.description }}
          </p>
        </div>

        <div
          v-if="i < steps.length - 1"
          data-process-arrow
          class="flex shrink-0 items-center justify-center py-3 text-primary md:px-2 md:py-0"
          aria-hidden="true"
        >
          <svg
            class="size-6 md:hidden"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.75"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M12 5v14" />
            <path d="m19 12-7 7-7-7" />
          </svg>
          <svg
            class="hidden size-6 md:block"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.75"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M5 12h14" />
            <path d="m12 5 7 7-7 7" />
          </svg>
        </div>
      </template>
    </div>
  </div>
</template>
