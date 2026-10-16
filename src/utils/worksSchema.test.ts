import { describe, expect, it, vi } from 'vitest';

import { siteConfig } from '@/data/navigation';
import type { Release } from '@/types';

vi.mock('@/data/works', () => ({
  worksData: {
    publications: {
      title: 'Publications',
      id: 'publications',
      items: [
        {
          id: 'bare-book',
          title: 'A Bare Book',
          meta: { kind: 'publication', publisher: { text: 'A Publisher' }, released: '2009' },
        },
      ],
    },
  },
}));

import { createReleaseSchema } from './worksSchema';

const CANONICAL = 'https://jeromefaria.com/works/x';

describe('createReleaseSchema', () => {
  it('builds a Book schema and falls back to empty strings for a book with no image, url, or isbn', () => {
    const release = {
      id: 'x',
      title: 'X',
      meta: { kind: 'publication', publisher: { text: 'A Publisher' }, released: '2009' },
    } as Release;

    const schema = createReleaseSchema(release, 'en', CANONICAL);

    expect(schema).toMatchObject({
      '@type': 'Book',
      image: '',
      url: '',
      isbn: '',
      mainEntityOfPage: CANONICAL,
    });
  });

  it('builds a MusicAlbum schema for a Bandcamp-linked release, dated from its year', () => {
    const release = {
      id: 'y',
      title: 'Y',
      bandcampId: '123',
      meta: { kind: 'music', mediums: ['Digital'], editions: [], released: '2020' },
    } as unknown as Release;

    const schema = createReleaseSchema(release, 'en', CANONICAL);

    expect(schema).toMatchObject({
      '@type': 'MusicAlbum',
      name: 'Y',
      datePublished: '2020',
      mainEntityOfPage: CANONICAL,
    });
  });

  it('builds a CreativeWork schema with description and image when both are present', () => {
    const release = {
      id: 'z',
      title: 'Z',
      coverImage: '/images/z.jpg',
      description: { en: '<p>An EN note</p>', pt: '<p>Uma nota PT</p>' },
      meta: { kind: 'music', mediums: ['Digital'], editions: [], released: '2016' },
    } as unknown as Release;

    const schema = createReleaseSchema(release, 'en', CANONICAL);

    expect(schema).toMatchObject({
      '@type': 'CreativeWork',
      name: 'Z',
      description: 'An EN note',
      image: `${siteConfig.url}/images/z.jpg`,
      dateCreated: '2016',
      mainEntityOfPage: CANONICAL,
    });
  });

  it('omits description and image on a CreativeWork release that has neither', () => {
    const release = {
      id: 'w',
      title: 'W',
      meta: { kind: 'music', mediums: ['Digital'], editions: [], released: '2015' },
    } as unknown as Release;

    const schema = createReleaseSchema(release, 'en', CANONICAL);

    expect(schema).toMatchObject({ '@type': 'CreativeWork', name: 'W', dateCreated: '2015' });
    expect(schema).not.toHaveProperty('description');
    expect(schema).not.toHaveProperty('image');
  });
});
