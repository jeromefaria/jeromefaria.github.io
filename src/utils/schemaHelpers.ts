import { localize, type Localized } from '@/i18n/localized';
import { DEFAULT_LOCALE, type Locale } from '@/i18n/messages';
import type { Act, LiveEvent, Setup } from '@/types/live';
import type { SchemaItemList, SchemaMusicAlbum, SchemaMusicEvent, SchemaPerson } from '@/types/schema';
import type { Track } from '@/types/works';
import { personSameAs } from '@/utils/people';

import { stripHtml } from './stripHtml';

export const MUSIC_GENRES = ['Electronic', 'Experimental', 'Ambient'] as const;

const collectCollaborators = (setup: Setup): Act[] => {
  switch (setup.kind) {
    case 'solo': return [];
    case 'duo': return [setup.with];
    case 'band': return [setup.band];
    case 'project': return [setup.name, ...(setup.members ?? [])];
    case 'ensemble': return setup.members ?? [];
  }
};

const toPerformer = (act: Act): SchemaPerson => {
  const sameAs = personSameAs(act.text, act.url);
  return { '@type': 'Person', name: act.text, ...(sameAs && { sameAs }) };
};

interface ReleaseForSchema {
  id: string;
  title: string;
  language?: string;
  bandcampUrl?: string;
  soundcloudUrl?: string;
  discogsUrl?: string;
  coverImage?: string;
  description?: Localized<string>;
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
  performer: buildPerformers(event, performerName),
});

const buildPerformers = (event: LiveEvent, performerName: string): SchemaPerson | SchemaPerson[] => {
  const lead: SchemaPerson = { '@type': 'Person', name: performerName };
  const collaborators = collectCollaborators(event.setup);

  return collaborators.length === 0 ? lead : [lead, ...collaborators.map(toPerformer)];
};

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
  locale: Locale = DEFAULT_LOCALE,
): SchemaMusicAlbum => {
  const schema: SchemaMusicAlbum = {
    '@type': 'MusicAlbum',
    name: release.title,
    url: `${siteUrl}/works/${release.id}`,
    genre: [...MUSIC_GENRES],
    datePublished: release.datePublished ?? '',
    byArtist: {
      '@type': 'Person',
      name: artistName,
      url: siteUrl,
    },
  };

  if (release.language) {
    schema.inLanguage = release.language;
  }

  const sameAs = [release.bandcampUrl, release.soundcloudUrl, release.discogsUrl]
    .filter((url): url is string => Boolean(url));

  if (sameAs.length) {
    schema.sameAs = sameAs;
  }

  if (release.description) {
    schema.description = stripHtml(localize(release.description, locale));
  }

  if (release.coverImage) {
    schema.image = `${siteUrl}${release.coverImage}`;
  }

  if (release.tracklist?.length) {
    schema.numTracks = release.tracklist.length;
  }

  return schema;
};
