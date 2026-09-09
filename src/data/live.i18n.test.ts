import { describe, expect, it } from 'vitest';

import { buildEventDescription, linkEntities } from '@/utils/liveDescription';

import { liveEvents } from './live';

const markers = (text: string): string[] =>
  [...text.matchAll(/\[\[([^\]]+)\]\]/g)].map(match => match[1]).sort();

const noted = liveEvents.filter((event): event is typeof event & { note: { en: string; pt: string } } =>
  Boolean(event.note));

describe('live event descriptions', () => {
  it('compose distinct Portuguese and English text', () => {
    const differing = liveEvents.filter(event => buildEventDescription(event, 'pt') !== buildEventDescription(event, 'en'));
    expect(differing.length).toBeGreaterThan(0);
  });

  it('resolve the Portuguese note into the pt description', () => {
    expect(noted.length).toBeGreaterThan(0);
    for (const event of noted) {
      expect(buildEventDescription(event, 'pt')).toContain(linkEntities(event.note.pt));
    }
  });

  it('keep an identical entity-marker set in each note across locales', () => {
    for (const event of noted) {
      expect(markers(event.note.pt)).toEqual(markers(event.note.en));
    }
  });
});
