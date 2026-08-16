// Page-level JSON-LD builders, composing the primitives in ./schemaHelpers so
// the views stay free of structured-data assembly.

import { liveYears, sortedLiveData } from '@/data/live';
import { siteConfig, social } from '@/data/navigation';
import { worksData } from '@/data/works';
import { hasBandcampId, hasBandcampUrl } from '@/types';
import type {
  SchemaBook,
  SchemaContactPage,
  SchemaItemList,
  SchemaProfilePerson,
  SchemaWorksGraph,
} from '@/types/schema';

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

// Book schema derived from the publication release, so the shared facts
// (title, cover, url, year, publisher, ISBN) have a single source of truth in
// the works data. Editors and the contributor credit live only here.
const createGlitchBookSchema = (): SchemaBook => {
  const book = worksData['publications']?.items[0];
  if (book?.meta.kind !== 'publication') {
    throw new Error('Expected a publication release in worksData.publications');
  }

  const { meta } = book;
  return {
    '@type': 'Book',
    name: book.title,
    image: book.coverImage ? `${siteConfig.url}${book.coverImage}` : '',
    url: book.externalUrl ?? '',
    datePublished: String(meta.year),
    isbn: meta.isbn?.value ?? '',
    publisher: {
      '@type': 'Organization',
      name: meta.publisher.text,
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
};

/** Works page: a MusicGroup with its solo albums, plus the Glitch book. */
export const createWorksPageSchema = (): SchemaWorksGraph => {
  const soloSection = worksData['solo'];
  const albums = (soloSection?.items ?? [])
    .filter(release => hasBandcampId(release) || hasBandcampUrl(release))
    .map(release => {
      const withDate = { ...release, datePublished: String(release.meta.year) };
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
      createGlitchBookSchema(),
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
