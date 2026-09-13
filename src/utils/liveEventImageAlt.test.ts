import { describe, expect, it } from 'vitest';

import { liveEvents } from '@/data/live';
import { SUPPORTED_LOCALES } from '@/i18n/messages';

import { liveEventImageAlt } from './liveEventImageAlt';
import { liveEventImageAltGolden } from './liveEventImageAlt.golden';

const goldenEvents = liveEvents.filter(event => liveEventImageAltGolden[event.id]);

describe('liveEventImageAlt', () => {
  it('derives an alt for every event captured in the golden fixture', () => {
    expect(goldenEvents).toHaveLength(Object.keys(liveEventImageAltGolden).length);
  });

  for (const event of goldenEvents) {
    for (const locale of SUPPORTED_LOCALES) {
      it(`matches the golden ${event.id} alt (${locale})`, () => {
        expect(liveEventImageAlt(event, locale)).toBe(liveEventImageAltGolden[event.id]?.[locale]);
      });
    }
  }

  it('derives a non-empty alt for every image-bearing event in both locales', () => {
    for (const event of liveEvents.filter(candidate => candidate.images?.length)) {
      for (const locale of SUPPORTED_LOCALES) {
        expect(liveEventImageAlt(event, locale).trim().length, `id="${event.id}" (${locale})`).toBeGreaterThan(0);
      }
    }
  });
});
