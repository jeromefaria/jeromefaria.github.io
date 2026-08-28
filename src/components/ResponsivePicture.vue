<script setup lang="ts">
import type { StyleValue } from 'vue';
import { computed } from 'vue';

import { useImageLoader } from '@/composables/useImageLoader';
import { imageDimensions, responsiveSrcset } from '@/utils/responsiveImage';

const props = defineProps<{
  src: string;
  alt: string;
  sizes?: string;
  imageStyle?: StyleValue;
}>();

const emit = defineEmits<{ error: [] }>();

const { setImageRef, imageLoaded, webpSrc, handleImageLoad, handleImageError } = useImageLoader(props.src);

const srcset = computed(() => responsiveSrcset(props.src));
const dimensions = computed(() => imageDimensions(props.src));

const onError = (): void => {
  handleImageError();
  emit('error');
};
</script>

<template>
  <picture>
    <source
      v-if="srcset"
      :srcset="srcset"
      :sizes="sizes"
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
      :width="dimensions?.width"
      :height="dimensions?.height"
      :style="imageStyle"
      loading="lazy"
      decoding="async"
      :class="{ 'is-loaded': imageLoaded }"
      @load="handleImageLoad"
      @error="onError"
    >
  </picture>
</template>

<style scoped lang="scss">
img {
  @include image-reveal;
}
</style>
