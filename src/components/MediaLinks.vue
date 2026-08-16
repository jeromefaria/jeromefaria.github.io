<script setup lang="ts">
import type { LightboxItem } from '@/types';

defineProps<{
  images: LightboxItem[];
  videos: LightboxItem[];
  imageLabel: string;
}>();

const emit = defineEmits<{
  'open-lightbox': [items: LightboxItem[], index: number];
}>();
</script>

<template>
  <p
    v-if="images.length || videos.length"
    class="media-links"
  >
    <button
      v-if="images.length"
      class="link-discrete"
      @click="emit('open-lightbox', images, 0)"
    >
      {{ imageLabel }}
    </button>
    <span v-if="images.length && videos.length"> | </span>
    <button
      v-if="videos.length"
      class="link-discrete"
      @click="emit('open-lightbox', videos, 0)"
    >
      View {{ videos.length === 1 ? 'video' : 'videos' }}
    </button>
  </p>
</template>
