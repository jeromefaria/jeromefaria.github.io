<script setup lang="ts">
// A link that opens in a new tab with safe rel. By default it appends a
// visually-hidden "(opens in a new tab)" cue; pass `ariaLabel` when the caller
// already conveys that in a full accessible name (avoids a double announcement).
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
