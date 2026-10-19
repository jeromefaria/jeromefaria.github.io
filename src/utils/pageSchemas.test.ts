import { describe, expect, it } from 'vitest';

import { liveEvents, liveYears } from '@/data/live';
import { siteConfig, social } from '@/data/navigation';
import { worksData } from '@/data/works';

import { createLiveEventsSchema } from './liveSchema';
import { createBlogPostingSchema, createBreadcrumbSchema, createContactPageSchema, createEssayBreadcrumbSchema, createPersonSchema, createWebSiteSchema } from './pageSchemas';
import { createWorksPageSchema } from './worksSchema';

describe('createBlogPostingSchema', () => {
  it('builds a BlogPosting from an essay and its canonical URL', () => {
    const essay = { slug: 'x', title: 'My Essay', date: '2025-01-02', description: 'About things', tagline: 'A tagline' };
    const canonicalUrl = 'https://jeromefaria.com/writing/x';
    const schema = createBlogPostingSchema(essay, canonicalUrl);

    expect(schema['@context']).toBe('https://schema.org');
    expect(schema['@type']).toBe('BlogPosting');
    expect(schema.headline).toBe('My Essay');
    expect(schema.datePublished).toBe('2025-01-02');
    expect(schema.url).toBe(canonicalUrl);
    expect(schema.mainEntityOfPage).toBe(canonicalUrl);
    expect(schema.author.name).toBe(siteConfig.author.name);
    expect(schema.publisher['@type']).toBe('Person');
  });
});

describe('createPersonSchema', () => {
  it('builds a Person from the site config and social links', () => {
    const schema = createPersonSchema();

    expect(schema['@type']).toBe('Person');
    expect(schema.name).toBe(siteConfig.author.name);
    expect(schema.url).toBe(siteConfig.url);
    expect(schema.jobTitle).toBe(siteConfig.tagline.en);
    expect(schema.image).toBe(`${siteConfig.url}${siteConfig.image}`);
  });

  it('declares the NNY alias and ties its Discogs artist page into sameAs', () => {
    const schema = createPersonSchema();

    expect(schema.alternateName).toBe(siteConfig.author.alias);
    expect(schema.sameAs).toEqual([...social.map(link => link.url), siteConfig.author.discogsArtistUrl]);
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
    expect(createContactPageSchema('en').inLanguage).toBe('en-GB');
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

  it('marks the English book en-GB and tags only language-bearing albums', () => {
    const schema = createWorksPageSchema();
    const [musicGroup, book] = schema['@graph'];

    expect(book.inLanguage).toBe('en-GB');
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

describe('createWebSiteSchema', () => {
  it('builds a WebSite from the site config', () => {
    const schema = createWebSiteSchema();

    expect(schema['@type']).toBe('WebSite');
    expect(schema.name).toBe(siteConfig.title);
    expect(schema.url).toBe(siteConfig.url);
    expect(schema.inLanguage).toBe('en-GB');
    expect(schema.author.name).toBe(siteConfig.author.name);
  });

  it('localizes the description and language', () => {
    const schema = createWebSiteSchema('pt');
    expect(schema.inLanguage).toBe('pt-PT');
    expect(schema.description).not.toBe(createWebSiteSchema('en').description);
    expect(schema.description.length).toBeGreaterThan(0);
  });
});

describe('createBreadcrumbSchema', () => {
  it('prepends the home crumb and numbers positions from one', () => {
    const schema = createBreadcrumbSchema([
      { name: 'Works', url: 'https://jeromefaria.com/works' },
      { name: 'Caligari', url: 'https://jeromefaria.com/works/caligari' },
    ]);

    expect(schema['@type']).toBe('BreadcrumbList');
    expect(schema.itemListElement).toHaveLength(3);
    expect(schema.itemListElement[0]).toMatchObject({ position: 1, name: siteConfig.title, item: siteConfig.url });
    expect(schema.itemListElement[1]).toMatchObject({ position: 2, name: 'Works' });
    expect(schema.itemListElement[2]).toMatchObject({ position: 3, name: 'Caligari' });
  });
});

describe('createEssayBreadcrumbSchema', () => {
  it('builds a Home → Writing → essay trail', () => {
    const essay = { slug: 'x', title: 'My Essay', date: '2025-01-02', description: 'About', tagline: 'T' };
    const canonicalUrl = 'https://jeromefaria.com/writing/x';
    const schema = createEssayBreadcrumbSchema(essay, canonicalUrl);
    const names = schema.itemListElement.map(element => element.name);
    const items = schema.itemListElement.map(element => element.item);

    expect(names).toEqual([siteConfig.title, 'Writing', 'My Essay']);
    expect(items).toEqual([siteConfig.url, `${siteConfig.url}/writing`, canonicalUrl]);
  });
});
