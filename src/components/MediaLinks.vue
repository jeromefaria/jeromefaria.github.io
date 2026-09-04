<script setup lang="ts">
import { computed } from 'vue';

import { useT } from '@/i18n/useT';
import type { LightboxItem } from '@/types';
import type { LightboxMediaKind, LightboxSource } from '@/utils/lightboxPermalink';

const props = withDefaults(
  defineProps<{
    images: LightboxItem[];
    videos: LightboxItem[];
    imageLabel: string;
    sourceId: string;
    posters?: LightboxItem[];
    downloadUrl?: string | undefined;
  }>(),
  { posters: () => [], downloadUrl: undefined },
);

const emit = defineEmits<{
  'open-lightbox': [items: LightboxItem[], index: number, source: LightboxSource];
}>();

const t = useT();

const links = computed(() =>
  [
    { items: props.images, label: props.imageLabel, kind: 'photo' as LightboxMediaKind },
    { items: props.posters, label: t(props.posters.length === 1 ? 'media.poster' : 'media.posters'), kind: 'poster' as LightboxMediaKind },
    { items: props.videos, label: t(props.videos.length === 1 ? 'media.video' : 'media.videos'), kind: 'video' as LightboxMediaKind },
  ].filter(link => link.items.length));
</script>

<template>
  <p
    v-if="links.length || downloadUrl"
    class="media-links"
  >
    <template
      v-for="(link, index) in links"
      :key="link.label"
    >
      <span v-if="index > 0"> | </span>
      <button
        class="link-discrete"
        :aria-label="t('media.view', { label: link.label.toLowerCase() })"
        @click="emit('open-lightbox', link.items, 0, { id: sourceId, kind: link.kind })"
      >
        {{ link.label }}
      </button>
    </template>

    <span v-if="downloadUrl && links.length"> | </span>
    <a
      v-if="downloadUrl"
      class="link-discrete"
      :href="downloadUrl"
      target="_blank"
      rel="noopener noreferrer"
      :aria-label="t('media.downloadAria')"
    >
      {{ t('media.download') }}
    </a>
  </p>
</template>
