import { siteConfig } from '@/data/navigation';
import { worksData } from '@/data/works';
import { BCP47_LOCALE } from '@/i18n/messages';
import { hasBandcampId, hasBandcampUrl } from '@/types';
import type { SchemaBook, SchemaWorksGraph } from '@/types/schema';

import { createMusicAlbumSchema } from './schemaHelpers';

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
