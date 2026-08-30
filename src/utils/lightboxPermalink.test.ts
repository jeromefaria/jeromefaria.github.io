import { describe, expect, it } from 'vitest';

import { baseFragment, mediaFragment, parseMediaFragment } from './lightboxPermalink';

describe('lightboxPermalink', () => {
  describe('mediaFragment', () => {
    it('builds a 1-based #id/kind/index fragment from a 0-based index', () => {
      expect(mediaFragment({ id: 'madeiradig-2011', kind: 'photo' }, 0)).toBe('madeiradig-2011/photo/1');
      expect(mediaFragment({ id: 'caligari-live', kind: 'video' }, 2)).toBe('caligari-live/video/3');
    });
  });

  describe('parseMediaFragment', () => {
    it('parses a valid fragment to a 0-based index', () => {
      expect(parseMediaFragment('madeiradig-2011/photo/1')).toEqual({
        id: 'madeiradig-2011',
        kind: 'photo',
        index: 0,
      });
      expect(parseMediaFragment('ev/poster/4')).toEqual({ id: 'ev', kind: 'poster', index: 3 });
    });

    it('rejects an unknown kind, a plain id, or a zero index', () => {
      expect(parseMediaFragment('ev/audio/1')).toBeNull();
      expect(parseMediaFragment('madeiradig-2011')).toBeNull();
      expect(parseMediaFragment('ev/photo/0')).toBeNull();
      expect(parseMediaFragment('ev/photo/x')).toBeNull();
    });
  });

  describe('baseFragment', () => {
    it('strips the media suffix but passes a plain fragment through', () => {
      expect(baseFragment('madeiradig-2011/photo/2')).toBe('madeiradig-2011');
      expect(baseFragment('madeiradig-2011')).toBe('madeiradig-2011');
      expect(baseFragment('section-live-2011')).toBe('section-live-2011');
    });
  });
});
