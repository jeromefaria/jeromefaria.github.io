<script setup>
import { ref } from 'vue'

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

const isLoaded = ref(false)
const isLoading = ref(false)

function loadPlayer() {
  if (isLoaded.value || isLoading.value) return
  isLoading.value = true
  // Small delay to show loading state
  setTimeout(() => {
    isLoaded.value = true
    isLoading.value = false
  }, 100)
}
</script>

<template>
  <div
    class="bandcamp-player"
    :class="{ loading: isLoading }"
    @click="loadPlayer"
  >
    <img
      v-if="!isLoaded"
      :src="coverImage"
      :alt="`${albumTitle} album cover`"
      loading="lazy"
    />
    <button
      v-if="!isLoaded"
      class="play-button"
      type="button"
      :aria-label="`Play ${albumTitle}`"
    />
    <iframe
      v-if="isLoaded"
      :src="`https://bandcamp.com/EmbeddedPlayer/album=${albumId}/size=large/bgcol=000000/linkcol=ffffff/minimal=true/transparent=true/`"
      seamless
      :title="`${albumTitle} - Bandcamp player`"
    />
  </div>
</template>
