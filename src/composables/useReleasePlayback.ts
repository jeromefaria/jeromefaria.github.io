import { computed } from 'vue';

import { isActiveStatus, isBusyStatus, toggle, usePlayer } from '@/composables/usePlayer';
import { getReleaseAudio } from '@/data/audio';
import type { Release } from '@/types';
import { canPlayRelease, playReleaseAt, releasePath } from '@/utils/releasePermalink';

// All of a release item's playback behaviour — release-level, per-track, and chaptered single-file.
export const useReleasePlayback = (releaseGetter: () => Release) => {
  const release = computed(releaseGetter);
  const { currentTrack, currentTime, status } = usePlayer();

  const playable = computed(() => canPlayRelease(release.value.id));
  const audioTracks = computed(() => getReleaseAudio(release.value.id));

  const perTrackPlayable = computed(() =>
    playable.value && audioTracks.value.length === (release.value.tracklist?.length ?? 0));

  // A single audio file whose display tracklist is split into timed movements (2504).
  const chaptered = computed(() =>
    playable.value
    && audioTracks.value.length === 1
    && (release.value.tracklist?.length ?? 0) > 1
    && (release.value.tracklist ?? []).every(movement => typeof movement.start === 'number'));

  const releaseIsCurrent = computed(() =>
    audioTracks.value.some(track => track.key === currentTrack.value?.key));

  const releaseActive = computed(() => releaseIsCurrent.value && isActiveStatus(status.value));
  const releaseBusy = computed(() => releaseIsCurrent.value && isBusyStatus(status.value));

  // The movement currently under the playhead — the last one whose offset has passed.
  const currentChapterIndex = computed(() => {
    if (!chaptered.value || !releaseIsCurrent.value) return -1;

    return (release.value.tracklist ?? []).reduce(
      (current, movement, movementIndex) => ((movement.start ?? 0) <= currentTime.value ? movementIndex : current),
      -1,
    );
  });

  const isCurrentTrack = (index: number): boolean =>
    currentTrack.value?.key === audioTracks.value[index]?.key;

  const isTrackPlaying = (index: number): boolean => isCurrentTrack(index) && isActiveStatus(status.value);

  const isCurrentChapter = (index: number): boolean => chaptered.value && currentChapterIndex.value === index;

  // The shareable path for a track: a 1-based index, or a time offset for chaptered single files.
  const trackHref = (index: number): string => {
    if (perTrackPlayable.value) return releasePath(release.value.id, { track: index + 1 });
    if (chaptered.value) return releasePath(release.value.id, { t: release.value.tracklist?.[index]?.start ?? 0 });
    return '';
  };

  const playThis = (): void => playReleaseAt(release.value);

  const toggleRelease = (): void => {
    if (releaseIsCurrent.value) {
      toggle();
      return;
    }
    playThis();
  };

  const playTrack = (index: number): void => {
    if (isCurrentTrack(index)) {
      toggle();
      return;
    }
    playReleaseAt(release.value, { track: index + 1 });
  };

  const playChapter = (index: number): void =>
    playReleaseAt(release.value, { t: release.value.tracklist?.[index]?.start ?? 0 });

  const activateTrack = (index: number): void => {
    if (perTrackPlayable.value) {
      playTrack(index);
      return;
    }
    if (chaptered.value) playChapter(index);
  };

  return {
    playable,
    perTrackPlayable,
    chaptered,
    releaseActive,
    releaseBusy,
    isCurrentTrack,
    isTrackPlaying,
    isCurrentChapter,
    trackHref,
    activateTrack,
    playThis,
    toggleRelease,
    playTrack,
    playChapter,
  };
};
