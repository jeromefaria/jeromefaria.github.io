<script setup lang="ts">
import { computed } from 'vue';

import type { LightboxItem } from '@/types';
import { pluralize } from '@/utils/pluralize';

const props = withDefaults(
  defineProps<{
    images: LightboxItem[];
    videos: LightboxItem[];
    imageLabel: string;
    posters?: LightboxItem[];
  }>(),
  { posters: () => [] },
);

const emit = defineEmits<{
  'open-lightbox': [items: LightboxItem[], index: number];
}>();

// The visible label is a bare noun; the 'View …' aria-label keeps the affordance for assistive tech.
const links = computed(() =>
  [
    { items: props.images, label: props.imageLabel },
    { items: props.posters, label: pluralize(props.posters.length, 'Poster') },
    { items: props.videos, label: pluralize(props.videos.length, 'Video') },
  ].filter(link => link.items.length));
</script>

<template>
  <p
    v-if="links.length"
    class="media-links"
  >
    <template
      v-for="(link, index) in links"
      :key="link.label"
    >
      <span v-if="index > 0"> | </span>
      <button
        class="link-discrete"
        :aria-label="`View ${link.label.toLowerCase()}`"
        @click="emit('open-lightbox', link.items, 0)"
      >
        {{ link.label }}
      </button>
    </template>
  </p>
</template>
