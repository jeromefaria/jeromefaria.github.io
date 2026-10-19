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

import { createReleaseBreadcrumbSchema, createReleaseSchema } from './worksSchema';

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
      url: CANONICAL,
      mainEntityOfPage: CANONICAL,
      byArtist: { '@type': 'Person', name: siteConfig.author.name, url: siteConfig.url },
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
    expect(schema).not.toHaveProperty('sameAs');
    expect(schema).not.toHaveProperty('isPartOf');
  });

  it('wraps a compilation track in an isPartOf album carrying the compilation Discogs identity', () => {
    const release = {
      id: 'comp-x',
      title: 'My Track',
      meta: {
        kind: 'compilation',
        compilation: { text: 'A Compilation', url: 'https://label.example/comp', discogsUrl: 'https://www.discogs.com/release/1-A-Compilation' },
        mediums: ['MP3'],
        editions: [],
        released: '2010',
      },
    } as unknown as Release;

    expect(createReleaseSchema(release, 'en', CANONICAL)).toHaveProperty('isPartOf', {
      '@type': 'MusicAlbum',
      name: 'A Compilation',
      url: 'https://label.example/comp',
      sameAs: ['https://www.discogs.com/release/1-A-Compilation'],
    });
  });

  it('keeps the compilation url but omits its sameAs when there is no Discogs link', () => {
    const release = {
      id: 'comp-y',
      title: 'Another Track',
      meta: {
        kind: 'compilation',
        compilation: { text: 'Bandcamp Only', url: 'https://label.bandcamp.com/album/x' },
        mediums: ['MP3'],
        editions: [],
        released: '2011',
      },
    } as unknown as Release;

    expect(createReleaseSchema(release, 'en', CANONICAL)).toHaveProperty('isPartOf', {
      '@type': 'MusicAlbum',
      name: 'Bandcamp Only',
      url: 'https://label.bandcamp.com/album/x',
    });
  });

  it('builds a bare isPartOf album when the compilation has neither url nor Discogs link', () => {
    const release = {
      id: 'comp-z',
      title: 'Bare Track',
      meta: {
        kind: 'compilation',
        compilation: { text: 'Untitled Comp' },
        mediums: ['MP3'],
        editions: [],
        released: '2012',
      },
    } as unknown as Release;

    expect(createReleaseSchema(release, 'en', CANONICAL)).toHaveProperty('isPartOf', {
      '@type': 'MusicAlbum',
      name: 'Untitled Comp',
    });
  });

  it('links a CreativeWork to its external and Discogs identities via sameAs', () => {
    const release = {
      id: 'ect',
      title: 'ECT',
      externalUrl: 'https://netlabel.example/ect',
      discogsUrl: 'https://www.discogs.com/release/548251-NNY-ECT',
      meta: { kind: 'music', mediums: ['Digital'], editions: [], released: '2005' },
    } as unknown as Release;

    const schema = createReleaseSchema(release, 'en', CANONICAL);

    expect(schema).toHaveProperty('sameAs', [
      'https://netlabel.example/ect',
      'https://www.discogs.com/release/548251-NNY-ECT',
    ]);
  });

  it('dedupes sameAs when externalUrl and discogsUrl are the same link', () => {
    const release = {
      id: 'nny-plus',
      title: 'NNY++',
      externalUrl: 'https://www.discogs.com/release/932955-NNY-NNY',
      discogsUrl: 'https://www.discogs.com/release/932955-NNY-NNY',
      meta: { kind: 'music', mediums: ['CDr'], editions: [], released: '2007' },
    } as unknown as Release;

    const schema = createReleaseSchema(release, 'en', CANONICAL);

    expect(schema).toHaveProperty('sameAs', ['https://www.discogs.com/release/932955-NNY-NNY']);
  });

  it('sets sameAs from externalUrl alone when there is no Discogs link', () => {
    const release = {
      id: 'depolarized',
      title: 'Depolarized',
      externalUrl: 'https://archive.org/details/depolarized',
      meta: { kind: 'music', mediums: ['Digital'], editions: [], released: '2014' },
    } as unknown as Release;

    expect(createReleaseSchema(release, 'en', CANONICAL)).toHaveProperty('sameAs', ['https://archive.org/details/depolarized']);
  });

  it('sets sameAs from discogsUrl alone when there is no external URL', () => {
    const release = {
      id: 'hyphema',
      title: 'Hyphema',
      discogsUrl: 'https://www.discogs.com/release/1244206-NNY-Hyphema',
      meta: { kind: 'commission', work: 'DVD', released: '2007' },
    } as unknown as Release;

    expect(createReleaseSchema(release, 'en', CANONICAL)).toHaveProperty('sameAs', ['https://www.discogs.com/release/1244206-NNY-Hyphema']);
  });
});

describe('createReleaseBreadcrumbSchema', () => {
  const release = { id: 'x', title: 'Caligari' } as Release;

  it('builds a Home → Works → release trail with localized section labels', () => {
    const schema = createReleaseBreadcrumbSchema(release, 'en', CANONICAL);
    const names = schema.itemListElement.map(element => element.name);
    const items = schema.itemListElement.map(element => element.item);

    expect(names).toEqual([siteConfig.title, 'Works', 'Caligari']);
    expect(items).toEqual([siteConfig.url, `${siteConfig.url}/works`, CANONICAL]);
  });

  it('localizes the Works label in Portuguese', () => {
    const schema = createReleaseBreadcrumbSchema(release, 'pt', CANONICAL);
    expect(schema.itemListElement[1]?.name).toBe('Obras');
  });
});
