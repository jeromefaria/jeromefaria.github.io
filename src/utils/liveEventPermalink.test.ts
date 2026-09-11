import { describe, expect, it } from 'vitest';

import type { LiveEvent } from '@/types';

import { findLiveEvent, liveEventHead } from './liveEventPermalink';

describe('liveEventPermalink', () => {
  describe('findLiveEvent', () => {
    it('finds an event by its id', () => {
      const event = findLiveEvent('showcase-casa-amarela');
      expect(event?.id).toBe('showcase-casa-amarela');
    });

    it('returns null for an unknown id', () => {
      expect(findLiveEvent('no-such-event')).toBeNull();
    });
  });

  describe('liveEventHead', () => {
    it('builds a localized title and a factual English description', () => {
      const event = findLiveEvent('showcase-casa-amarela');
      expect(event).not.toBeNull();
      if (!event) return;

      const head = liveEventHead(event, 'en');
      expect(head.title.length).toBeGreaterThan(0);
      expect(head.description).toContain('Jerome Faria live at');
      expect(head.description).toContain('·');
    });

    it('localizes the description for Portuguese', () => {
      const event = findLiveEvent('showcase-casa-amarela');
      expect(event).not.toBeNull();
      if (!event) return;

      expect(liveEventHead(event, 'pt').description).toContain('ao vivo em');
    });

    it('uses "in" (not "at") for a country-only event with no named venue', () => {
      const event: LiveEvent = {
        id: 'venue-tbc',
        title: 'Untitled',
        date: '2027-05-01',
        venue: { country: 'Portugal' },
        setup: { kind: 'solo' },
      };

      expect(liveEventHead(event, 'en').description).toContain('live in Portugal');
    });
  });
});
