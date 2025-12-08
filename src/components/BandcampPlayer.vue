<script setup>
import { ref } from 'vue'

defineProps({
  albumId: {
    type: String,
    required: true
  },
  coverImage: {
    type: String,
    required: true
  },
  albumTitle: {
    type: String,
    required: true
  }
})

const showPlayer = ref(false)
const isLoaded = ref(false)
const imageError = ref(false)

function loadPlayer() {
  if (showPlayer.value) return
  showPlayer.value = true
}

function handleIframeLoad() {
  isLoaded.value = true
}

function handleImageError() {
  imageError.value = true
}
</script>

<template>
  <div
    class="bandcamp-player"
    :class="{ loading: showPlayer && !isLoaded, 'image-error': imageError }"
    @click="loadPlayer"
  >
    <img
      v-if="!showPlayer && !imageError"
      :src="coverImage"
      :alt="`${albumTitle} album cover`"
      loading="lazy"
      decoding="async"
      width="200"
      height="200"
      @error="handleImageError"
    />
    <div v-if="!showPlayer && imageError" class="image-fallback" />
    <button
      v-if="!showPlayer"
      class="play-button"
      type="button"
      :aria-label="`Play ${albumTitle}`"
    />
    <div v-if="showPlayer && !isLoaded" class="loading-indicator" aria-label="Loading player">
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
