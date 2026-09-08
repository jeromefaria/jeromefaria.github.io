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
    notesHref?: string | undefined;
  }>(),
  { posters: () => [], downloadUrl: undefined, notesHref: undefined },
);

const emit = defineEmits<{
  'open-lightbox': [items: LightboxItem[], index: number, source: LightboxSource];
}>();

const t = useT();

type MediaLink =
  | { type: 'lightbox'; label: string; items: LightboxItem[]; kind: LightboxMediaKind }
  | { type: 'download'; label: string; href: string; aria: string }
  | { type: 'notes'; label: string; href: string };

const links = computed<MediaLink[]>(() => {
  const collected: MediaLink[] = [];

  if (props.images.length) {
    collected.push({ type: 'lightbox', label: props.imageLabel, items: props.images, kind: 'photo' });
  }
  if (props.posters.length) {
    collected.push({ type: 'lightbox', label: t(props.posters.length === 1 ? 'media.poster' : 'media.posters'), items: props.posters, kind: 'poster' });
  }
  if (props.videos.length) {
    collected.push({ type: 'lightbox', label: t(props.videos.length === 1 ? 'media.video' : 'media.videos'), items: props.videos, kind: 'video' });
  }
  if (props.downloadUrl) {
    collected.push({ type: 'download', label: t('media.download'), href: props.downloadUrl, aria: t('media.downloadAria') });
  }
  if (props.notesHref) {
    collected.push({ type: 'notes', label: t('media.notes'), href: props.notesHref });
  }

  return collected.sort((first, second) => first.label.localeCompare(second.label));
});
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
      <span
        v-if="index > 0"
        aria-hidden="true"
      > | </span>
      <button
        v-if="link.type === 'lightbox'"
        class="link-discrete"
        :aria-label="t('media.view', { label: link.label.toLowerCase() })"
        @click="emit('open-lightbox', link.items, 0, { id: sourceId, kind: link.kind })"
      >
        {{ link.label }}
      </button>
      <a
        v-else-if="link.type === 'download'"
        class="link-discrete"
        :href="link.href"
        target="_blank"
        rel="noopener noreferrer"
        :aria-label="link.aria"
      >
        {{ link.label }}
      </a>
      <RouterLink
        v-else
        class="link-discrete"
        :to="link.href"
      >
        {{ link.label }}
      </RouterLink>
    </template>
  </p>
</template>
