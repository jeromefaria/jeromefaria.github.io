<script setup lang="ts">
import { computed } from 'vue';

import ExternalLink from './ExternalLink.vue';
import ResponsivePicture from './ResponsivePicture.vue';

const props = defineProps<{
  src: string;
  alt: string;
  href?: string | undefined;
  bandcamp?: boolean;
}>();

defineEmits<{ error: [] }>();

const wrapperClass = computed(() => ({
  'release-cover': true,
  'release-cover--static': !props.href,
  'release-cover--bandcamp': Boolean(props.href) && Boolean(props.bandcamp),
}));
</script>

<template>
  <component
    :is="href ? ExternalLink : 'div'"
    :href="href"
    :class="wrapperClass"
  >
    <ResponsivePicture
      :src="src"
      :alt="alt"
      sizes="(min-width: 768px) 200px, 90vw"
      @error="$emit('error')"
    />
  </component>
</template>
