<script setup lang="ts">
import { computed, ref } from 'vue';

import { useAccordionVisibility } from '@/composables/useAccordionContext';
import { useLightboxDeepLink } from '@/composables/useLightboxDeepLink';
import { useProse } from '@/composables/useProse';
import { useReleasePlayback } from '@/composables/useReleasePlayback';
import { useLocale } from '@/i18n/useLocale';
import { useT } from '@/i18n/useT';
import type { LightboxItem, Release } from '@/types';
import { hasBandcampId, hasBandcampUrl, hasCoverImage, hasCredits, hasDescription, hasExternalUrl, hasImages, hasTracklist, hasVideos } from '@/types';
import { externalizeLinks } from '@/utils/externalizeLinks';
import { toLightboxImage, toLightboxVideo } from '@/utils/lightboxAdapters';
import type { LightboxSource } from '@/utils/lightboxPermalink';
import { releasePath } from '@/utils/releasePermalink';
import { renderCredits } from '@/utils/renderCredits';

import BandcampPlayer from './BandcampPlayer.vue';
import IconPause from './IconPause.vue';
import IconPlay from './IconPlay.vue';
import MediaLinks from './MediaLinks.vue';
import PlayableCover from './PlayableCover.vue';
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
  'open-lightbox': [items: LightboxItem[], index: number, source: LightboxSource];
}>();

const coverVisible = useAccordionVisibility();

const t = useT();
const { current, toLocalePath } = useLocale();
const renderProse = useProse();
const coverErrored = ref(false);

const imageLightboxItems = computed<LightboxItem[]>(() =>
  hasImages(props.release) ? props.release.images.map(image => toLightboxImage(image, current.value)) : []);

const videoLightboxItems = computed<LightboxItem[]>(() =>
  hasVideos(props.release) ? props.release.videos.map(video => toLightboxVideo(video, current.value)) : []);

useLightboxDeepLink(
  props.release.id,
  { photo: imageLightboxItems, video: videoLightboxItems },
  (items, index, source) => emit('open-lightbox', items, index, source),
);

const isBandcampLink = computed(() =>
  hasExternalUrl(props.release) && props.release.externalUrl.includes('bandcamp.com'));

const {
  playable,
  perTrackPlayable,
  chaptered,
  releaseActive,
  releaseBusy,
  isCurrentTrack,
  isTrackPlaying,
  isCurrentChapter,
  isChapterPlaying,
  trackHref,
  activateTrack,
  playThis,
  toggleRelease,
  playTrack,
  playChapter,
} = useReleasePlayback(() => props.release);

// Keep copy-link/permalink hrefs in the active locale; trackHref is '' for non-linkable tracks.
const localizedTrackHref = (index: number): string => {
  const path = trackHref(index);
  return path ? toLocalePath(path) : path;
};
</script>

<template>
  <article
    :id="release.id"
    class="release"
    :class="{ 'release--text-only': textOnly || coverErrored }"
  >
    <PlayableCover
      v-if="coverVisible && playable && hasCoverImage(release) && !coverErrored"
      :src="release.coverImage"
      :alt="`${release.title} cover`"
      :title="release.title"
      :active="releaseActive"
      :busy="releaseBusy"
      @toggle="toggleRelease"
      @error="coverErrored = true"
    />

    <BandcampPlayer
      v-else-if="coverVisible && hasBandcampId(release) && hasCoverImage(release)"
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
        <button
          v-if="playable && !hasCoverImage(release)"
          type="button"
          class="release-play"
          :aria-label="`Play ${release.title}`"
          @click="playThis"
        >
          <IconPlay />
        </button>
        <strong>
          <a
            class="release-title-link"
            :href="toLocalePath(releasePath(release.id))"
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
        v-html="renderProse(release.description)"
      />
      <ol v-if="hasTracklist(release) && release.tracklist.length">
        <li
          v-for="(track, index) in release.tracklist"
          :key="index"
          :class="{ 'track--playing': isCurrentTrack(index) || isCurrentChapter(index) }"
        >
          <button
            v-if="perTrackPlayable"
            type="button"
            class="track-play"
            :aria-label="`${isTrackPlaying(index) ? 'Pause' : 'Play'} ${track.title}`"
            @click="playTrack(index)"
          >
            <IconPause v-if="isTrackPlaying(index)" />
            <IconPlay v-else />
          </button>
          <button
            v-else-if="chaptered"
            type="button"
            class="track-play"
            :aria-label="`${isChapterPlaying(index) ? 'Pause' : 'Play'} ${track.title}`"
            @click="playChapter(index)"
          >
            <IconPause v-if="isChapterPlaying(index)" />
            <IconPlay v-else />
          </button>
          <TrackListItem
            :track="track"
            :href="localizedTrackHref(index)"
            @play="activateTrack(index)"
          />
        </li>
      </ol>
      <p
        v-if="hasCredits(release)"
        class="release-credits"
        v-html="externalizeLinks(renderCredits(release.credits, release.contributors, current))"
      />
      <MediaLinks
        :images="imageLightboxItems"
        :videos="videoLightboxItems"
        :image-label="t('media.gallery')"
        :source-id="release.id"
        :download-url="hasBandcampUrl(release) ? release.bandcampUrl : undefined"
        @open-lightbox="(items, index, source) => emit('open-lightbox', items, index, source)"
      />
    </div>
  </article>
</template>
