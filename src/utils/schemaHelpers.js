import { parseVenue, stripHtml } from './formatters';

/**
 * Create a MusicEvent schema for a live performance
 * @param {Object} event - Event object with title, date, venue, etc.
 * @param {string} performerName - Name of the performer
 * @param {string} fallbackDate - Fallback date if event.date is not available
 * @returns {Object} Schema.org MusicEvent
 */
export const createMusicEventSchema = (event, performerName, fallbackDate = '') => {
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
 * @param {Array} items - Array of schema items
 * @param {string} name - List name
 * @param {string} description - List description
 * @returns {Object} Schema.org ItemList
 */
export const createItemListSchema = (items, name, description) => ({
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
 * @param {Object} release - Release object
 * @param {string} artistName - Artist name
 * @param {string} siteUrl - Base site URL for images
 * @returns {Object} Schema.org MusicAlbum
 */
export const createMusicAlbumSchema = (release, artistName, siteUrl) => ({
  '@type': 'MusicAlbum',
  name: release.title,
  url: release.bandcampUrl,
  image: release.coverImage ? `${siteUrl}${release.coverImage}` : undefined,
  datePublished: release.datePublished,
  numTracks: release.tracklist?.length,
  byArtist: {
    '@type': 'Person',
    name: artistName,
  },
});
