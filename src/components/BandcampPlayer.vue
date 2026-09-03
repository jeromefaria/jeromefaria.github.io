<script setup lang="ts">
import { computed, ref } from 'vue';

import { useImageLoader } from '@/composables/useImageLoader';
import { useT } from '@/i18n/useT';

const props = defineProps<{
  albumId: string;
  coverImage: string;
  albumTitle: string;
}>();

const {
  setImageRef,
  imageError,
  imageLoaded,
  webpSrc,
  handleImageLoad,
  handleImageError,
} = useImageLoader(props.coverImage);

const t = useT();

const showPlayer = ref(false);
const isLoaded = ref(false);

const BANDCAMP_EMBED_PARAMS = 'size=large/bgcol=000000/linkcol=ffffff/minimal=true/transparent=true';
const embedUrl = computed(() =>
  `https://bandcamp.com/EmbeddedPlayer/album=${props.albumId}/${BANDCAMP_EMBED_PARAMS}/`);

const loadPlayer = () => {
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
  >
    <picture v-if="!showPlayer && !imageError">
      <source
        :srcset="webpSrc"
        type="image/webp"
      >
      <img
        :ref="setImageRef"
        :src="coverImage"
        alt=""
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
      :aria-label="t('player.playTitle', { title: albumTitle })"
      @click="loadPlayer"
    />
    <div
      v-if="showPlayer && !isLoaded"
      class="bandcamp-player__loading"
      :aria-label="t('player.loading')"
    >
      {{ t('player.loadingShort') }}
    </div>
    <iframe
      v-if="showPlayer"
      :src="embedUrl"
      seamless
      sandbox="allow-scripts allow-same-origin allow-popups"
      :title="t('player.bandcampTitle', { title: albumTitle })"
      @load="handleIframeLoad"
    />
  </div>
</template>
