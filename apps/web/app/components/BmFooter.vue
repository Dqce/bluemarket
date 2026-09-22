<script setup lang="ts">
defineProps<{
  email: string
  location: string
}>()

const year = new Date().getFullYear()
</script>

<template>
  <footer class="bg-secondary text-left text-secondary-foreground">
    <div class="bm-shell bm-gutter flex flex-col gap-14 py-16 md:flex-row md:items-end md:justify-between md:py-20">
      <div>
        <BmWordmark class="h-6 brightness-0 invert md:h-7" />
        <p class="mt-8 max-w-sm text-base leading-relaxed text-white/70">
          Production systems for aviation and fintech. Built in the Western Cape.
        </p>
      </div>

      <dl class="grid gap-10 text-base sm:grid-cols-2 sm:gap-16">
        <div>
          <dt class="text-sm text-white/70">
            Email
          </dt>
          <dd class="mt-2">
            <a
              :href="`mailto:${email}`"
              class="underline-offset-4 hover:underline"
            >{{ email }}</a>
          </dd>
        </div>
        <div>
          <dt class="text-sm text-white/70">
            Location
          </dt>
          <dd class="mt-2">
            {{ location }}
          </dd>
        </div>
      </dl>
    </div>
    <div class="border-t border-white/10">
      <p class="bm-shell bm-gutter py-6 text-sm text-white/70">
        &copy; {{ year }} BlueMarket. All rights reserved.
      </p>
    </div>
  </footer>
</template>
