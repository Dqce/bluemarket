<script setup lang="ts">
import { RainbowButton } from '@/components/ui/rainbow-button'

defineProps<{
  title: string
  body: string
  email: string
  whyTitle: string
  whyBody: string
}>()
</script>

<template>
  <div class="bm-shell bm-gutter bm-chapter-body">
    <div class="grid grid-cols-1 items-start gap-12 lg:grid-cols-2 lg:gap-20">
      <div data-reveal>
        <p class="mb-4 text-sm tracking-wide text-muted-foreground uppercase">
          Why BlueMarket
        </p>
        <h2 class="bm-display text-[clamp(2.1rem,4vw,3.25rem)] leading-[0.95] text-foreground">
          {{ whyTitle }}
        </h2>
        <p class="mt-6 max-w-prose text-base leading-relaxed text-muted-foreground md:text-lg">
          {{ whyBody }}
        </p>
      </div>

      <div data-reveal>
        <p class="mb-4 text-sm tracking-wide text-muted-foreground uppercase">
          Contact
        </p>
        <h3 class="bm-display text-[clamp(2.1rem,4vw,3rem)] leading-[0.95] text-foreground">
          {{ title }}
        </h3>
        <p class="mt-6 max-w-md text-base leading-relaxed text-muted-foreground md:text-lg">
          {{ body }}
        </p>
        <RainbowButton
          as="a"
          :href="`mailto:${email}`"
          class="mt-8"
        >
          {{ email }}
        </RainbowButton>
      </div>
    </div>
  </div>
</template>
