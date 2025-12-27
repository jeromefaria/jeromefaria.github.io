<script setup>
import { computed } from 'vue';

import { useImageLoader } from '@/composables/useImageLoader';

import BandcampPlayer from './BandcampPlayer.vue';

const props = defineProps({
  release: {
    type: Object,
    required: true,
  },
  textOnly: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['update-hash']);

const {
  imageRef,
  imageError,
  imageLoaded,
  webpSrc,
  handleImageLoad,
  handleImageError,
} = useImageLoader(props.release.coverImage);

const isBandcampLink = computed(() => props.release.externalUrl?.includes('bandcamp.com'));
</script>

<template>
  <article
    :id="release.id"
    class="release"
    :class="{ 'release--text-only': textOnly || imageError }"
  >
    <!-- Bandcamp Player -->
    <BandcampPlayer
      v-if="release.bandcampId && release.coverImage"
      :album-id="release.bandcampId"
      :cover-image="release.coverImage"
      :album-title="release.title"
    />

    <!-- External Link Cover -->
    <a
      v-else-if="release.externalUrl && release.coverImage && !imageError"
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
          ref="imageRef"
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
      v-else-if="release.coverImage && !imageError"
      class="release-cover release-cover--static"
    >
      <picture>
        <source
          :srcset="webpSrc"
          type="image/webp"
        >
        <img
          ref="imageRef"
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
          <button
            class="release-title-link"
            @click="emit('update-hash', release.id)"
          >
            <span v-if="!release.externalUrl">{{ release.title }}</span>
            <a
              v-else
              :href="release.externalUrl"
              target="_blank"
              rel="noopener noreferrer"
              @click.stop
            >{{ release.title }}</a>
          </button>
        </strong>
      </p>
      <p
        v-if="release.meta"
        class="release-meta"
        v-html="release.meta"
      />
      <p
        v-if="release.description"
        class="release-description"
        v-html="release.description"
      />
      <ol v-if="release.tracklist && release.tracklist.length">
        <li
          v-for="(track, index) in release.tracklist"
          :key="index"
          v-html="track"
        />
      </ol>
      <p
        v-if="release.credits"
        class="release-credits"
        v-html="release.credits"
      />
    </div>
  </article>
</template>
