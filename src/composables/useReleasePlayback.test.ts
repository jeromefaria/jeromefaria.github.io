import { flushPromises } from '@vue/test-utils';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { Release } from '@/types';

import { audioPlayerEnabled } from './useFeatureFlags';
import { stop } from './usePlayer';
import { useReleasePlayback } from './useReleasePlayback';

const music = { kind: 'music', mediums: ['Digital'], editions: [{ label: { text: 'BRØQN' } }], year: 2010 } as const;

const aligned: Release = {
  id: '1714',
  title: '17:14',
  meta: music,
  tracklist: [{ title: '8:58' }, { title: '2:58' }, { title: '5:18' }],
};

const chaptered: Release = {
  id: '2504',
  title: '2504',
  meta: music,
  tracklist: [
    { title: 'Prólogo', start: 0 },
    { title: 'Fado', start: 212 },
    { title: 'Fátima', start: 572 },
    { title: 'Futebol', start: 932 },
    { title: 'Epílogo', start: 1292 },
  ],
};

describe('useReleasePlayback', () => {
  beforeEach(() => {
    HTMLMediaElement.prototype.play = vi.fn().mockResolvedValue(undefined);
    HTMLMediaElement.prototype.pause = vi.fn();
    HTMLMediaElement.prototype.load = vi.fn();
    audioPlayerEnabled.value = true;
    stop();
  });

  it('distinguishes per-track from chaptered releases', () => {
    expect(useReleasePlayback(() => aligned).perTrackPlayable.value).toBe(true);
    expect(useReleasePlayback(() => aligned).chaptered.value).toBe(false);
    expect(useReleasePlayback(() => chaptered).chaptered.value).toBe(true);
    expect(useReleasePlayback(() => chaptered).perTrackPlayable.value).toBe(false);
  });

  it('builds track permalinks as a 1-based index or a time offset', () => {
    expect(useReleasePlayback(() => aligned).trackHref(0)).toBe('/works/1714?track=1');
    expect(useReleasePlayback(() => chaptered).trackHref(2)).toBe('/works/2504?t=572');
  });

  it('plays a release and then toggles it when it is already current', async () => {
    const playback = useReleasePlayback(() => aligned);

    playback.playThis();
    await flushPromises();
    expect(HTMLMediaElement.prototype.play).toHaveBeenCalled();
    expect(playback.releaseActive.value).toBe(true);

    playback.toggleRelease();
    expect(HTMLMediaElement.prototype.pause).toHaveBeenCalled();
  });

  it('reports nothing playable when the audio player is disabled', () => {
    audioPlayerEnabled.value = false;
    expect(useReleasePlayback(() => aligned).playable.value).toBe(false);
    expect(useReleasePlayback(() => aligned).trackHref(0)).toBe('');
  });
});
