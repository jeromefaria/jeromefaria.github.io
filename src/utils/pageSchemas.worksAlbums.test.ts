import { describe, expect, it, vi } from 'vitest';

// Mock the works data so the album filter sees all three cases: a release with
// both Bandcamp ids, one with only a URL (exercises the || right-hand branch —
// real solo releases carry both ids, so it never short-circuits there), and one
// with neither (excluded). Isolated in its own file so the mock never leaks into
// the real-data suite (pageSchemas.test.ts).
vi.mock('@/data/works', () => ({
  worksData: {
    solo: {
      title: 'Solo',
      id: 'solo',
      items: [
        {
          id: 'both',
          title: 'Both Ids',
          bandcampId: '123',
          bandcampUrl: 'https://example.bandcamp.com/album/both',
          meta: { format: 'Digital', editions: [], year: 2020 },
        },
        {
          id: 'url-only',
          title: 'Url Only',
          bandcampUrl: 'https://example.bandcamp.com/album/url-only',
          meta: { format: 'Digital', editions: [], year: 2018 },
        },
        {
          id: 'neither',
          title: 'Neither',
          meta: { format: 'Digital', editions: [], year: 2016 },
        },
      ],
    },
  },
}));

import { createWorksPageSchema } from './pageSchemas';

describe('createWorksPageSchema — album filter', () => {
  it('includes releases with either Bandcamp id, excludes those with neither, and dates each from its year', () => {
    const [musicGroup] = createWorksPageSchema()['@graph'];
    const names = musicGroup.album.map(album => album.name);

    expect(names).toEqual(['Both Ids', 'Url Only']);
    expect(musicGroup.album.find(album => album.name === 'Both Ids')?.datePublished).toBe('2020');
    expect(musicGroup.album.find(album => album.name === 'Url Only')?.datePublished).toBe('2018');
  });
});
