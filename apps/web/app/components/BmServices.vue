<script setup lang="ts">
import type { Service } from '~/types/homepage'

defineProps<{
  services: Service[]
}>()
</script>

<template>
  <div class="bm-shell bm-gutter bm-chapter-body">
    <div data-reveal class="max-w-3xl">
      <p class="mb-4 text-sm tracking-wide text-muted-foreground uppercase">
        What we do
      </p>
      <h2 class="bm-display text-[clamp(2.1rem,4vw,3.25rem)] leading-[0.95] text-foreground">
        What we actually build
      </h2>
    </div>

    <ul
      data-stagger
      class="mt-12 border-t border-border md:mt-16"
    >
      <li
        v-for="(service, i) in services"
        :key="service.id ?? i"
        data-stagger-item
        class="group grid grid-cols-1 gap-4 border-b border-border py-8 transition-colors md:grid-cols-[4.5rem_minmax(0,0.9fr)_minmax(0,1.2fr)] md:gap-10 md:py-10 hover:bg-muted/40"
      >
        <span class="font-mono text-sm text-muted-foreground tabular-nums transition-colors group-hover:text-primary">
          {{ String(i + 1).padStart(2, '0') }}
        </span>
        <h3 class="bm-display text-xl leading-[1.15] text-foreground transition-transform duration-300 md:text-2xl lg:text-[1.75rem] group-hover:translate-x-1">
          {{ service.title }}
        </h3>
        <p class="max-w-prose text-base leading-relaxed text-muted-foreground md:text-[1.05rem]">
          {{ service.description }}
        </p>
      </li>
    </ul>
  </div>
</template>
