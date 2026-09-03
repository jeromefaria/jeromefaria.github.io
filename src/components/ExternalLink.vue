<script setup lang="ts">
import { useT } from '@/i18n/useT';

// Pass `ariaLabel` when the caller's accessible name already conveys "new tab",
// so the visually-hidden cue isn't announced twice.
defineProps<{
  href: string;
  ariaLabel?: string;
}>();

const t = useT();
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
    > {{ t('common.newTabCue') }}</span>
  </a>
</template>
