<script setup lang="ts">
import { computed } from 'vue';

import { useImageLoader } from '@/composables/useImageLoader';
import { responsiveSrcset } from '@/utils/responsiveImage';

import ExternalLink from './ExternalLink.vue';

const props = defineProps<{
  src: string;
  alt: string;
  href?: string | undefined;
  bandcamp?: boolean;
}>();

const emit = defineEmits<{ error: [] }>();

const { setImageRef, imageLoaded, webpSrc, handleImageLoad, handleImageError } = useImageLoader(props.src);

const coverSrcset = computed(() => responsiveSrcset(props.src));

const onError = (): void => {
  handleImageError();
  emit('error');
};

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
    <picture>
      <source
        v-if="coverSrcset"
        :srcset="coverSrcset"
        sizes="(min-width: 768px) 200px, 90vw"
        type="image/webp"
      >
      <source
        :srcset="webpSrc"
        type="image/webp"
      >
      <img
        :ref="setImageRef"
        :src="src"
        :alt="alt"
        loading="lazy"
        decoding="async"
        :class="{ 'is-loaded': imageLoaded }"
        @load="handleImageLoad"
        @error="onError"
      >
    </picture>
  </component>
</template>
