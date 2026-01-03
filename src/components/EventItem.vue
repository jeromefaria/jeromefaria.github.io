<script setup lang="ts">
import { computed } from 'vue';

import type { LightboxItem, LiveEvent, LiveImage, LiveVideo } from '@/types';
import { formatEventDate } from '@/utils/dateFormatter';

const props = defineProps<{
  event: LiveEvent;
}>();

const emit = defineEmits<{
  'update-hash': [id: string];
  'open-lightbox': [items: LightboxItem[], index: number];
}>();

const formattedDate = computed(() => formatEventDate(props.event.date));

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
            v-html="event.title"
          />
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
