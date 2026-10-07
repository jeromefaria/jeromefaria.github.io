import { beforeEach, describe, expect, it, vi } from 'vitest';

import { enterImmersive, play, playFrom } from '@/composables/usePlayer';
import type { Release } from '@/types';

import { buildReleaseContext, findRelease, playReleaseAt, releaseHead, releasePath } from './releasePermalink';

vi.mock('@/composables/usePlayer', () => ({
  play: vi.fn(),
  playFrom: vi.fn(),
  enterImmersive: vi.fn(),
}));

const withCover: Release = {
  id: 'x',
  title: 'X',
  meta: { kind: 'music', mediums: ['Digital'], editions: [], released: '2020' },
  coverImage: '/images/x.jpg',
  description: 'A <a href="#">linked</a> note.',
};

const noCover: Release = {
  id: 'y',
  title: 'Y',
  meta: { kind: 'music', mediums: ['Digital'], editions: [], released: '2020' },
};

describe('releasePermalink', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('playReleaseAt', () => {
    const playable = findRelease('overlapse') as Release;

    it('plays from the start and does not enter immersive by default', () => {
      playReleaseAt(playable);
      expect(play).toHaveBeenCalledWith(expect.any(Array), 0, expect.anything());
      expect(enterImmersive).not.toHaveBeenCalled();
    });

    it('enters immersive mode when the option is set', () => {
      playReleaseAt(playable, { immersive: true });
      expect(play).toHaveBeenCalled();
      expect(enterImmersive).toHaveBeenCalledTimes(1);
    });

    it('plays a specific 1-based track index', () => {
      playReleaseAt(playable, { track: 1 });
      expect(play).toHaveBeenCalledWith(expect.any(Array), 0, expect.anything());
    });

    it('seeks to an offset via playFrom', () => {
      playReleaseAt(playable, { t: 100 });
      expect(playFrom).toHaveBeenCalledWith(expect.any(Array), 100, expect.anything());
    });

    it('ignores a release with no playable audio', () => {
      playReleaseAt(noCover);
      expect(play).not.toHaveBeenCalled();
      expect(enterImmersive).not.toHaveBeenCalled();
    });
  });

  describe('findRelease', () => {
    it('finds a release across sections', () => {
      expect(findRelease('overlapse')?.title).toBe('Overlapse');
      expect(findRelease('overlapse-xiii')?.id).toBe('overlapse-xiii');
    });

    it('returns undefined for an unknown id', () => {
      expect(findRelease('does-not-exist')).toBeUndefined();
    });
  });

  describe('buildReleaseContext', () => {
    it('includes artwork when a cover exists', () => {
      expect(buildReleaseContext(withCover)).toEqual({ album: 'X', artwork: '/images/x.jpg' });
    });

    it('omits artwork without a cover', () => {
      expect(buildReleaseContext(noCover)).toEqual({ album: 'Y' });
    });
  });

  describe('releaseHead', () => {
    it('strips HTML from the description and keeps the cover as the image', () => {
      const head = releaseHead(withCover);
      expect(head.title).toBe('X');
      expect(head.description).toBe('A linked note.');
      expect(head.image).toBe('/images/x.jpg');
      expect(head.ogType).toBe('music.album');
    });

    it('generates a description and omits the image without a cover', () => {
      const head = releaseHead(noCover);
      expect(head.description).toBe('Y — a release by Jerome Faria.');
      expect(head.image).toBeUndefined();
    });

    it('localizes the fallback description for Portuguese', () => {
      expect(releaseHead(noCover, 'pt').description).toBe('Y — uma edição de Jerome Faria.');
    });
  });

  describe('releasePath', () => {
    it('builds a bare release path', () => {
      expect(releasePath('overlapse')).toBe('/works/overlapse');
    });

    it('adds a 1-based track query', () => {
      expect(releasePath('overlapse', { track: 3 })).toBe('/works/overlapse?track=3');
    });

    it('adds a time offset and prefers it over a track', () => {
      expect(releasePath('2504', { t: 572 })).toBe('/works/2504?t=572');
      expect(releasePath('2504', { track: 2, t: 572 })).toBe('/works/2504?t=572');
    });

    it('appends i=1 when requested, alongside track or time', () => {
      expect(releasePath('overlapse', { immersive: true })).toBe('/works/overlapse?i=1');
      expect(releasePath('2504', { t: 572, immersive: true })).toBe('/works/2504?t=572&i=1');
    });
  });
});
