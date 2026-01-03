import type { LiveEvent } from '@/types/live';
import type { SchemaItemList, SchemaMusicAlbum, SchemaMusicEvent } from '@/types/schema';

import { parseVenue, stripHtml } from './formatters';

interface ReleaseForSchema {
  title: string;
  bandcampUrl?: string;
  coverImage?: string;
  datePublished?: string;
  tracklist?: string[];
}

/**
 * Create a MusicEvent schema for a live performance
 * @param event - Event object with title, date, venue, etc.
 * @param performerName - Name of the performer
 * @param fallbackDate - Fallback date if event.date is not available
 * @returns Schema.org MusicEvent
 */
export const createMusicEventSchema = (
  event: LiveEvent,
  performerName: string,
  fallbackDate = '',
): SchemaMusicEvent => {
  const venue = parseVenue(event.venue);
  return {
    '@type': 'MusicEvent',
    name: stripHtml(event.title),
    startDate: event.date || fallbackDate,
    location: {
      '@type': 'Place',
      name: venue.name,
      address: {
        '@type': 'PostalAddress',
        addressLocality: venue.addressLocality,
        addressCountry: venue.addressCountry,
      },
    },
    performer: {
      '@type': 'Person',
      name: performerName,
    },
  };
};

/**
 * Create an ItemList schema
 * @param items - Array of schema items
 * @param name - List name
 * @param description - List description
 * @returns Schema.org ItemList
 */
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

/**
 * Create a MusicAlbum schema
 * @param release - Release object
 * @param artistName - Artist name
 * @param siteUrl - Base site URL for images
 * @returns Schema.org MusicAlbum
 */
export const createMusicAlbumSchema = (
  release: ReleaseForSchema,
  artistName: string,
  siteUrl: string,
): SchemaMusicAlbum => {
  const schema: SchemaMusicAlbum = {
    '@type': 'MusicAlbum',
    name: release.title,
    url: release.bandcampUrl || '',
    datePublished: release.datePublished || '',
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
