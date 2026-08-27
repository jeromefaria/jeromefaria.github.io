<script setup lang="ts">
import { computed, ref } from 'vue';

import { useAccordionVisibility } from '@/composables/useAccordionContext';
import type { LightboxItem, Release } from '@/types';
import { hasBandcampId, hasCoverImage, hasCredits, hasDescription, hasExternalUrl, hasImages, hasTracklist, hasVideos } from '@/types';
import { externalizeLinks } from '@/utils/externalizeLinks';
import { toLightboxImage, toLightboxVideo } from '@/utils/lightboxAdapters';
import { renderCredits } from '@/utils/renderCredits';

import BandcampPlayer from './BandcampPlayer.vue';
import MediaLinks from './MediaLinks.vue';
import ReleaseCover from './ReleaseCover.vue';
import ReleaseMeta from './ReleaseMeta.vue';
import TrackListItem from './TrackListItem.vue';

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

// Collapsed accordion sections sit at zero height, defeating native
// lazy-loading; defer cover loading until the section is first opened.
const coverVisible = useAccordionVisibility();

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
      <p class="release-meta">
        <ReleaseMeta :meta="release.meta" />
      </p>
      <p
        v-if="hasDescription(release)"
        class="release-description"
        v-html="externalizeLinks(release.description)"
      />
      <ol v-if="hasTracklist(release) && release.tracklist.length">
        <li
          v-for="(track, index) in release.tracklist"
          :key="index"
        >
          <TrackListItem :track="track" />
        </li>
      </ol>
      <p
        v-if="hasCredits(release)"
        class="release-credits"
        v-html="externalizeLinks(renderCredits(release.credits, release.contributors))"
      />
      <MediaLinks
        :images="imageLightboxItems"
        :videos="videoLightboxItems"
        image-label="Gallery"
        @open-lightbox="(items, index) => emit('open-lightbox', items, index)"
      />
    </div>
  </article>
</template>
