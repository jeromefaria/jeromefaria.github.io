import { describe, expect, it } from 'vitest';

import { liveEvents, liveYears } from '@/data/live';
import { siteConfig, social } from '@/data/navigation';
import { worksData } from '@/data/works';

import {
  createContactPageSchema,
  createLiveEventsSchema,
  createPersonSchema,
  createWorksPageSchema,
} from './pageSchemas';

describe('createPersonSchema', () => {
  it('builds a Person from the site config and social links', () => {
    const schema = createPersonSchema();

    expect(schema['@type']).toBe('Person');
    expect(schema.name).toBe(siteConfig.author.name);
    expect(schema.url).toBe(siteConfig.url);
    expect(schema.jobTitle).toBe(siteConfig.tagline);
    expect(schema.image).toBe(`${siteConfig.url}${siteConfig.image}`);
    expect(schema.sameAs).toEqual(social.map(link => link.url));
  });
});

describe('createContactPageSchema', () => {
  it('builds a ContactPage whose mainEntity is the author', () => {
    const schema = createContactPageSchema();

    expect(schema['@type']).toBe('ContactPage');
    expect(schema.mainEntity).toMatchObject({
      '@type': 'Person',
      name: siteConfig.author.name,
      email: siteConfig.author.email,
      url: siteConfig.url,
    });
  });
});

describe('createWorksPageSchema', () => {
  it('assembles a graph with a MusicGroup and the Glitch book', () => {
    const schema = createWorksPageSchema();
    const [musicGroup, book] = schema['@graph'];

    expect(schema['@context']).toBe('https://schema.org');
    expect(schema['@graph']).toHaveLength(2);
    expect(musicGroup['@type']).toBe('MusicGroup');
    expect(musicGroup.name).toBe(siteConfig.author.name);
    expect(book['@type']).toBe('Book');
    expect(book.name).toBe('Glitch: Designing Imperfection');
  });

  it('includes only solo releases that carry a Bandcamp reference', () => {
    const schema = createWorksPageSchema();
    const [musicGroup] = schema['@graph'];
    const expectedAlbumCount = (worksData['solo']?.items ?? []).filter(
      release =>
        ('bandcampId' in release && release.bandcampId !== undefined) ||
        ('bandcampUrl' in release && release.bandcampUrl !== undefined),
    ).length;

    expect(musicGroup.album).toHaveLength(expectedAlbumCount);
    musicGroup.album.forEach(album => {
      expect(album['@type']).toBe('MusicAlbum');
      expect(album.name).toBeTruthy();
      expect(album.byArtist.name).toBe(siteConfig.author.name);
      expect(album.datePublished, `datePublished for "${album.name}"`).toMatch(/^\d{4}$/);
    });
  });
});

describe('createLiveEventsSchema', () => {
  it('builds an ItemList covering every performance', () => {
    const schema = createLiveEventsSchema();
    const totalEvents = liveEvents.length;

    expect(schema['@type']).toBe('ItemList');
    expect(schema.numberOfItems).toBe(totalEvents);
    expect(schema.itemListElement).toHaveLength(totalEvents);
    schema.itemListElement.forEach((element, index) => {
      expect(element.position).toBe(index + 1);
      expect(element.item['@type']).toBe('MusicEvent');
    });
  });

  it('orders events within the newest year by date, most recent first', () => {
    const schema = createLiveEventsSchema();
    const newestYear = liveYears[0];
    const startDates = schema.itemListElement
      .map(element => element.item.startDate)
      .filter(date => date.startsWith(`${newestYear}-`));

    expect(startDates.length).toBeGreaterThan(1);
    expect(startDates).toEqual([...startDates].sort((a, b) => b.localeCompare(a)));
  });
});
