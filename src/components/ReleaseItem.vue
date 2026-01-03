<script setup lang="ts">
import { computed } from 'vue';

import { useImageLoader } from '@/composables/useImageLoader';
import type { LightboxItem, Release } from '@/types';

import BandcampPlayer from './BandcampPlayer.vue';

const props = withDefaults(defineProps<{
  release: Release;
  textOnly?: boolean;
}>(), {
  textOnly: false,
});

const emit = defineEmits<{
  'update-hash': [id: string];
  'open-lightbox': [items: LightboxItem[], index: number];
}>();

// Type guard to check if release has coverImage
const getCoverImage = (release: Release): string | undefined => {
  if ('coverImage' in release) {
    return release.coverImage;
  }
  return undefined;
};

const {
  imageError,
  imageLoaded,
  webpSrc,
  handleImageLoad,
  handleImageError,
} = useImageLoader(getCoverImage(props.release) || '');

// Computed properties with type guards for release properties
const hasBandcampId = computed(() => 'bandcampId' in props.release && props.release.bandcampId);
const hasExternalUrl = computed(() => 'externalUrl' in props.release && props.release.externalUrl);
const hasCoverImage = computed(() => 'coverImage' in props.release && props.release.coverImage);
const hasDescription = computed(() => 'description' in props.release && props.release.description);
const hasTracklist = computed(() => 'tracklist' in props.release && props.release.tracklist);
const hasCredits = computed(() => 'credits' in props.release && props.release.credits);
const hasImages = computed(() => 'images' in props.release && props.release.images);

const isBandcampLink = computed(() => {
  if ('externalUrl' in props.release && props.release.externalUrl) {
    return props.release.externalUrl.includes('bandcamp.com');
  }
  return false;
});
</script>

<template>
  <article
    :id="release.id"
    class="release"
    :class="{ 'release--text-only': textOnly || imageError }"
  >
    <!-- Bandcamp Player -->
    <BandcampPlayer
      v-if="hasBandcampId && hasCoverImage && 'bandcampId' in release && 'coverImage' in release"
      :album-id="release.bandcampId"
      :cover-image="release.coverImage"
      :album-title="release.title"
    />

    <!-- External Link Cover -->
    <a
      v-else-if="hasExternalUrl && hasCoverImage && !imageError && 'externalUrl' in release"
      :href="release.externalUrl"
      target="_blank"
      rel="noopener noreferrer"
      class="release-cover"
      :class="{ 'release-cover--bandcamp': isBandcampLink }"
    >
      <picture>
        <source
          :srcset="webpSrc"
          type="image/webp"
        >
        <img
          v-if="'coverImage' in release"
          :src="release.coverImage"
          :alt="`${release.title} cover`"
          loading="lazy"
          decoding="async"
          :class="{ 'is-loaded': imageLoaded }"
          @load="handleImageLoad"
          @error="handleImageError"
        >
      </picture>
    </a>

    <!-- Static Cover (no link) -->
    <div
      v-else-if="hasCoverImage && !imageError"
      class="release-cover release-cover--static"
    >
      <picture>
        <source
          :srcset="webpSrc"
          type="image/webp"
        >
        <img
          v-if="'coverImage' in release"
          :src="release.coverImage"
          :alt="`${release.title} cover`"
          loading="lazy"
          decoding="async"
          :class="{ 'is-loaded': imageLoaded }"
          @load="handleImageLoad"
          @error="handleImageError"
        >
      </picture>
    </div>

    <!-- Release Details -->
    <div class="release-details">
      <p>
        <strong>
          <a
            class="release-title-link"
            :href="`#${release.id}`"
            @click.prevent="emit('update-hash', release.id)"
          >{{ release.title }}</a>
        </strong>
      </p>
      <p
        v-if="release.meta"
        class="release-meta"
        v-html="release.meta"
      />
      <p
        v-if="hasDescription && 'description' in release"
        class="release-description"
        v-html="release.description"
      />
      <ol v-if="hasTracklist && 'tracklist' in release && release.tracklist.length">
        <li
          v-for="(track, index) in release.tracklist"
          :key="index"
          v-html="track"
        />
      </ol>
      <p
        v-if="hasCredits && 'credits' in release"
        class="release-credits"
        v-html="release.credits"
      />
      <p
        v-if="hasImages && 'images' in release && release.images.length"
        class="release-gallery-link"
      >
        <button
          class="link-discrete"
          @click="emit('open-lightbox', release.images.map(img => {
            const lightboxImg = { type: 'image' as const, src: img.src, alt: img.alt };
            if (img.photographer) Object.assign(lightboxImg, { photographer: img.photographer });
            return lightboxImg;
          }), 0)"
        >
          View gallery
        </button>
      </p>
    </div>
  </article>
</template>
