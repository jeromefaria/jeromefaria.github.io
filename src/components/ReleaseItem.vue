<script setup>
import BandcampPlayer from './BandcampPlayer.vue'

defineProps({
  release: {
    type: Object,
    required: true
  },
  textOnly: {
    type: Boolean,
    default: false
  }
})
</script>

<template>
  <article class="release" :class="{ 'release--text-only': textOnly }">
    <!-- Bandcamp Player -->
    <BandcampPlayer
      v-if="release.bandcampId && release.coverImage"
      :album-id="release.bandcampId"
      :cover-image="release.coverImage"
      :album-title="release.title"
    />

    <!-- External Link Cover -->
    <a
      v-else-if="release.externalUrl && release.coverImage"
      :href="release.externalUrl"
      target="_blank"
      rel="noopener noreferrer"
      class="release-cover"
    >
      <img :src="release.coverImage" :alt="`${release.title} cover`" loading="lazy" />
    </a>

    <!-- Static Cover (no link) -->
    <img
      v-else-if="release.coverImage"
      :src="release.coverImage"
      :alt="`${release.title} cover`"
      loading="lazy"
    />

    <!-- Release Details -->
    <div class="release-details">
      <p>
        <strong>{{ release.title }}</strong>
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
