<script setup lang="ts">
import { computed, ref } from 'vue';

import { useAccordionVisibility } from '@/composables/useAccordionContext';
import { audioPlayerEnabled } from '@/composables/useFeatureFlags';
import { play, playRelease, toggle, usePlayer } from '@/composables/usePlayer';
import { getReleaseAudio, hasPlayableAudio } from '@/data/audio';
import type { LightboxItem, Release } from '@/types';
import { hasBandcampId, hasBandcampUrl, hasCoverImage, hasCredits, hasDescription, hasExternalUrl, hasImages, hasSoundcloudUrl, hasTracklist, hasVideos } from '@/types';
import { externalizeLinks } from '@/utils/externalizeLinks';
import { toLightboxImage, toLightboxVideo } from '@/utils/lightboxAdapters';
import { renderCredits } from '@/utils/renderCredits';

import BandcampPlayer from './BandcampPlayer.vue';
import ExternalLink from './ExternalLink.vue';
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

const playable = computed(() => audioPlayerEnabled.value && hasPlayableAudio(props.release.id));

const audioTracks = computed(() => getReleaseAudio(props.release.id));

// Per-track play only when the display tracklist lines up 1:1 with the audio
// (2504's five movements are one continuous file, so it keeps release-level play).
const perTrackPlayable = computed(() =>
  playable.value && audioTracks.value.length === (props.release.tracklist?.length ?? 0));

const { currentTrack, status } = usePlayer();

const releaseContext = () => ({
  album: props.release.title,
  ...(hasCoverImage(props.release) ? { artwork: props.release.coverImage } : {}),
});

const isCurrentTrack = (index: number): boolean =>
  currentTrack.value?.key === audioTracks.value[index]?.key;

const isTrackPlaying = (index: number): boolean =>
  isCurrentTrack(index) && ['playing', 'loading', 'buffering'].includes(status.value);

// True while any track from this release is the one loaded in the player.
const releaseIsCurrent = computed(() =>
  audioTracks.value.some(track => track.key === currentTrack.value?.key));

const releaseActive = computed(() =>
  releaseIsCurrent.value && ['playing', 'loading', 'buffering'].includes(status.value));

const releaseBusy = computed(() =>
  releaseIsCurrent.value && ['loading', 'buffering'].includes(status.value));

const hasListenLinks = computed(() =>
  playable.value && (hasBandcampUrl(props.release) || hasSoundcloudUrl(props.release)));

const playThis = (): Promise<void> => playRelease(props.release.id, releaseContext());

const toggleRelease = (): void => {
  if (releaseIsCurrent.value) {
    toggle();
    return;
  }
  void playThis();
};

const playTrack = (index: number): void => {
  if (isCurrentTrack(index)) {
    toggle();
    return;
  }
  void play(audioTracks.value, index, releaseContext());
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
          <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path fill="currentColor" d="M8 5v14l11-7z" /></svg>
        </button>
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
        v-if="hasListenLinks"
        class="release-listen"
      >
        Listen:
        <ExternalLink
          v-if="hasBandcampUrl(release)"
          :href="release.bandcampUrl"
        >
          Bandcamp
        </ExternalLink>
        <span v-if="hasBandcampUrl(release) && hasSoundcloudUrl(release)"> · </span>
        <ExternalLink
          v-if="hasSoundcloudUrl(release)"
          :href="release.soundcloudUrl"
        >
          SoundCloud
        </ExternalLink>
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
          :class="{ 'track--playing': isCurrentTrack(index) }"
        >
          <button
            v-if="perTrackPlayable"
            type="button"
            class="track-play"
            :aria-label="`${isTrackPlaying(index) ? 'Pause' : 'Play'} ${track.title}`"
            @click="playTrack(index)"
          >
            <svg
              v-if="isTrackPlaying(index)"
              viewBox="0 0 24 24"
              aria-hidden="true"
              focusable="false"
            ><path fill="currentColor" d="M6 5h4v14H6zm8 0h4v14h-4z" /></svg>
            <svg
              v-else
              viewBox="0 0 24 24"
              aria-hidden="true"
              focusable="false"
            ><path fill="currentColor" d="M8 5v14l11-7z" /></svg>
          </button>
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
