<script setup lang="ts">
import { Menu, X } from '@lucide/vue'
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import gsap from 'gsap'
import { Button } from '@/components/ui/button'

const links = [
  { href: '#what-we-do', label: 'What we do' },
  { href: '#who-we-are', label: 'Who we are' },
  { href: '#how-we-work', label: 'How we work' },
  { href: '#contact', label: 'Contact' },
]

const open = ref(false)
const scrolled = ref(false)

function closeMenu() {
  open.value = false
}

function toggleMenu() {
  open.value = !open.value
}

function onKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape') closeMenu()
}

function onScroll() {
  scrolled.value = window.scrollY > 12
}

watch(open, async (isOpen) => {
  if (typeof document === 'undefined') return
  document.body.style.overflow = isOpen ? 'hidden' : ''

  if (!isOpen) return
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

  await nextTick()
  gsap.from('#bm-mobile-menu a, #bm-mobile-menu [data-menu-cta]', {
    y: 24,
    autoAlpha: 0,
    duration: 0.4,
    stagger: 0.06,
    ease: 'power2.out',
  })
})

onMounted(() => {
  onScroll()
  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('keydown', onKeydown)
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScroll)
  window.removeEventListener('keydown', onKeydown)
  if (typeof document !== 'undefined') document.body.style.overflow = ''
})
</script>

<template>
  <header
    class="fixed top-0 z-40 w-full border-b transition-[background-color,box-shadow,border-color] duration-300"
    :class="scrolled
      ? 'border-border bg-background/90 shadow-sm backdrop-blur-md'
      : 'border-transparent bg-background/80 backdrop-blur-sm'"
  >
    <div class="bm-shell bm-gutter flex h-[4.5rem] items-center justify-between md:h-20">
      <a
        href="#top"
        aria-label="BlueMarket home"
        class="inline-flex items-center"
      >
        <BmWordmark
          class="h-[1.05rem] md:h-5 dark:brightness-0 dark:invert"
        />
      </a>

      <nav class="hidden items-center gap-6 md:flex lg:gap-8">
        <a
          v-for="link in links"
          :key="link.href"
          :href="link.href"
          class="text-sm text-muted-foreground transition-colors hover:text-foreground"
        >{{ link.label }}</a>
        <BmThemeToggle />
        <Button
          as="a"
          href="#contact"
          size="sm"
        >
          Start a conversation
        </Button>
      </nav>

      <div class="flex items-center gap-2 md:hidden">
        <BmThemeToggle />
        <button
          type="button"
          class="inline-flex size-11 items-center justify-center text-foreground"
          :aria-expanded="open"
          aria-controls="bm-mobile-menu"
          :aria-label="open ? 'Close menu' : 'Open menu'"
          @click="toggleMenu"
        >
          <Menu
            v-if="!open"
            class="size-6"
          />
          <X
            v-else
            class="size-6"
          />
        </button>
      </div>
    </div>
  </header>

  <Teleport to="body">
    <div
      v-if="open"
      id="bm-mobile-menu"
      class="fixed inset-0 z-50 flex h-dvh w-full flex-col bg-secondary text-left text-secondary-foreground md:hidden"
      role="dialog"
      aria-modal="true"
      aria-label="Menu"
    >
      <div class="flex h-[4.5rem] shrink-0 items-center justify-between px-[var(--bm-gutter)]">
        <a
          href="#top"
          class="inline-flex items-center"
          aria-label="BlueMarket home"
          @click="closeMenu"
        >
          <BmWordmark class="h-[1.05rem] brightness-0 invert" />
        </a>
        <button
          type="button"
          class="inline-flex size-11 items-center justify-center"
          aria-label="Close menu"
          @click="closeMenu"
        >
          <X class="size-7" />
        </button>
      </div>

      <nav class="flex flex-1 flex-col px-[var(--bm-gutter)] pt-8 pb-10">
        <a
          v-for="link in links"
          :key="link.href"
          :href="link.href"
          class="bm-display border-b border-white/15 py-6 text-[2.15rem] leading-none"
          @click="closeMenu"
        >{{ link.label }}</a>

        <div class="mt-8 flex items-center justify-between">
          <span class="text-sm text-white/70">Appearance</span>
          <BmThemeToggle />
        </div>

        <Button
          as="a"
          href="#contact"
          size="lg"
          data-menu-cta
          class="mt-auto h-12 w-full bg-white text-secondary hover:bg-white/90"
          @click="closeMenu"
        >
          Start a conversation
        </Button>
      </nav>
    </div>
  </Teleport>
</template>
