import { liveYears, sortedLiveData } from '@/data/live';
import { siteConfig, social } from '@/data/navigation';
import { worksData } from '@/data/works';
import { localize } from '@/i18n/localized';
import { BCP47_LOCALE, DEFAULT_LOCALE, type Locale } from '@/i18n/messages';
import { hasBandcampId, hasBandcampUrl } from '@/types';
import type {
  SchemaBook,
  SchemaContactPage,
  SchemaItemList,
  SchemaProfilePerson,
  SchemaWorksGraph,
} from '@/types/schema';

import { createItemListSchema, createMusicAlbumSchema, createMusicEventSchema } from './schemaHelpers';

export const createPersonSchema = (locale: Locale = DEFAULT_LOCALE): SchemaProfilePerson => ({
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: siteConfig.author.name,
  url: siteConfig.url,
  jobTitle: localize(siteConfig.tagline, locale),
  description: localize(siteConfig.description, locale),
  image: `${siteConfig.url}${siteConfig.image}`,
  sameAs: social.map(link => link.url),
});

export const createContactPageSchema = (locale: Locale = DEFAULT_LOCALE): SchemaContactPage => ({
  '@context': 'https://schema.org',
  '@type': 'ContactPage',
  inLanguage: BCP47_LOCALE[locale],
  mainEntity: {
    '@type': 'Person',
    name: siteConfig.author.name,
    email: siteConfig.author.email,
    url: siteConfig.url,
  },
});

const createGlitchBookSchema = (): SchemaBook => {
  const book = worksData['publications']?.items[0];
  if (book?.meta.kind !== 'publication') {
    throw new Error('Expected a publication release in worksData.publications');
  }

  const { meta } = book;
  return {
    '@type': 'Book',
    name: book.title,
    inLanguage: BCP47_LOCALE.en,
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

export const createLiveEventsSchema = (locale: Locale = DEFAULT_LOCALE): SchemaItemList => {
  const events = liveYears.flatMap(year => {
    const yearData = sortedLiveData[year];
    return (yearData?.items ?? []).map(event =>
      createMusicEventSchema(event, siteConfig.author.name, `${year}-01-01`, locale));
  });

  const listText = {
    en: {
      name: `${siteConfig.author.name} Live Performances`,
      description: 'Live performance history from 2005 to present',
    },
    pt: {
      name: `Actuações de ${siteConfig.author.name}`,
      description: 'Histórico de actuações de 2005 até ao presente',
    },
  };

  return createItemListSchema(events, listText[locale].name, listText[locale].description);
};
