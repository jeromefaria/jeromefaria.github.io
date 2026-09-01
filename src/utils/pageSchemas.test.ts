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
    expect(schema.jobTitle).toBe(siteConfig.tagline.en);
    expect(schema.image).toBe(`${siteConfig.url}${siteConfig.image}`);
    expect(schema.sameAs).toEqual(social.map(link => link.url));
  });

  it('localizes jobTitle and description to the requested locale', () => {
    const schema = createPersonSchema('pt');

    expect(schema.jobTitle).toBe(siteConfig.tagline.pt);
    expect(schema.description).toBe(siteConfig.description.pt);
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

  it('stamps the page inLanguage per locale', () => {
    expect(createContactPageSchema('en').inLanguage).toBe('en-US');
    expect(createContactPageSchema('pt').inLanguage).toBe('pt-PT');
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

  it('marks the English book en-US and tags only language-bearing albums', () => {
    const schema = createWorksPageSchema();
    const [musicGroup, book] = schema['@graph'];

    expect(book.inLanguage).toBe('en-US');
    expect(musicGroup.album.find(album => album.name === '2504')?.inLanguage).toBe('pt-PT');
    expect(musicGroup.album.find(album => album.name === 'Overlapse')?.inLanguage).toBeUndefined();
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

  it('localizes the list name, description, and event names on a pt build', () => {
    const schema = createLiveEventsSchema('pt');

    expect(schema.name).toBe(`Actuações de ${siteConfig.author.name}`);
    expect(schema.description).toBe('Histórico de actuações de 2005 até ao presente');
    expect(schema.itemListElement.some(element => element.item.name === 'Actuação com Amess')).toBe(true);
  });

  it('carries per-event inLanguage for language-bearing performances only', () => {
    const schema = createLiveEventsSchema();
    const aragao = schema.itemListElement.find(element => element.item.name === 'ARAGÃO');
    const instrumentalGig = schema.itemListElement.find(element => element.item.name === 'MADEIRADIG');

    expect(aragao?.item.inLanguage).toBe('pt-PT');
    expect(instrumentalGig?.item.inLanguage).toBeUndefined();
  });
});
