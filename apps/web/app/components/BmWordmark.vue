<script setup lang="ts">
withDefaults(defineProps<{ class?: string }>(), { class: '' })
</script>

<template>
  <img
    src="/bluemarket-wordmark.png"
    alt="BlueMarket"
    draggable="false"
    :class="['block w-auto select-none', $props.class]"
  >
</template>
