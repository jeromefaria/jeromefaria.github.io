import { describe, expect, it } from 'vitest';

import type { LiveEvent } from '@/types/live';

import { createItemListSchema, createMusicAlbumSchema, createMusicEventSchema } from './schemaHelpers';

const baseEvent: LiveEvent = {
  id: 'madeiradig-2011',
  title: 'MADEIRADIG',
  titleUrl: 'https://digitalinberlin.eu/',
  date: '2011-12-02',
  venue: { name: 'Casa das Mudas', url: 'https://example.com', city: 'Calheta', country: 'Portugal' },
  performance: { kind: 'solo' },
};

describe('createMusicEventSchema', () => {
  it('uses the event title as the schema name', () => {
    const schema = createMusicEventSchema(baseEvent, 'Jerome Faria');
    expect(schema.name).toBe('MADEIRADIG');
  });

  it('parses the venue into name, locality and country', () => {
    const schema = createMusicEventSchema(baseEvent, 'Jerome Faria');
    expect(schema.location).toEqual({
      '@type': 'Place',
      name: 'Casa das Mudas',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Calheta',
        addressCountry: 'Portugal',
      },
    });
  });

  it('uses the event date as startDate when present', () => {
    const schema = createMusicEventSchema(baseEvent, 'Jerome Faria', '2011');
    expect(schema.startDate).toBe('2011-12-02');
  });

  it('falls back to the provided fallback date when the event has none', () => {
    const schema = createMusicEventSchema({ ...baseEvent, date: '' }, 'Jerome Faria', '2011');
    expect(schema.startDate).toBe('2011');
  });

  it('sets the performer name', () => {
    const schema = createMusicEventSchema(baseEvent, 'Jerome Faria');
    expect(schema.performer).toEqual({ '@type': 'Person', name: 'Jerome Faria' });
  });
});

describe('createItemListSchema', () => {
  it('wraps items with 1-indexed positions', () => {
    const events = [
      createMusicEventSchema(baseEvent, 'Jerome Faria'),
      createMusicEventSchema({ ...baseEvent, id: 'second' }, 'Jerome Faria'),
    ];
    const list = createItemListSchema(events, 'Live', 'History');

    expect(list['@context']).toBe('https://schema.org');
    expect(list.numberOfItems).toBe(2);
    expect(list.itemListElement.map(entry => entry.position)).toEqual([1, 2]);
    expect(list.itemListElement[0].item).toBe(events[0]);
  });

  it('handles an empty list', () => {
    const list = createItemListSchema([], 'Live', 'History');
    expect(list.numberOfItems).toBe(0);
    expect(list.itemListElement).toEqual([]);
  });
});

describe('createMusicAlbumSchema', () => {
  const artist = 'Jerome Faria';
  const siteUrl = 'https://jeromefaria.com';

  it('builds the core album fields', () => {
    const schema = createMusicAlbumSchema(
      { title: 'Overlapse', bandcampUrl: 'https://music.jeromefaria.com/album/overlapse', datePublished: '2012' },
      artist,
      siteUrl,
    );
    expect(schema).toMatchObject({
      '@type': 'MusicAlbum',
      name: 'Overlapse',
      url: 'https://music.jeromefaria.com/album/overlapse',
      datePublished: '2012',
      byArtist: { '@type': 'Person', name: artist },
    });
  });

  it('defaults url and datePublished to empty strings when missing', () => {
    const schema = createMusicAlbumSchema({ title: 'Untitled' }, artist, siteUrl);
    expect(schema.url).toBe('');
    expect(schema.datePublished).toBe('');
  });

  it('prefixes the cover image with the site URL when present', () => {
    const schema = createMusicAlbumSchema({ title: 'Overlapse', coverImage: '/images/overlapse.jpg' }, artist, siteUrl);
    expect(schema.image).toBe('https://jeromefaria.com/images/overlapse.jpg');
  });

  it('omits the image when there is no cover', () => {
    const schema = createMusicAlbumSchema({ title: 'Overlapse' }, artist, siteUrl);
    expect(schema.image).toBeUndefined();
  });

  it('sets numTracks from a non-empty tracklist', () => {
    const schema = createMusicAlbumSchema({ title: 'Overlapse', tracklist: ['A', 'B', 'C'] }, artist, siteUrl);
    expect(schema.numTracks).toBe(3);
  });

  it('omits numTracks for an empty or missing tracklist', () => {
    expect(createMusicAlbumSchema({ title: 'X', tracklist: [] }, artist, siteUrl).numTracks).toBeUndefined();
    expect(createMusicAlbumSchema({ title: 'X' }, artist, siteUrl).numTracks).toBeUndefined();
  });
});
