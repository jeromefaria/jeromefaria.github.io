import { describe, expect, it, vi } from 'vitest';

// Mock the works data so a solo release without a parseable year exercises the
// datePublished-omit branch in createWorksPageSchema — unreachable with the real
// content, where every solo release carries a year. Isolated in its own file so
// the mock never leaks into the real-data suite (pageSchemas.test.ts).
vi.mock('@/data/works', () => ({
  worksData: {
    solo: {
      title: 'Solo',
      id: 'solo',
      items: [
        { id: 'dated', title: 'Dated Release', bandcampUrl: 'https://example.bandcamp.com/album/a', meta: 'Released 2020' },
        { id: 'undated', title: 'Undated Release', bandcampUrl: 'https://example.bandcamp.com/album/b' },
      ],
    },
  },
}));

import { createWorksPageSchema } from './pageSchemas';

describe('createWorksPageSchema — datePublished derivation', () => {
  it('sets datePublished from a parseable year and leaves it empty otherwise', () => {
    const [musicGroup] = createWorksPageSchema()['@graph'];
    const dated = musicGroup.album.find(album => album.name === 'Dated Release');
    const undated = musicGroup.album.find(album => album.name === 'Undated Release');

    expect(dated?.datePublished).toBe('2020');
    expect(undated?.datePublished).toBe('');
  });
});
