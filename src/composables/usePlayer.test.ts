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
