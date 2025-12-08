<script setup>
import { ref, computed } from 'vue'
import BandcampPlayer from './BandcampPlayer.vue'

const props = defineProps({
  release: {
    type: Object,
    required: true
  },
  textOnly: {
    type: Boolean,
    default: false
  }
})

const imageError = ref(false)
const imageLoaded = ref(false)

const isBandcampLink = computed(() => {
  return props.release.externalUrl?.includes('bandcamp.com')
})

function handleImageLoad() {
  imageLoaded.value = true
}

function handleImageError() {
  imageError.value = true
}
</script>

<template>
  <article :id="release.id" class="release" :class="{ 'release--text-only': textOnly || imageError }">
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
      <div v-if="!imageLoaded" class="image-spinner">
        <span class="loading-dot" />
        <span class="loading-dot" />
        <span class="loading-dot" />
      </div>
      <img
        :src="release.coverImage"
        :alt="`${release.title} cover`"
        loading="lazy"
        decoding="async"
        width="200"
        height="200"
        :class="{ 'is-loaded': imageLoaded }"
        @load="handleImageLoad"
        @error="handleImageError"
      />
    </a>

    <!-- Static Cover (no link) -->
    <div
      v-else-if="release.coverImage && !imageError"
      class="release-cover release-cover--static"
    >
      <div v-if="!imageLoaded" class="image-spinner">
        <span class="loading-dot" />
        <span class="loading-dot" />
        <span class="loading-dot" />
      </div>
      <img
        :src="release.coverImage"
        :alt="`${release.title} cover`"
        loading="lazy"
        decoding="async"
        width="200"
        height="200"
        :class="{ 'is-loaded': imageLoaded }"
        @load="handleImageLoad"
        @error="handleImageError"
      />
    </div>

    <!-- Release Details -->
    <div class="release-details">
      <p>
        <strong v-if="!release.externalUrl">{{ release.title }}</strong>
        <strong v-else><a :href="release.externalUrl" target="_blank" rel="noopener noreferrer">{{ release.title }}</a></strong>
      </p>
      <p v-if="release.meta" class="release-meta" v-html="release.meta" />
      <p v-if="release.description" class="release-description" v-html="release.description" />
      <ol v-if="release.tracklist && release.tracklist.length">
        <li v-for="(track, index) in release.tracklist" :key="index" v-html="track" />
      </ol>
      <p v-if="release.credits" class="release-credits" v-html="release.credits" />
    </div>
  </article>
</template>
