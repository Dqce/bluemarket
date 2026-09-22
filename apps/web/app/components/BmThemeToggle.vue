<script setup lang="ts">
import { Moon, Sun } from '@lucide/vue'
import { nextTick, ref, watch } from 'vue'
import gsap from 'gsap'

const { isDark, toggleDark } = useThemeMode()
const iconRef = ref<HTMLElement | null>(null)

watch(isDark, async () => {
  await nextTick()
  if (!iconRef.value) return
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

  gsap.fromTo(
    iconRef.value,
    { rotate: -90, autoAlpha: 0, scale: 0.6 },
    { rotate: 0, autoAlpha: 1, scale: 1, duration: 0.35, ease: 'power2.out' },
  )
})
</script>

<template>
  <button
    type="button"
    role="switch"
    class="inline-flex items-center gap-2 rounded-md outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
    :aria-checked="isDark"
    aria-label="Toggle dark mode"
    @click="toggleDark()"
  >
    <span
      ref="iconRef"
      class="inline-flex text-muted-foreground"
      aria-hidden="true"
    >
      <Moon
        v-if="isDark"
        class="size-4"
      />
      <Sun
        v-else
        class="size-4"
      />
    </span>
    <span
      class="relative inline-flex h-5 w-9 shrink-0 items-center rounded-full border border-transparent shadow-xs transition-colors"
      :class="isDark ? 'bg-primary' : 'bg-input'"
      aria-hidden="true"
    >
      <span
        class="pointer-events-none block size-4 rounded-full bg-background ring-0 transition-transform"
        :class="isDark ? 'translate-x-[calc(100%-2px)]' : 'translate-x-0'"
      />
    </span>
  </button>
</template>
