<script setup lang="ts">
import { computed, ref } from 'vue';

import { useAccordionVisibility } from '@/composables/useAccordionContext';
import type { LightboxItem, Release } from '@/types';
import { hasBandcampId, hasCoverImage, hasCredits, hasDescription, hasExternalUrl, hasImages, hasTracklist, hasVideos } from '@/types';
import { formatMeta } from '@/utils/formatMeta';
import { toLightboxImage, toLightboxVideo } from '@/utils/lightboxAdapters';

import BandcampPlayer from './BandcampPlayer.vue';
import MediaLinks from './MediaLinks.vue';
import ReleaseCover from './ReleaseCover.vue';

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

// Defer cover loading until the release's accordion section is first opened —
// collapsed sections sit at zero height near the viewport, defeating native
// lazy-loading.
const coverVisible = useAccordionVisibility();

// Set when the cover image fails to load, so we fall back to a text-only layout.
const coverErrored = ref(false);

const imageLightboxItems = computed<LightboxItem[]>(() =>
  hasImages(props.release) ? props.release.images.map(toLightboxImage) : []);

const videoLightboxItems = computed<LightboxItem[]>(() =>
  hasVideos(props.release) ? props.release.videos.map(toLightboxVideo) : []);

const isBandcampLink = computed(() =>
  hasExternalUrl(props.release) && props.release.externalUrl.includes('bandcamp.com'));
</script>

<template>
  <article
    :id="release.id"
    class="release"
    :class="{ 'release--text-only': textOnly || coverErrored }"
  >
    <BandcampPlayer
      v-if="coverVisible && hasBandcampId(release) && hasCoverImage(release)"
      :album-id="release.bandcampId"
      :cover-image="release.coverImage"
      :album-title="release.title"
    />

    <!-- Cover — rendered as an external link when the release has one -->
    <ReleaseCover
      v-else-if="coverVisible && hasCoverImage(release) && !coverErrored"
      :src="release.coverImage"
      :alt="`${release.title} cover`"
      :href="hasExternalUrl(release) ? release.externalUrl : undefined"
      :bandcamp="isBandcampLink"
      @error="coverErrored = true"
    />

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
        class="release-meta"
        v-html="formatMeta(release.meta)"
      />
      <p
        v-if="hasDescription(release)"
        class="release-description"
        v-html="release.description"
      />
      <ol v-if="hasTracklist(release) && release.tracklist.length">
        <li
          v-for="(track, index) in release.tracklist"
          :key="index"
          v-html="track"
        />
      </ol>
      <p
        v-if="hasCredits(release)"
        class="release-credits"
        v-html="release.credits"
      />
      <MediaLinks
        :images="imageLightboxItems"
        :videos="videoLightboxItems"
        image-label="View gallery"
        @open-lightbox="(items, index) => emit('open-lightbox', items, index)"
      />
    </div>
  </article>
</template>
