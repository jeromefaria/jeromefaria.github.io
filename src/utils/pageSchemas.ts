// Page-level JSON-LD builders, composing the primitives in ./schemaHelpers so
// the views stay free of structured-data assembly.

import { liveYears, sortedLiveData } from '@/data/live';
import { siteConfig, social } from '@/data/navigation';
import { worksData } from '@/data/works';
import type { BandcampRelease, ExternalRelease } from '@/types';
import type {
  SchemaBook,
  SchemaContactPage,
  SchemaItemList,
  SchemaProfilePerson,
  SchemaWorksGraph,
} from '@/types/schema';

import { extractYear } from './formatters';
import { createItemListSchema, createMusicAlbumSchema, createMusicEventSchema } from './schemaHelpers';

/** Person schema for the homepage. */
export const createPersonSchema = (): SchemaProfilePerson => ({
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: siteConfig.author.name,
  url: siteConfig.url,
  jobTitle: siteConfig.tagline,
  description: siteConfig.description,
  image: `${siteConfig.url}${siteConfig.image}`,
  sameAs: social.map(link => link.url),
});

export const createContactPageSchema = (): SchemaContactPage => ({
  '@context': 'https://schema.org',
  '@type': 'ContactPage',
  mainEntity: {
    '@type': 'Person',
    name: siteConfig.author.name,
    email: siteConfig.author.email,
    url: siteConfig.url,
  },
});

const glitchBookSchema: SchemaBook = {
  '@type': 'Book',
  name: 'Glitch: Designing Imperfection',
  image: `${siteConfig.url}/images/glitch.jpg`,
  url: 'https://www.amazon.com/Glitch-Designing-Imperfection-Iman-Moradi/dp/0979966663',
  datePublished: '2009',
  isbn: '978-0-9799666-6-8',
  publisher: {
    '@type': 'Organization',
    name: 'Mark Batty Publisher',
  },
  editor: [
    { '@type': 'Person', name: 'Iman Moradi' },
    { '@type': 'Person', name: 'Ant Scott' },
    { '@type': 'Person', name: 'Joe Gilmore' },
    { '@type': 'Person', name: 'Christopher Murphy' },
  ],
  contributor: {
    '@type': 'Person',
    name: siteConfig.author.name,
  },
};

/** Works page: a MusicGroup with its solo albums, plus the Glitch book. */
export const createWorksPageSchema = (): SchemaWorksGraph => {
  const soloSection = worksData['solo'];
  const albums = (soloSection?.items ?? [])
    .filter((release): release is BandcampRelease | ExternalRelease =>
      ('bandcampId' in release && release.bandcampId !== undefined) ||
      ('bandcampUrl' in release && release.bandcampUrl !== undefined))
    .map(release => {
      const datePublished = extractYear(release.meta ?? null);
      const withDate = { ...release, ...(datePublished ? { datePublished } : {}) };
      return createMusicAlbumSchema(withDate, siteConfig.author.name, siteConfig.url);
    });

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'MusicGroup',
        name: siteConfig.author.name,
        url: siteConfig.url,
        genre: ['Electronic', 'Experimental', 'Ambient'],
        album: albums,
      },
      glitchBookSchema,
    ],
  };
};

/** Live page: an ItemList of every performance, newest year first. */
export const createLiveEventsSchema = (): SchemaItemList => {
  const events = liveYears.flatMap(year => {
    const yearData = sortedLiveData[year];
    return (yearData?.items ?? []).map(event =>
      createMusicEventSchema(event, siteConfig.author.name, `${year}-01-01`));
  });

  return createItemListSchema(
    events,
    `${siteConfig.author.name} Live Performances`,
    'Live performance history from 2005 to present',
  );
};
