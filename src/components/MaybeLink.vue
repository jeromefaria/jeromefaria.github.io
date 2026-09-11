<script setup lang="ts">
import ExternalLink from './ExternalLink.vue';

defineOptions({ inheritAttrs: false });

defineProps<{
  href?: string | undefined;
}>();
</script>

<template>
  <ExternalLink
    v-if="href"
    v-bind="$attrs"
    :href="href"
  >
    <slot />
  </ExternalLink>
  <template v-else>
    <slot />
  </template>
</template>
