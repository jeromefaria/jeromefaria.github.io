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
    purchaseUrl?: string | undefined;
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
    v-if="links.length || purchaseUrl"
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

    <span v-if="purchaseUrl && links.length"> | </span>
    <a
      v-if="purchaseUrl"
      class="link-discrete"
      :href="purchaseUrl"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Purchase this release on Bandcamp (opens in a new tab)"
    >
      Purchase
    </a>
  </p>
</template>
