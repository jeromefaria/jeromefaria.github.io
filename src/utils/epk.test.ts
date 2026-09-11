import { describe, expect, it } from 'vitest';

import { epkManifest } from '@/data/epk';
import type { Release } from '@/types/works';

import {
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
      meta: { kind: 'music', mediums: ['Digital'], editions: [{ label: { text: 'self-released' } }], released: '2024' },
    };

    expect(toWorkHighlight(release)).toEqual({ id: '2504', year: 2024, title: '2504' });
  });

  it('applies a display-title override while keeping the release id', () => {
    const release: Release = {
      id: '2504',
      title: '2504',
      meta: { kind: 'music', mediums: ['Digital'], editions: [{ label: { text: 'self-released' } }], released: '2024' },
    };

    expect(toWorkHighlight(release, 'Short Title')).toEqual({ id: '2504', year: 2024, title: 'Short Title' });
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
    expect(content.sharedStages).toEqual(epkManifest.sharedStages);
  });

  it('honours a per-work display-title override without changing its deep-link id', () => {
    const content = resolveEpkContent({
      ...epkManifest,
      highlightWorkIds: [{ id: 'caligari-album', title: 'The Cabinet of Dr. Caligari' }],
    });

    expect(content.workHighlights).toEqual([
      expect.objectContaining({ id: 'caligari-album', title: 'The Cabinet of Dr. Caligari' }),
    ]);
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
