import { computed, type ComputedRef, readonly, type Ref, ref } from 'vue';

import { audioUrl, getReleaseAudio } from '@/data/audio';
import type { AudioTrack } from '@/types/audio';

export type PlayerStatus = 'idle' | 'loading' | 'buffering' | 'playing' | 'paused' | 'ended' | 'error';

// "Busy" narrows "active" to the not-yet-audible part, used for buffering affordances.
const ACTIVE_STATUSES: PlayerStatus[] = ['playing', 'loading', 'buffering'];
const BUSY_STATUSES: PlayerStatus[] = ['loading', 'buffering'];

export const isActiveStatus = (playerStatus: PlayerStatus): boolean => ACTIVE_STATUSES.includes(playerStatus);
export const isBusyStatus = (playerStatus: PlayerStatus): boolean => BUSY_STATUSES.includes(playerStatus);

const RETRY_LIMIT = 2;
const RETRY_BASE_MS = 500;
const RESTART_THRESHOLD_SEC = 3;
const HAVE_METADATA = 1;

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

export interface PlayContext {
  album?: string;
  artwork?: string;
}

const nowPlaying = ref<PlayContext>({});
const expanded = ref(false);

const setMediaSession = (track: AudioTrack): void => {
  if (!('mediaSession' in navigator) || typeof MediaMetadata === 'undefined') return;

  const artwork = nowPlaying.value.artwork
    ? [{ src: new URL(nowPlaying.value.artwork, location.href).href, sizes: '512x512', type: 'image/jpeg' }]
    : [];

  navigator.mediaSession.metadata = new MediaMetadata({
    title: track.title,
    artist: track.artist ?? 'Jerome Faria',
    album: nowPlaying.value.album ?? '',
    artwork,
  });
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
    // Autoplay blocked (e.g. a shared link opened without a prior gesture): stay cued and
    // paused so a single tap starts it, rather than churning through retries into an error.
    if (thrown instanceof DOMException && thrown.name === 'NotAllowedError') {
      status.value = 'paused';
      return;
    }
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

export const play = async (tracks: AudioTrack[], startIndex = 0, context: PlayContext = {}): Promise<void> => {
  if (tracks.length === 0) return;

  nowPlaying.value = context;
  queue.value = tracks;
  index.value = Math.min(Math.max(startIndex, 0), tracks.length - 1);
  await load();
};

// The generation guard drops this offset if the user has since jumped to another track.
const applyStartOffset = (gen: number, seconds: number): void => {
  if (!element || gen !== generation) return;

  if (element.readyState >= HAVE_METADATA) {
    seek(seconds);
    return;
  }

  const onReady = (): void => {
    element?.removeEventListener('loadedmetadata', onReady);
    if (gen === generation) seek(seconds);
  };
  element.addEventListener('loadedmetadata', onReady);
};

export const playFrom = async (tracks: AudioTrack[], seconds: number, context: PlayContext = {}): Promise<void> => {
  if (tracks.length === 0) return;

  if (tracks.length === 1 && currentTrack.value?.key === tracks[0]?.key) {
    seek(seconds);
    if (!isActiveStatus(status.value)) await resume();
    return;
  }

  await play(tracks, 0, context);
  applyStartOffset(generation, seconds);
};

export const select = async (targetIndex: number): Promise<void> => {
  if (targetIndex < 0 || targetIndex >= queue.value.length) return;

  index.value = targetIndex;
  await load();
};

export const expand = (): void => { expanded.value = true; };
export const collapse = (): void => { expanded.value = false; };

// Clearing the queue empties currentTrack, which unmounts the bar.
export const stop = (): void => {
  generation += 1;
  element?.pause();
  queue.value = [];
  index.value = -1;
  currentTime.value = 0;
  duration.value = 0;
  error.value = null;
  status.value = 'idle';
  expanded.value = false;
};

export const playRelease = (releaseId: string, context?: PlayContext): Promise<void> =>
  play(getReleaseAudio(releaseId), 0, context);

export const pause = (): void => {
  element?.pause();
};

export const resume = async (): Promise<void> => {
  if (!currentTrack.value) return;
  await start(generation);
};

export const toggle = (): void => {
  if (isActiveStatus(status.value)) {
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
  context: Readonly<Ref<PlayContext>>;
  expanded: Readonly<Ref<boolean>>;
  play: typeof play;
  playFrom: typeof playFrom;
  playRelease: typeof playRelease;
  pause: typeof pause;
  resume: typeof resume;
  toggle: typeof toggle;
  next: typeof next;
  previous: typeof previous;
  seek: typeof seek;
  select: typeof select;
  expand: typeof expand;
  collapse: typeof collapse;
  stop: typeof stop;
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
  context: readonly(nowPlaying),
  expanded: readonly(expanded),
  play,
  playFrom,
  playRelease,
  pause,
  resume,
  toggle,
  next,
  previous,
  seek,
  select,
  expand,
  collapse,
  stop,
});

// Exposed for unit tests to drive media events on the singleton element.
export const getMediaElement = (): HTMLAudioElement => ensureElement();
