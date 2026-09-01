import { localize } from '@/i18n/localized';
import { DEFAULT_LOCALE, type Locale } from '@/i18n/messages';
import type { LiveEvent } from '@/types/live';
import type { SchemaItemList, SchemaMusicAlbum, SchemaMusicEvent } from '@/types/schema';
import type { Track } from '@/types/works';

interface ReleaseForSchema {
  title: string;
  language?: string;
  bandcampUrl?: string;
  soundcloudUrl?: string;
  coverImage?: string;
  datePublished?: string;
  tracklist?: Track[];
}

export const createMusicEventSchema = (
  event: LiveEvent,
  performerName: string,
  fallbackDate = '',
  locale: Locale = DEFAULT_LOCALE,
): SchemaMusicEvent => ({
  '@type': 'MusicEvent',
  name: localize(event.title, locale),
  ...(event.language && { inLanguage: event.language }),
  startDate: event.date || fallbackDate,
  ...(event.endDate && { endDate: event.endDate }),
  location: {
    '@type': 'Place',
    name: event.venue.name ?? '',
    address: {
      '@type': 'PostalAddress',
      addressLocality: event.venue.city ?? '',
      addressCountry: event.venue.country,
    },
  },
  performer: {
    '@type': 'Person',
    name: performerName,
  },
});

export const createItemListSchema = (
  items: SchemaMusicEvent[],
  name: string,
  description: string,
): SchemaItemList => ({
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name,
  description,
  numberOfItems: items.length,
  itemListElement: items.map((item, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    item,
  })),
});

export const createMusicAlbumSchema = (
  release: ReleaseForSchema,
  artistName: string,
  siteUrl: string,
): SchemaMusicAlbum => {
  const schema: SchemaMusicAlbum = {
    '@type': 'MusicAlbum',
    name: release.title,
    url: release.bandcampUrl ?? '',
    datePublished: release.datePublished ?? '',
    byArtist: {
      '@type': 'Person',
      name: artistName,
    },
  };

  if (release.language) {
    schema.inLanguage = release.language;
  }

  if (release.soundcloudUrl) {
    schema.sameAs = [release.soundcloudUrl];
  }

  if (release.coverImage) {
    schema.image = `${siteUrl}${release.coverImage}`;
  }

  if (release.tracklist?.length) {
    schema.numTracks = release.tracklist.length;
  }

  return schema;
};
