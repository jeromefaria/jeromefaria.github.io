import { beforeEach, describe, expect, it, vi } from 'vitest';

const TRACKS = [
  { key: 'x/1.m4a', title: 'One', duration: 100 },
  { key: 'x/2.m4a', title: 'Two', duration: 200 },
];

type PlayerModule = typeof import('./usePlayer');

const fire = (element: HTMLMediaElement, type: string): void => {
  element.dispatchEvent(new Event(type));
};

describe('usePlayer', () => {
  let mod: PlayerModule;
  let playMock: ReturnType<typeof vi.fn>;

  beforeEach(async () => {
    vi.resetModules();
    localStorage.clear();
    playMock = vi.fn().mockResolvedValue(undefined);
    HTMLMediaElement.prototype.play = playMock as unknown as HTMLMediaElement['play'];
    HTMLMediaElement.prototype.pause = vi.fn();
    HTMLMediaElement.prototype.load = vi.fn();
    mod = await import('./usePlayer');
  });

  it('loads and plays the first track, reaching playing on the event', async () => {
    await mod.play(TRACKS);
    const api = mod.usePlayer();

    expect(api.currentTrack.value?.title).toBe('One');
    expect(api.duration.value).toBe(100);
    expect(playMock).toHaveBeenCalled();

    fire(mod.getMediaElement(), 'playing');
    expect(api.status.value).toBe('playing');
  });

  it('does nothing when given an empty queue', async () => {
    await mod.play([]);
    expect(mod.usePlayer().currentTrack.value).toBeNull();
  });

  it('pauses and toggles play state', async () => {
    await mod.play(TRACKS);
    const api = mod.usePlayer();
    const element = mod.getMediaElement();
    fire(element, 'playing');

    api.toggle();
    expect(HTMLMediaElement.prototype.pause).toHaveBeenCalled();
    fire(element, 'pause');
    expect(api.status.value).toBe('paused');

    api.toggle();
    expect(playMock).toHaveBeenCalledTimes(2);
  });

  it('advances tracks and ends at the queue tail', async () => {
    await mod.play(TRACKS, 0);
    const api = mod.usePlayer();

    await mod.next();
    expect(api.currentTrack.value?.title).toBe('Two');
    expect(api.hasNext.value).toBe(false);

    await mod.next();
    expect(api.status.value).toBe('ended');
  });

  it('advances to the next track when one ends', async () => {
    await mod.play(TRACKS, 0);
    fire(mod.getMediaElement(), 'ended');
    await Promise.resolve();

    expect(mod.usePlayer().currentTrack.value?.title).toBe('Two');
  });

  it('previous restarts past the threshold, else steps back', async () => {
    await mod.play(TRACKS, 1);
    const api = mod.usePlayer();
    const element = mod.getMediaElement();

    element.currentTime = 5;
    await mod.previous();
    expect(api.currentTrack.value?.title).toBe('Two');
    expect(api.currentTime.value).toBe(0);

    element.currentTime = 1;
    await mod.previous();
    expect(api.currentTrack.value?.title).toBe('One');

    element.currentTime = 1;
    await mod.previous();
    expect(api.currentTrack.value?.title).toBe('One');
  });

  it('clamps seek within the track duration', async () => {
    await mod.play(TRACKS);
    const api = mod.usePlayer();

    mod.seek(50);
    expect(api.currentTime.value).toBe(50);

    mod.seek(9999);
    expect(api.currentTime.value).toBe(100);
  });

  it('mirrors media time, buffering, and duration events', async () => {
    await mod.play(TRACKS);
    const api = mod.usePlayer();
    const element = mod.getMediaElement();

    element.currentTime = 12;
    fire(element, 'timeupdate');
    expect(api.currentTime.value).toBe(12);

    fire(element, 'waiting');
    expect(api.status.value).toBe('buffering');

    Object.defineProperty(element, 'duration', { configurable: true, value: 321 });
    fire(element, 'durationchange');
    expect(api.duration.value).toBe(321);
  });

  it('retries on error with backoff then surfaces an error state', async () => {
    vi.useFakeTimers();
    await mod.play(TRACKS);
    const api = mod.usePlayer();
    const element = mod.getMediaElement();

    fire(element, 'error');
    await vi.advanceTimersByTimeAsync(600);
    fire(element, 'error');
    await vi.advanceTimersByTimeAsync(1200);
    fire(element, 'error');

    expect(api.status.value).toBe('error');
    expect(api.error.value).toBeTruthy();
    vi.useRealTimers();
  });

  it('ignores a superseded track whose load fails late', async () => {
    let rejectFirst: (reason: unknown) => void = () => {};
    playMock
      .mockImplementationOnce(() => new Promise((_resolve, reject) => { rejectFirst = reject; }))
      .mockResolvedValue(undefined);

    const first = mod.play(TRACKS, 0);
    const second = mod.play(TRACKS, 1);
    rejectFirst(new DOMException('aborted', 'AbortError'));
    await Promise.allSettled([first, second]);

    const api = mod.usePlayer();
    expect(api.currentTrack.value?.title).toBe('Two');
    expect(api.status.value).not.toBe('error');
  });

  it('no-ops seek, toggle, and resume before anything is loaded', async () => {
    const api = mod.usePlayer();

    mod.seek(10);
    await mod.resume();
    api.toggle();

    expect(api.currentTrack.value).toBeNull();
    expect(api.status.value).toBe('idle');
  });

  it('ignores a non-finite duration change', async () => {
    await mod.play(TRACKS);
    const element = mod.getMediaElement();

    Object.defineProperty(element, 'duration', { configurable: true, value: Number.NaN });
    fire(element, 'durationchange');

    expect(mod.usePlayer().duration.value).toBe(100);
  });

  it('keeps ended status through the pause event at the queue tail', async () => {
    await mod.play(TRACKS, 1);
    const api = mod.usePlayer();

    await mod.next();
    expect(api.status.value).toBe('ended');

    fire(mod.getMediaElement(), 'pause');
    expect(api.status.value).toBe('ended');
  });

  it('retries when the play promise rejects for a live track', async () => {
    vi.useFakeTimers();
    playMock.mockRejectedValue(new Error('network'));

    await mod.play(TRACKS);
    await vi.advanceTimersByTimeAsync(600);

    expect(mod.usePlayer().status.value).toBe('buffering');
    vi.useRealTimers();
  });

  it('plays a release by id from the manifest', async () => {
    await mod.playRelease('2504');
    expect(mod.usePlayer().currentTrack.value?.key).toContain('BRQN006');
  });

  it('expands and collapses the full view', () => {
    const api = mod.usePlayer();
    expect(api.expanded.value).toBe(false);

    mod.expand();
    expect(api.expanded.value).toBe(true);

    mod.collapse();
    expect(api.expanded.value).toBe(false);
  });

  it('selects a track within the current queue and ignores out-of-range', async () => {
    await mod.play(TRACKS);
    const api = mod.usePlayer();

    await mod.select(1);
    expect(api.currentTrack.value?.title).toBe('Two');

    await mod.select(99);
    expect(api.currentTrack.value?.title).toBe('Two');
  });

  it('stops playback and clears the queue so the bar unmounts', async () => {
    await mod.play(TRACKS);
    const api = mod.usePlayer();
    mod.expand();

    mod.stop();

    expect(HTMLMediaElement.prototype.pause).toHaveBeenCalled();
    expect(api.currentTrack.value).toBeNull();
    expect(api.status.value).toBe('idle');
    expect(api.expanded.value).toBe(false);
  });

  it('plays a new track and applies the start offset once metadata loads', async () => {
    await mod.playFrom([{ key: 'x/1.m4a', title: '2504', duration: 1504 }], 1292);
    const api = mod.usePlayer();
    expect(playMock).toHaveBeenCalled();

    fire(mod.getMediaElement(), 'loadedmetadata');
    expect(api.currentTime.value).toBe(1292);
  });

  it('seeks in place when the same single-file track is already loaded', async () => {
    const track = { key: 'x/1.m4a', title: '2504', duration: 1504 };
    await mod.play([track]);
    fire(mod.getMediaElement(), 'playing');
    playMock.mockClear();

    await mod.playFrom([track], 572);

    expect(mod.usePlayer().currentTime.value).toBe(572);
    expect(playMock).not.toHaveBeenCalled();
  });

  it('resumes a paused single-file track when a movement is picked', async () => {
    const track = { key: 'x/1.m4a', title: '2504', duration: 1504 };
    await mod.play([track]);
    fire(mod.getMediaElement(), 'playing');
    fire(mod.getMediaElement(), 'pause');
    playMock.mockClear();

    await mod.playFrom([track], 572);

    expect(mod.usePlayer().currentTime.value).toBe(572);
    expect(playMock).toHaveBeenCalled();
  });

  it('ignores playFrom with an empty track list', async () => {
    await mod.playFrom([], 100);
    expect(mod.usePlayer().currentTrack.value).toBeNull();
  });

  it('drops a pending start offset once a later track supersedes it', async () => {
    await mod.playFrom([{ key: 'a.m4a', title: 'A', duration: 1000 }], 500);
    await mod.play([{ key: 'b.m4a', title: 'B', duration: 200 }]);

    fire(mod.getMediaElement(), 'loadedmetadata');
    expect(mod.usePlayer().currentTime.value).toBe(0);
  });

  it('applies a start offset immediately when metadata is already available', async () => {
    Object.defineProperty(mod.getMediaElement(), 'readyState', { configurable: true, value: 1 });

    await mod.playFrom([{ key: 'x/1.m4a', title: '2504', duration: 1504 }], 900);

    expect(mod.usePlayer().currentTime.value).toBe(900);
  });

  it('cues and pauses when autoplay is blocked, without retrying into an error', async () => {
    playMock.mockRejectedValueOnce(new DOMException('blocked', 'NotAllowedError'));

    await mod.play(TRACKS);
    const api = mod.usePlayer();

    expect(api.status.value).toBe('paused');
    expect(api.currentTrack.value?.title).toBe('One');
    expect(api.error.value).toBeNull();
  });

  it('exposes the play context', async () => {
    await mod.play(TRACKS, 0, { album: 'An Album', artwork: '/cover.jpg' });
    expect(mod.usePlayer().context.value.album).toBe('An Album');
  });

  it('wires the Media Session when the API is available', async () => {
    const handlers: Record<string, (event?: { seekTime?: number }) => void> = {};
    Object.assign(navigator, {
      mediaSession: {
        metadata: null,
        setActionHandler: vi.fn((action: string, handler: () => void) => { handlers[action] = handler; }),
      },
    });
    vi.stubGlobal('MediaMetadata', class {
      constructor(public init: unknown) {}
    });

    await mod.play([{ key: 'r/1.m4a', title: 'Remix', duration: 60, artist: 'Some Remixer' }], 0,
      { album: 'Test Album', artwork: '/images/cover.jpg' });
    const { metadata } = (navigator as unknown as {
      mediaSession: { metadata: { init: { album: string; artist: string; artwork: { src: string }[] } } };
    }).mediaSession;
    expect(metadata.init.artist).toBe('Some Remixer');
    expect(metadata.init.album).toBe('Test Album');
    expect(metadata.init.artwork[0].src).toContain('cover.jpg');

    handlers.play();
    handlers.pause();
    handlers.nexttrack();
    handlers.previoustrack();
    handlers.seekto({ seekTime: 10 });
    expect(mod.usePlayer().currentTime.value).toBe(10);

    vi.unstubAllGlobals();
    delete (navigator as unknown as { mediaSession?: unknown }).mediaSession;
  });
});
