<script setup lang="ts">
import { useT } from '@/i18n/useT';

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
