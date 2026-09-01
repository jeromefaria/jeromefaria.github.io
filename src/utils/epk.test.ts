import { describe, expect, it } from 'vitest';

import { epkManifest } from '@/data/epk';
import type { EventVenue } from '@/types/live';
import type { Release } from '@/types/works';

import {
  eventLocation,
  photoDownloadFilename,
  resolveEpkContent,
  toLiveHighlight,
  toWorkHighlight,
} from './epk';

describe('photoDownloadFilename', () => {
  it('encodes the 1-based index and the accent-folded photographer credit', () => {
    expect(photoDownloadFilename({ src: '/x.jpg', alt: 'x', photographer: { name: 'Valentina Araújo' } }, 0))
      .toBe('jerome-faria-1-by-valentina-araujo.jpg');
  });

  it('omits the credit when a photo has no photographer', () => {
    expect(photoDownloadFilename({ src: '/x.jpg', alt: 'x' }, 4)).toBe('jerome-faria-5.jpg');
  });
});

describe('eventLocation', () => {
  it('joins venue name and city when both are present', () => {
    const venue: EventVenue = { name: 'Zaratan', city: 'Lisbon', country: 'Portugal' };

    expect(eventLocation(venue)).toBe('Zaratan, Lisbon');
  });

  it('uses whichever of name or city is present', () => {
    expect(eventLocation({ name: 'Störung', country: 'Spain' })).toBe('Störung');
    expect(eventLocation({ city: 'Porto', country: 'Portugal' })).toBe('Porto');
  });

  it('falls back to the country when neither name nor city is present', () => {
    expect(eventLocation({ country: 'Portugal' })).toBe('Portugal');
  });
});

describe('toLiveHighlight', () => {
  it('projects an event to year, title, and location', () => {
    const highlight = toLiveHighlight({
      id: 'x',
      title: 'MADEIRADIG',
      date: '2011-12-02',
      venue: { name: 'Estalagem da Ponta do Sol', city: 'Ponta do Sol', country: 'Portugal' },
      performance: { kind: 'solo' },
    });

    expect(highlight).toEqual({ id: 'x', year: '2011', title: 'MADEIRADIG', location: 'Estalagem da Ponta do Sol, Ponta do Sol' });
  });
});

describe('toWorkHighlight', () => {
  it('projects a release to year and title', () => {
    const release: Release = {
      id: '2504',
      title: '2504',
      meta: { kind: 'music', mediums: ['Digital'], editions: [{ label: { text: 'self-released' } }], year: 2024 },
    };

    expect(toWorkHighlight(release)).toEqual({ id: '2504', year: 2024, title: '2504' });
  });
});

describe('resolveEpkContent', () => {
  it('resolves every manifest reference against the live site data', () => {
    const content = resolveEpkContent(epkManifest);

    expect(content.shortBio).toContain('Jerome Faria');
    expect(content.longBio.length).toBeGreaterThan(0);
    expect(content.photos).toHaveLength(epkManifest.photos.length);
    expect(content.quotes).toHaveLength(epkManifest.pressQuoteIds.length);
    expect(content.liveHighlights).toHaveLength(epkManifest.highlightLiveIds.length);
    expect(content.workHighlights).toHaveLength(epkManifest.highlightWorkIds.length);
  });

  it('resolves the Portuguese bios when the pt locale is requested', () => {
    const english = resolveEpkContent(epkManifest, 'en');
    const portuguese = resolveEpkContent(epkManifest, 'pt');

    expect(portuguese.shortBio).toContain('artista sonoro português');
    expect(portuguese.longBio).toContain('percurso de duas décadas');
    expect(portuguese.shortBio).not.toBe(english.shortBio);
    expect(portuguese.longBio).not.toBe(english.longBio);
  });

  it('throws when the manifest references data that no longer exists', () => {
    expect(() => resolveEpkContent({ ...epkManifest, highlightWorkIds: ['does-not-exist'] })).toThrow(/does-not-exist/);
  });
});
