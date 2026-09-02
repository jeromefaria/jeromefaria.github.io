import { describe, expect, it } from 'vitest';

import type { Release } from '@/types';

import { buildReleaseContext, findRelease, releaseHead, releasePath } from './releasePermalink';

const withCover: Release = {
  id: 'x',
  title: 'X',
  meta: { kind: 'music', mediums: ['Digital'], editions: [], year: 2020 },
  coverImage: '/images/x.jpg',
  description: 'A <a href="#">linked</a> note.',
};

const noCover: Release = {
  id: 'y',
  title: 'Y',
  meta: { kind: 'music', mediums: ['Digital'], editions: [], year: 2020 },
};

describe('releasePermalink', () => {
  describe('findRelease', () => {
    it('finds a release across sections', () => {
      expect(findRelease('overlapse')?.title).toBe('Overlapse');
      expect(findRelease('overlapse-xiii')?.id).toBe('overlapse-xiii');
    });

    it('returns null for an unknown id', () => {
      expect(findRelease('does-not-exist')).toBeNull();
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
  });
});
