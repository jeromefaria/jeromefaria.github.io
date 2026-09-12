import { computed, type ComputedRef, readonly, type Ref, ref } from 'vue';

import { audioUrl } from '@/data/audio';
import type { AudioTrack } from '@/types/audio';

export type PlayerStatus = 'idle' | 'loading' | 'buffering' | 'playing' | 'paused' | 'ended' | 'error';

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
const isPlaying = computed(() => status.value === 'playing');
const isBusy = computed(() => isBusyStatus(status.value));

let generation = 0;
let retries = 0;
let element: HTMLAudioElement | null = null;

export interface PlayChapter {
  title: string;
  start: number;
}

export interface PlayContext {
  album?: string;
  artwork?: string;
  chapters?: readonly PlayChapter[];
}

const nowPlaying = ref<PlayContext>({});
const expanded = ref(false);
const immersive = ref(false);

const currentChapter = computed(() => {
  const { chapters } = nowPlaying.value;
  if (!chapters?.length) return undefined;

  return chapters.reduce((active, chapter) => (chapter.start <= currentTime.value ? chapter : active), chapters[0]);
});

const displayTitle = computed(() => currentChapter.value?.title ?? currentTrack.value?.title ?? '');

const MEDIA_HANDLERS: [MediaSessionAction, MediaSessionActionHandler][] = [
  ['play', () => void resume()],
  ['pause', () => pause()],
  ['nexttrack', () => void next()],
  ['previoustrack', () => void previous()],
  ['seekto', event => {
    if (typeof event.seekTime === 'number') seek(event.seekTime);
  }],
];

const registerMediaHandlers = (): void => {
  if (!('mediaSession' in navigator)) return;

  for (const [action, handler] of MEDIA_HANDLERS) navigator.mediaSession.setActionHandler(action, handler);
};

const updateMediaMetadata = (track: AudioTrack): void => {
  if (!('mediaSession' in navigator) || typeof MediaMetadata === 'undefined') return;

  const artworkSrc = track.artwork ?? nowPlaying.value.artwork;
  const artwork = artworkSrc
    ? [{ src: new URL(artworkSrc, location.href).href, sizes: '512x512', type: 'image/jpeg' }]
    : [];

  navigator.mediaSession.metadata = new MediaMetadata({
    title: track.title,
    artist: track.artist ?? 'Jerome Faria',
    album: nowPlaying.value.album ?? '',
    artwork,
  });
};

const clearMediaSession = (): void => {
  if (!('mediaSession' in navigator)) return;

  navigator.mediaSession.metadata = null;
  navigator.mediaSession.playbackState = 'none';
  for (const [action] of MEDIA_HANDLERS) navigator.mediaSession.setActionHandler(action, null);
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
    // eslint-disable-next-line local/no-comments -- non-obvious gotcha
    // The manifest duration is the canonical master length; a browser's decoded AAC duration lands a fraction under it and floors down a second, so only fall back to it when no authored duration exists.
    if (!duration.value && Number.isFinite(media.duration) && media.duration > 0) duration.value = media.duration;
  });
  media.addEventListener('ended', () => { void next(); });
  media.addEventListener('error', () => { scheduleRetry(generation); });
  element = media;
  registerMediaHandlers();

  return media;
};

const start = async (gen: number): Promise<void> => {
  const media = ensureElement();
  try {
    await media.play();
  } catch (thrown) {
    if (gen !== generation) return;
    if (thrown instanceof DOMException && thrown.name === 'AbortError') return;
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
  updateMediaMetadata(track);
  await start(gen);
};

export const play = async (tracks: AudioTrack[], startIndex = 0, context: PlayContext = {}): Promise<void> => {
  if (tracks.length === 0) return;

  nowPlaying.value = context;
  queue.value = tracks;
  index.value = Math.min(Math.max(startIndex, 0), tracks.length - 1);
  await load();
};

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
export const collapse = (): void => { expanded.value = false; immersive.value = false; };
export const enterImmersive = (): void => { expanded.value = true; immersive.value = true; };
export const exitImmersive = (): void => { immersive.value = false; };

export const stop = (): void => {
  generation += 1;
  if (element) {
    element.pause();
    element.removeAttribute('src');
    element.load();
    element = null;
  }
  clearMediaSession();
  queue.value = [];
  index.value = -1;
  currentTime.value = 0;
  duration.value = 0;
  error.value = null;
  status.value = 'idle';
  expanded.value = false;
  immersive.value = false;
};

export const pause = (): void => {
  element?.pause();
};

export const resume = async (): Promise<void> => {
  if (!currentTrack.value) return;

  if (status.value === 'error') {
    await load();
    return;
  }
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

export const stepEntry = (direction: 1 | -1): void => {
  const { chapters } = nowPlaying.value;
  if (chapters?.length) {
    const current = chapters.findIndex(chapter => chapter.start === currentChapter.value?.start);
    const target = chapters[current + direction];
    if (target) seek(target.start);
    return;
  }

  if (direction === 1) void next();
  else void previous();
};

export const goToEdge = (edge: 'first' | 'last'): void => {
  const { chapters } = nowPlaying.value;
  if (chapters?.length) {
    const chapter = edge === 'first' ? chapters[0] : chapters[chapters.length - 1];
    if (chapter) seek(chapter.start);
    return;
  }

  void select(edge === 'first' ? 0 : queue.value.length - 1);
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
  isPlaying: ComputedRef<boolean>;
  isBusy: ComputedRef<boolean>;
  context: Readonly<Ref<PlayContext>>;
  currentChapter: ComputedRef<PlayChapter | undefined>;
  displayTitle: ComputedRef<string>;
  expanded: Readonly<Ref<boolean>>;
  immersive: Readonly<Ref<boolean>>;
  play: typeof play;
  stepEntry: typeof stepEntry;
  goToEdge: typeof goToEdge;
  playFrom: typeof playFrom;
  pause: typeof pause;
  resume: typeof resume;
  toggle: typeof toggle;
  next: typeof next;
  previous: typeof previous;
  seek: typeof seek;
  select: typeof select;
  expand: typeof expand;
  collapse: typeof collapse;
  enterImmersive: typeof enterImmersive;
  exitImmersive: typeof exitImmersive;
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
  isPlaying,
  isBusy,
  context: readonly(nowPlaying),
  currentChapter,
  displayTitle,
  expanded: readonly(expanded),
  immersive: readonly(immersive),
  play,
  stepEntry,
  goToEdge,
  playFrom,
  pause,
  resume,
  toggle,
  next,
  previous,
  seek,
  select,
  expand,
  collapse,
  enterImmersive,
  exitImmersive,
  stop,
});

export const getMediaElement = (): HTMLAudioElement => ensureElement();
