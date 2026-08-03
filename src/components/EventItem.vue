<script setup lang="ts">
import { computed } from 'vue';

import type { LightboxItem, LiveEvent, LiveImage, LiveVideo } from '@/types';
import { formatEventDate } from '@/utils/dateFormatter';
import { stripHtml } from '@/utils/formatters';

const props = defineProps<{
  event: LiveEvent;
}>();

const emit = defineEmits<{
  'update-hash': [id: string];
  'open-lightbox': [items: LightboxItem[], index: number];
}>();

const formattedDate = computed(() => formatEventDate(props.event.date));

// Some event titles embed a link (festival site or an internal /works ref).
// Render the title as plain text (the deep-link permalink) and surface the
// embedded link separately as a trailing icon, avoiding invalid nested anchors.
const titleText = computed(() => stripHtml(props.event.title));

const titleHref = computed(() => {
  const match = props.event.title.match(/href="([^"]+)"/);
  return match ? match[1] : null;
});

const titleHrefIsExternal = computed(() => /^https?:/i.test(titleHref.value ?? ''));

// Convert LiveImage to LightboxImage
const convertImagesToLightbox = (images: LiveImage[]): LightboxItem[] => {
  return images.map(img => {
    const lightboxImage: LightboxItem = {
      type: 'image' as const,
      src: img.src,
      alt: img.alt,
    };
    if (img.position) lightboxImage.position = img.position;
    if (img.scale) lightboxImage.scale = img.scale;
    if (img.rotate) lightboxImage.rotate = img.rotate;
    if (img.photographer) lightboxImage.photographer = img.photographer;
    return lightboxImage;
  });
};

// Convert LiveVideo to LightboxVideo
const convertVideosToLightbox = (videos: LiveVideo[]): LightboxItem[] => {
  return videos.map(vid => ({
    type: 'video' as const,
    url: vid.url,
    title: vid.title,
    platform: vid.platform,
  }));
};
</script>

<template>
  <article
    :id="event.id"
    class="event event--text-only"
  >
    <div class="event-details">
      <p>
        <strong>
          <a
            class="event-title-link"
            :href="`#${event.id}`"
            @click.prevent="emit('update-hash', event.id)"
          >{{ titleText }}</a>
          <a
            v-if="titleHref && titleHrefIsExternal"
            class="event-title-ref"
            :href="titleHref"
            target="_blank"
            rel="noopener noreferrer"
            :aria-label="`${titleText} website (opens in a new tab)`"
          ><span aria-hidden="true">↗</span></a>
          <RouterLink
            v-else-if="titleHref"
            class="event-title-ref"
            :to="titleHref"
            :aria-label="`View ${titleText}`"
          ><span aria-hidden="true">↗</span></RouterLink>
        </strong>
      </p>
      <p class="event-meta">
        <span
          v-if="event.date"
          class="event-date"
        >{{ formattedDate }} · </span>
        <span v-html="event.venue" />
      </p>
      <p
        v-if="event.description"
        class="event-description"
        v-html="event.description"
      />
      <p
        v-if="event.images?.length || event.videos?.length"
        class="event-photos-link"
      >
        <button
          v-if="event.images?.length"
          class="link-discrete"
          @click="emit('open-lightbox', convertImagesToLightbox(event.images), 0)"
        >
          View {{ event.images.length === 1 ? 'photo' : 'photos' }}
        </button>
        <span v-if="event.images?.length && event.videos?.length"> | </span>
        <button
          v-if="event.videos?.length"
          class="link-discrete"
          @click="emit('open-lightbox', convertVideosToLightbox(event.videos), 0)"
        >
          View {{ event.videos.length === 1 ? 'video' : 'videos' }}
        </button>
      </p>
    </div>
  </article>
</template>
