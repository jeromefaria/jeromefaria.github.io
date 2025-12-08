<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'

const props = defineProps({
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

const imageRef = ref(null)
const showPlayer = ref(false)
const isLoaded = ref(false)
const imageError = ref(false)
const imageLoaded = ref(false)

const webpSrc = computed(() => props.coverImage.replace(/\.jpg$/, '.webp'))

onMounted(async () => {
  await nextTick()
  if (imageRef.value?.complete && imageRef.value?.naturalHeight > 0) {
    imageLoaded.value = true
  }
})

const loadPlayer = () => {
  if (showPlayer.value) return
  showPlayer.value = true
}

const handleIframeLoad = () => {
  isLoaded.value = true
}

const handleImageLoad = () => {
  imageLoaded.value = true
}

const handleImageError = () => {
  imageError.value = true
}
</script>

<template>
  <div
    class="bandcamp-player"
    :class="{ loading: showPlayer && !isLoaded, 'image-error': imageError }"
    @click="loadPlayer"
  >
    <div v-if="!showPlayer && !imageError && !imageLoaded" class="image-spinner">
      <span class="loading-dot" />
      <span class="loading-dot" />
      <span class="loading-dot" />
    </div>
    <picture v-if="!showPlayer && !imageError">
      <source :srcset="webpSrc" type="image/webp" />
      <img
        ref="imageRef"
        :src="coverImage"
        :alt="`${albumTitle} album cover`"
        loading="lazy"
        decoding="async"
        width="200"
        height="200"
        :class="{ 'is-loaded': imageLoaded }"
        @load="handleImageLoad"
        @error="handleImageError"
      />
    </picture>
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
