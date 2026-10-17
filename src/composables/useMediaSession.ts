import type { Ref } from 'vue';
import { watch } from 'vue';

import type { PlayContext, PlayerStatus } from '@/composables/usePlayer';
import type { AudioTrack } from '@/types/audio';

const PLAYBACK_STATES: Record<PlayerStatus, MediaSessionPlaybackState> = {
  idle: 'none',
  loading: 'playing',
  buffering: 'playing',
  playing: 'playing',
  paused: 'paused',
  ended: 'paused',
  error: 'none',
};

interface MediaSessionHandlers {
  play: () => void;
  pause: () => void;
  next: () => void;
  previous: () => void;
  seek: (time: number) => void;
}

interface MediaSessionDeps {
  status: Ref<PlayerStatus>;
  currentTime: Ref<number>;
  duration: Ref<number>;
  context: Ref<PlayContext>;
  playbackRate: () => number;
  handlers: MediaSessionHandlers;
}

interface MediaSessionController {
  register: () => void;
  updateMetadata: (track: AudioTrack) => void;
  clear: () => void;
  updatePosition: () => void;
}

export const createMediaSession = ({
  status,
  currentTime,
  duration,
  context,
  playbackRate,
  handlers,
}: MediaSessionDeps): MediaSessionController => {
  const actionHandlers: [MediaSessionAction, MediaSessionActionHandler][] = [
    ['play', () => handlers.play()],
    ['pause', () => handlers.pause()],
    ['nexttrack', () => handlers.next()],
    ['previoustrack', () => handlers.previous()],
    ['seekto', event => {
      if (typeof event.seekTime === 'number') handlers.seek(event.seekTime);
    }],
  ];

  const register = (): void => {
    if (!('mediaSession' in navigator)) return;

    for (const [action, handler] of actionHandlers) navigator.mediaSession.setActionHandler(action, handler);
  };

  const updateMetadata = (track: AudioTrack): void => {
    if (!('mediaSession' in navigator) || typeof MediaMetadata === 'undefined') return;

    const artworkSrc = track.artwork ?? context.value.artwork;
    const artwork = artworkSrc
      ? [{ src: new URL(artworkSrc, location.href).href, sizes: '512x512', type: 'image/jpeg' }]
      : [];

    navigator.mediaSession.metadata = new MediaMetadata({
      title: track.title,
      artist: track.artist ?? 'Jerome Faria',
      album: context.value.album ?? '',
      artwork,
    });
  };

  const clear = (): void => {
    if (!('mediaSession' in navigator)) return;

    navigator.mediaSession.metadata = null;
    // eslint-disable-next-line local/no-comments -- non-obvious gotcha
    // Clearing the position state is required: without it iOS keeps a phantom Now Playing entry after the element is gone, extrapolating a moving timeline from the last reported position with no audio or artwork.
    navigator.mediaSession.setPositionState?.();
    navigator.mediaSession.playbackState = 'none';
    for (const [action] of actionHandlers) navigator.mediaSession.setActionHandler(action, null);
  };

  const updatePlaybackState = (): void => {
    if (!('mediaSession' in navigator)) return;

    navigator.mediaSession.playbackState = PLAYBACK_STATES[status.value];
  };

  const updatePosition = (): void => {
    if (!('mediaSession' in navigator)) return;

    const total = duration.value;
    if (!Number.isFinite(total) || total <= 0) return;

    // eslint-disable-next-line local/no-comments -- browser-support gotcha
    // setPositionState is absent on older WebKit even when mediaSession exists, and it throws unless 0 <= position <= duration, so the reported position is clamped to the reported duration.
    navigator.mediaSession.setPositionState?.({
      duration: total,
      position: Math.min(Math.max(currentTime.value, 0), total),
      playbackRate: playbackRate(),
    });
  };

  watch(status, updatePlaybackState, { flush: 'sync' });

  return { register, updateMetadata, clear, updatePosition };
};
