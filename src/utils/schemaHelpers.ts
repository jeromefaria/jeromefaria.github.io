import type { LiveEvent } from '@/types/live';
import type { SchemaItemList, SchemaMusicAlbum, SchemaMusicEvent } from '@/types/schema';
import type { Track } from '@/types/works';

interface ReleaseForSchema {
  title: string;
  bandcampUrl?: string;
  coverImage?: string;
  datePublished?: string;
  tracklist?: Track[];
}

export const createMusicEventSchema = (
  event: LiveEvent,
  performerName: string,
  fallbackDate = '',
): SchemaMusicEvent => ({
  '@type': 'MusicEvent',
  name: event.title,
  startDate: event.date || fallbackDate,
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

  if (release.coverImage) {
    schema.image = `${siteUrl}${release.coverImage}`;
  }

  if (release.tracklist?.length) {
    schema.numTracks = release.tracklist.length;
  }

  return schema;
};
