<script setup lang="ts">
import { computed } from 'vue';

import type { LightboxItem } from '@/types';
import type { LightboxMediaKind, LightboxSource } from '@/utils/lightboxPermalink';
import { pluralize } from '@/utils/pluralize';

const props = withDefaults(
  defineProps<{
    images: LightboxItem[];
    videos: LightboxItem[];
    imageLabel: string;
    sourceId: string;
    posters?: LightboxItem[];
  }>(),
  { posters: () => [] },
);

const emit = defineEmits<{
  'open-lightbox': [items: LightboxItem[], index: number, source: LightboxSource];
}>();

// The visible label is a bare noun; the 'View …' aria-label keeps the affordance for assistive tech.
const links = computed(() =>
  [
    { items: props.images, label: props.imageLabel, kind: 'photo' as LightboxMediaKind },
    { items: props.posters, label: pluralize(props.posters.length, 'Poster'), kind: 'poster' as LightboxMediaKind },
    { items: props.videos, label: pluralize(props.videos.length, 'Video'), kind: 'video' as LightboxMediaKind },
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
        @click="emit('open-lightbox', link.items, 0, { id: sourceId, kind: link.kind })"
      >
        {{ link.label }}
      </button>
    </template>
  </p>
</template>
