import { describe, expect, it } from 'vitest';

import type { LiveEvent } from '@/types/live';
import type { SchemaPerson } from '@/types/schema';

import { createItemListSchema, createMusicAlbumSchema, createMusicEventSchema, MUSIC_GENRES } from './schemaHelpers';

const performerNames = (performer: SchemaPerson | SchemaPerson[]): string[] =>
  (Array.isArray(performer) ? performer : [performer]).map(entry => entry.name);

const baseEvent: LiveEvent = {
  id: 'madeiradig-2011',
  title: 'MADEIRADIG',
  titleUrl: 'https://digitalinberlin.eu/',
  date: '2011-12-02',
  venue: { name: 'Casa das Mudas', url: 'https://example.com', city: 'Calheta', country: 'Portugal' },
  setup: { kind: 'solo' },
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

  it('emits endDate for a multi-day run', () => {
    const schema = createMusicEventSchema({ ...baseEvent, endDate: '2011-12-04' }, 'Jerome Faria');
    expect(schema.endDate).toBe('2011-12-04');
  });

  it('omits endDate for a single-day event', () => {
    const schema = createMusicEventSchema(baseEvent, 'Jerome Faria');
    expect(schema.endDate).toBeUndefined();
  });

  it('marks every event as scheduled', () => {
    const schema = createMusicEventSchema(baseEvent, 'Jerome Faria');
    expect(schema.eventStatus).toBe('https://schema.org/EventScheduled');
  });

  it('describes the event from its note, stripped of markup', () => {
    const schema = createMusicEventSchema(
      { ...baseEvent, note: { en: 'A <em>rare</em> solo set.', pt: 'Um set a solo <em>raro</em>.' } },
      'Jerome Faria', '', 'en',
    );
    expect(schema.description).toBe('A rare solo set.');
  });

  it('omits the description when the event has no note', () => {
    expect(createMusicEventSchema(baseEvent, 'Jerome Faria').description).toBeUndefined();
  });

  it('resolves a cover image to an absolute URL', () => {
    const schema = createMusicEventSchema(
      { ...baseEvent, images: [{ src: '/images/live/a.jpg' }, { src: '/images/live/b.jpg', cover: true }] },
      'Jerome Faria', '', 'en', 'https://jeromefaria.com',
    );
    expect(schema.image).toBe('https://jeromefaria.com/images/live/b.jpg');
  });

  it('falls back to the first artwork when none is marked cover', () => {
    const schema = createMusicEventSchema(
      { ...baseEvent, posters: [{ src: '/images/live/poster.jpg', alt: 'Poster' }] },
      'Jerome Faria', '', 'en', 'https://jeromefaria.com',
    );
    expect(schema.image).toBe('https://jeromefaria.com/images/live/poster.jpg');
  });

  it('omits the image without a site URL or without artwork', () => {
    expect(createMusicEventSchema({ ...baseEvent, images: [{ src: '/x.jpg' }] }, 'Jerome Faria').image).toBeUndefined();
    expect(createMusicEventSchema(baseEvent, 'Jerome Faria', '', 'en', 'https://jeromefaria.com').image).toBeUndefined();
  });

  it('resolves presenter keys to organizer names and URLs from the registry', () => {
    const schema = createMusicEventSchema(
      { ...baseEvent, presentedBy: ['colectivo-casa-amarela', 'festival-multiplo'] },
      'Jerome Faria',
    );
    expect(schema.organizer).toEqual([
      { '@type': 'Organization', name: 'Colectivo Casa Amarela', url: 'https://casaamarela.bandcamp.com' },
      { '@type': 'Organization', name: 'Festival Múltiplo' },
    ]);
  });

  it('drops unknown presenter keys and omits organizer when none resolve', () => {
    expect(createMusicEventSchema({ ...baseEvent, presentedBy: ['not-a-real-org'] }, 'Jerome Faria').organizer).toBeUndefined();
    expect(createMusicEventSchema(baseEvent, 'Jerome Faria').organizer).toBeUndefined();
  });

  it('sets a single performer for a solo event', () => {
    const schema = createMusicEventSchema(baseEvent, 'Jerome Faria');
    expect(schema.performer).toEqual({ '@type': 'Person', name: 'Jerome Faria' });
  });

  it('lists a duo partner as a second performer, with an inline url as sameAs', () => {
    const schema = createMusicEventSchema(
      { ...baseEvent, setup: { kind: 'duo', with: { text: 'A Guest', url: 'https://guest.test/' } } },
      'Jerome Faria',
    );
    expect(schema.performer).toEqual([
      { '@type': 'Person', name: 'Jerome Faria' },
      { '@type': 'Person', name: 'A Guest', sameAs: ['https://guest.test/'] },
    ]);
  });

  it('resolves a collaborator sameAs from the people registry', () => {
    const schema = createMusicEventSchema(
      { ...baseEvent, setup: { kind: 'duo', with: { text: 'Taylor Deupree' } } },
      'Jerome Faria',
    );
    expect(schema.performer).toEqual([
      { '@type': 'Person', name: 'Jerome Faria' },
      { '@type': 'Person', name: 'Taylor Deupree', sameAs: ['https://www.12k.com/artist/deupree-taylor/'] },
    ]);
  });

  it('unions the context url with a registry link for a multi-facet person', () => {
    const schema = createMusicEventSchema(
      { ...baseEvent, setup: { kind: 'duo', with: { text: 'Taylor Deupree', url: 'https://12k.com/' } } },
      'Jerome Faria',
    );
    expect(schema.performer).toEqual([
      { '@type': 'Person', name: 'Jerome Faria' },
      { '@type': 'Person', name: 'Taylor Deupree', sameAs: ['https://12k.com/', 'https://www.12k.com/artist/deupree-taylor/'] },
    ]);
  });

  it('omits sameAs for a collaborator with no known link', () => {
    const schema = createMusicEventSchema(
      { ...baseEvent, setup: { kind: 'band', band: { text: 'Unknown Band' } } },
      'Jerome Faria',
    );
    expect(schema.performer).toEqual([
      { '@type': 'Person', name: 'Jerome Faria' },
      { '@type': 'Person', name: 'Unknown Band' },
    ]);
  });

  it('collects project name and members as performers', () => {
    const schema = createMusicEventSchema(
      { ...baseEvent, setup: { kind: 'project', name: { text: 'NOx' }, members: [{ text: 'Member One' }] } },
      'Jerome Faria',
    );
    expect(performerNames(schema.performer)).toEqual(['Jerome Faria', 'NOx', 'Member One']);
  });

  it('collects ensemble members as performers', () => {
    const schema = createMusicEventSchema(
      { ...baseEvent, setup: { kind: 'ensemble', name: 'An Ensemble', members: [{ text: 'Player' }] } },
      'Jerome Faria',
    );
    expect(performerNames(schema.performer)).toEqual(['Jerome Faria', 'Player']);
  });

  it('resolves a Localized title to the requested locale', () => {
    const localized: LiveEvent = { ...baseEvent, title: { en: 'Performance with Amess', pt: 'Actuação com Amess' } };

    expect(createMusicEventSchema(localized, 'Jerome Faria', '', 'en').name).toBe('Performance with Amess');
    expect(createMusicEventSchema(localized, 'Jerome Faria', '', 'pt').name).toBe('Actuação com Amess');
  });

  it('emits inLanguage only when the event declares a spoken language', () => {
    expect(createMusicEventSchema(baseEvent, 'Jerome Faria').inLanguage).toBeUndefined();
    expect(createMusicEventSchema({ ...baseEvent, language: 'pt-PT' }, 'Jerome Faria').inLanguage).toBe('pt-PT');
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

  it('builds the core album fields, pointing url at the on-site page and linking the artist to the site', () => {
    const schema = createMusicAlbumSchema(
      { id: 'overlapse', title: 'Overlapse', datePublished: '2012' },
      artist,
      siteUrl,
    );
    expect(schema).toMatchObject({
      '@type': 'MusicAlbum',
      name: 'Overlapse',
      url: 'https://jeromefaria.com/works/overlapse',
      genre: MUSIC_GENRES,
      datePublished: '2012',
      byArtist: { '@type': 'Person', name: artist, url: siteUrl },
    });
  });

  it('copies the genre list rather than sharing the module constant', () => {
    const schema = createMusicAlbumSchema({ id: 'x', title: 'X' }, artist, siteUrl);
    expect(schema.genre).toEqual(MUSIC_GENRES);
    expect(schema.genre).not.toBe(MUSIC_GENRES);
  });

  it('derives url from the id and defaults datePublished to an empty string when missing', () => {
    const schema = createMusicAlbumSchema({ id: 'untitled', title: 'Untitled' }, artist, siteUrl);
    expect(schema.url).toBe('https://jeromefaria.com/works/untitled');
    expect(schema.datePublished).toBe('');
  });

  it('sets inLanguage from the release language, omitting it for instrumental works', () => {
    expect(createMusicAlbumSchema({ id: '2504', title: '2504', language: 'pt-PT' }, artist, siteUrl).inLanguage).toBe('pt-PT');
    expect(createMusicAlbumSchema({ id: 'overlapse', title: 'Overlapse' }, artist, siteUrl).inLanguage).toBeUndefined();
  });

  it('prefixes the cover image with the site URL when present', () => {
    const schema = createMusicAlbumSchema(
      { id: 'overlapse', title: 'Overlapse', coverImage: '/images/overlapse.jpg' },
      artist,
      siteUrl,
    );
    expect(schema.image).toBe('https://jeromefaria.com/images/overlapse.jpg');
  });

  it('omits the image when there is no cover', () => {
    expect(createMusicAlbumSchema({ id: 'overlapse', title: 'Overlapse' }, artist, siteUrl).image).toBeUndefined();
  });

  it('collects Bandcamp, SoundCloud and Discogs into sameAs, in that order', () => {
    const schema = createMusicAlbumSchema(
      {
        id: 'overlapse',
        title: 'Overlapse',
        bandcampUrl: 'https://jeromefaria.bandcamp.com/album/overlapse',
        soundcloudUrl: 'https://soundcloud.com/jeromefaria/sets/overlapse',
        discogsUrl: 'https://www.discogs.com/master/2963038-Jerome-Faria-Overlapse',
      },
      artist,
      siteUrl,
    );
    expect(schema.sameAs).toEqual([
      'https://jeromefaria.bandcamp.com/album/overlapse',
      'https://soundcloud.com/jeromefaria/sets/overlapse',
      'https://www.discogs.com/master/2963038-Jerome-Faria-Overlapse',
    ]);
  });

  it('keeps only the external links that are present in sameAs', () => {
    const schema = createMusicAlbumSchema(
      { id: 'x', title: 'X', discogsUrl: 'https://www.discogs.com/release/1-X' },
      artist,
      siteUrl,
    );
    expect(schema.sameAs).toEqual(['https://www.discogs.com/release/1-X']);
  });

  it('omits sameAs when no external links are present', () => {
    expect(createMusicAlbumSchema({ id: 'x', title: 'X' }, artist, siteUrl).sameAs).toBeUndefined();
  });

  it('strips HTML from the description and resolves it to the requested locale', () => {
    const release = {
      id: '2504',
      title: '2504',
      description: { en: '<p>A <strong>political</strong> suite.</p>', pt: '<p>Uma suite <strong>política</strong>.</p>' },
    };
    expect(createMusicAlbumSchema(release, artist, siteUrl, 'en').description).toBe('A political suite.');
    expect(createMusicAlbumSchema(release, artist, siteUrl, 'pt').description).toBe('Uma suite política.');
  });

  it('omits the description when the release has none', () => {
    expect(createMusicAlbumSchema({ id: 'x', title: 'X' }, artist, siteUrl).description).toBeUndefined();
  });

  it('sets numTracks from a non-empty tracklist', () => {
    const schema = createMusicAlbumSchema(
      { id: 'overlapse', title: 'Overlapse', tracklist: [{ title: 'A' }, { title: 'B' }, { title: 'C' }] },
      artist,
      siteUrl,
    );
    expect(schema.numTracks).toBe(3);
  });

  it('omits numTracks for an empty or missing tracklist', () => {
    expect(createMusicAlbumSchema({ id: 'x', title: 'X', tracklist: [] }, artist, siteUrl).numTracks).toBeUndefined();
    expect(createMusicAlbumSchema({ id: 'x', title: 'X' }, artist, siteUrl).numTracks).toBeUndefined();
  });
});
