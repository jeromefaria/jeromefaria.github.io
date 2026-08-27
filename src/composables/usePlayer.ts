import { computed, type ComputedRef, readonly, type Ref, ref } from 'vue';

import { audioUrl, getReleaseAudio } from '@/data/audio';
import type { AudioTrack } from '@/types/audio';

export type PlayerStatus = 'idle' | 'loading' | 'buffering' | 'playing' | 'paused' | 'ended' | 'error';

const RETRY_LIMIT = 2;
const RETRY_BASE_MS = 500;
const RESTART_THRESHOLD_SEC = 3;

const status = ref<PlayerStatus>('idle');
const queue = ref<AudioTrack[]>([]);
const index = ref(-1);
const currentTime = ref(0);
const duration = ref(0);
const error = ref<string | null>(null);

const currentTrack = computed<AudioTrack | null>(() => queue.value[index.value] ?? null);
const hasNext = computed(() => index.value < queue.value.length - 1);
const hasPrevious = computed(() => index.value > 0);

// A monotonic token: each load bumps it, so a late event or retry from a track the
// user has already skipped past is recognised as stale and ignored (the classic race).
let generation = 0;
let retries = 0;
let element: HTMLAudioElement | null = null;

const setMediaSession = (track: AudioTrack): void => {
  if (!('mediaSession' in navigator) || typeof MediaMetadata === 'undefined') return;

  navigator.mediaSession.metadata = new MediaMetadata({ title: track.title, artist: 'Jerome Faria' });
  navigator.mediaSession.setActionHandler('play', () => void resume());
  navigator.mediaSession.setActionHandler('pause', pause);
  navigator.mediaSession.setActionHandler('nexttrack', () => void next());
  navigator.mediaSession.setActionHandler('previoustrack', () => void previous());
  navigator.mediaSession.setActionHandler('seekto', event => {
    if (typeof event.seekTime === 'number') seek(event.seekTime);
  });
};

const scheduleRetry = (gen: number): void => {
  if (retries >= RETRY_LIMIT) {
    status.value = 'error';
    error.value = 'Playback failed. Check your connection and try again.';
    return;
  }

  retries += 1;
  status.value = 'buffering';
  setTimeout(() => {
    if (gen !== generation || !element) return;
    element.load();
    void start(gen);
  }, RETRY_BASE_MS * retries);
};

const ensureElement = (): HTMLAudioElement => {
  if (element) return element;

  const media = new Audio();
  media.preload = 'metadata';
  media.addEventListener('playing', () => { status.value = 'playing'; });
  media.addEventListener('pause', () => { if (status.value !== 'ended') status.value = 'paused'; });
  media.addEventListener('waiting', () => { status.value = 'buffering'; });
  media.addEventListener('timeupdate', () => { currentTime.value = media.currentTime; });
  media.addEventListener('durationchange', () => {
    if (Number.isFinite(media.duration) && media.duration > 0) duration.value = media.duration;
  });
  media.addEventListener('ended', () => { void next(); });
  media.addEventListener('error', () => { scheduleRetry(generation); });
  element = media;

  return media;
};

const start = async (gen: number): Promise<void> => {
  const media = ensureElement();
  try {
    await media.play();
  } catch (thrown) {
    if (gen !== generation) return;
    // A src swap aborts the pending play() with AbortError — expected on rapid track changes.
    if (thrown instanceof DOMException && thrown.name === 'AbortError') return;
    scheduleRetry(gen);
  }
};

const load = async (): Promise<void> => {
  const track = currentTrack.value;
  if (!track) return;

  const gen = ++generation;
  retries = 0;
  error.value = null;
  currentTime.value = 0;
  duration.value = track.duration;
  status.value = 'loading';

  const media = ensureElement();
  media.src = audioUrl(track.key);
  setMediaSession(track);
  await start(gen);
};

export const play = async (tracks: AudioTrack[], startIndex = 0): Promise<void> => {
  if (tracks.length === 0) return;

  queue.value = tracks;
  index.value = Math.min(Math.max(startIndex, 0), tracks.length - 1);
  await load();
};

export const playRelease = (releaseId: string, startIndex = 0): Promise<void> =>
  play(getReleaseAudio(releaseId), startIndex);

export const pause = (): void => {
  element?.pause();
};

export const resume = async (): Promise<void> => {
  if (!currentTrack.value) return;
  await start(generation);
};

export const toggle = (): void => {
  if (status.value === 'playing' || status.value === 'buffering' || status.value === 'loading') {
    pause();
    return;
  }
  void resume();
};

export const next = async (): Promise<void> => {
  if (!hasNext.value) {
    status.value = 'ended';
    element?.pause();
    return;
  }

  index.value += 1;
  await load();
};

export const previous = async (): Promise<void> => {
  if (element && element.currentTime > RESTART_THRESHOLD_SEC) {
    seek(0);
    return;
  }

  if (!hasPrevious.value) {
    seek(0);
    return;
  }

  index.value -= 1;
  await load();
};

export const seek = (time: number): void => {
  if (!element) return;

  const clamped = Math.min(Math.max(time, 0), duration.value || element.duration || 0);
  element.currentTime = clamped;
  currentTime.value = clamped;
};

interface PlayerApi {
  status: Readonly<Ref<PlayerStatus>>;
  currentTrack: ComputedRef<AudioTrack | null>;
  queue: Readonly<Ref<AudioTrack[]>>;
  currentTime: Readonly<Ref<number>>;
  duration: Readonly<Ref<number>>;
  error: Readonly<Ref<string | null>>;
  hasNext: ComputedRef<boolean>;
  hasPrevious: ComputedRef<boolean>;
  play: typeof play;
  playRelease: typeof playRelease;
  pause: typeof pause;
  resume: typeof resume;
  toggle: typeof toggle;
  next: typeof next;
  previous: typeof previous;
  seek: typeof seek;
}

export const usePlayer = (): PlayerApi => ({
  status: readonly(status),
  currentTrack,
  queue: readonly(queue) as Readonly<Ref<AudioTrack[]>>,
  currentTime: readonly(currentTime),
  duration: readonly(duration),
  error: readonly(error),
  hasNext,
  hasPrevious,
  play,
  playRelease,
  pause,
  resume,
  toggle,
  next,
  previous,
  seek,
});

// Exposed for unit tests to drive media events on the singleton element.
export const getMediaElement = (): HTMLAudioElement => ensureElement();
