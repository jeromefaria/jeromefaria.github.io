<script setup lang="ts">
import { ref } from 'vue';

import { useImageLoader } from '@/composables/useImageLoader';

const props = defineProps({
  albumId: {
    type: String,
    required: true,
  },
  coverImage: {
    type: String,
    required: true,
  },
  albumTitle: {
    type: String,
    required: true,
  },
});

const {
  imageError,
  imageLoaded,
  webpSrc,
  handleImageLoad,
  handleImageError,
} = useImageLoader(props.coverImage);

const showPlayer = ref(false);
const isLoaded = ref(false);

const loadPlayer = () => {
  if (showPlayer.value) return;
  showPlayer.value = true;
};

const handleIframeLoad = () => {
  isLoaded.value = true;
};
</script>

<template>
  <div
    class="bandcamp-player"
    :class="{ 'bandcamp-player--loading': showPlayer && !isLoaded, 'bandcamp-player--error': imageError }"
    @click="loadPlayer"
  >
    <picture v-if="!showPlayer && !imageError">
      <source
        :srcset="webpSrc"
        type="image/webp"
      >
      <img
        :src="coverImage"
        :alt="`${albumTitle} album cover`"
        loading="lazy"
        decoding="async"
        width="200"
        height="200"
        :class="{ 'is-loaded': imageLoaded }"
        @load="handleImageLoad"
        @error="handleImageError"
      >
    </picture>
    <div
      v-if="!showPlayer && imageError"
      class="bandcamp-player__fallback"
    />
    <button
      v-if="!showPlayer"
      class="bandcamp-player__button"
      type="button"
      :aria-label="`Play ${albumTitle}`"
    />
    <div
      v-if="showPlayer && !isLoaded"
      class="bandcamp-player__loading"
      aria-label="Loading player"
    >
      Loading...
    </div>
    <iframe
      v-if="showPlayer"
      :src="`https://bandcamp.com/EmbeddedPlayer/album=${albumId}/size=large/bgcol=000000/linkcol=ffffff/minimal=true/transparent=true/`"
      seamless
      sandbox="allow-scripts allow-same-origin allow-popups"
      :title="`${albumTitle} - Bandcamp player`"
      @load="handleIframeLoad"
    />
  </div>
</template>
