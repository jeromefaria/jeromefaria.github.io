<script setup lang="ts">
// Pass `ariaLabel` when the caller's accessible name already conveys "new tab",
// so the visually-hidden cue isn't announced twice.
defineProps<{
  href: string;
  ariaLabel?: string;
}>();
</script>

<template>
  <a
    :href="href"
    target="_blank"
    rel="noopener noreferrer"
    :aria-label="ariaLabel"
  >
    <slot />
    <span
      v-if="!ariaLabel"
      class="visually-hidden"
    > (opens in a new tab)</span>
  </a>
</template>
