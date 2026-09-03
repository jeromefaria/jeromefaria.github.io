import { describe, expect, it, vi } from 'vitest';

// Isolated in its own file so this vi.mock doesn't replace real data in the main schema suite.
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
          meta: { kind: 'music', mediums: ['Digital'], editions: [], year: 2020 },
        },
        {
          id: 'url-only',
          title: 'Url Only',
          bandcampUrl: 'https://example.bandcamp.com/album/url-only',
          meta: { kind: 'music', mediums: ['Digital'], editions: [], year: 2018 },
        },
        {
          id: 'neither',
          title: 'Neither',
          meta: { kind: 'music', mediums: ['Digital'], editions: [], year: 2016 },
        },
      ],
    },
    publications: {
      title: 'Publications',
      id: 'publications',
      items: [
        {
          id: 'book',
          title: 'A Book',
          coverImage: '/images/book.jpg',
          externalUrl: 'https://example.com/book',
          meta: { kind: 'publication', publisher: { text: 'A Publisher' }, isbn: { value: '000', url: 'https://example.com/isbn' }, year: 2009 },
        },
      ],
    },
  },
}));

import { createWorksPageSchema } from './worksSchema';

describe('createWorksPageSchema — album filter', () => {
  it('includes releases with either Bandcamp id, excludes those with neither, and dates each from its year', () => {
    const [musicGroup] = createWorksPageSchema()['@graph'];
    const names = musicGroup.album.map(album => album.name);

    expect(names).toEqual(['Both Ids', 'Url Only']);
    expect(musicGroup.album.find(album => album.name === 'Both Ids')?.datePublished).toBe('2020');
    expect(musicGroup.album.find(album => album.name === 'Url Only')?.datePublished).toBe('2018');
  });
});
