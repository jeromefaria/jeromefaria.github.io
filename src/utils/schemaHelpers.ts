import { orgs } from '@/data/orgs';
import { localize, type Localized } from '@/i18n/localized';
import { DEFAULT_LOCALE, type Locale } from '@/i18n/messages';
import type { Act, LiveEvent, Setup } from '@/types/live';
import type { Organization } from '@/types/orgs';
import type { SchemaItemList, SchemaMusicAlbum, SchemaMusicEvent, SchemaOrganization, SchemaPerson } from '@/types/schema';
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

const eventImageUrl = (event: LiveEvent, siteUrl: string): string | undefined => {
  const candidates = [...(event.images ?? []), ...(event.posters ?? [])];
  const chosen = candidates.find(candidate => candidate.cover) ?? candidates[0];

  return chosen && siteUrl ? `${siteUrl}${chosen.src}` : undefined;
};

const resolveOrganizers = (keys: string[] = []): SchemaOrganization[] =>
  keys
    .map(key => orgs[key])
    .filter((org): org is Organization => Boolean(org))
    .map(org => ({ '@type': 'Organization' as const, name: org.name, ...(org.url && { url: org.url }) }));

export const createMusicEventSchema = (
  event: LiveEvent,
  performerName: string,
  fallbackDate = '',
  locale: Locale = DEFAULT_LOCALE,
  siteUrl = '',
): SchemaMusicEvent => {
  const image = eventImageUrl(event, siteUrl);
  const organizers = resolveOrganizers(event.presentedBy);

  return {
    '@type': 'MusicEvent',
    name: localize(event.title, locale),
    ...(event.language && { inLanguage: event.language }),
    startDate: event.date || fallbackDate,
    ...(event.endDate && { endDate: event.endDate }),
    eventStatus: 'https://schema.org/EventScheduled',
    ...(event.note && { description: stripHtml(localize(event.note, locale)) }),
    ...(image && { image }),
    location: {
      '@type': 'Place',
      name: event.venue.name ?? '',
      address: {
        '@type': 'PostalAddress',
        addressLocality: event.venue.city ?? '',
        addressCountry: event.venue.country,
      },
    },
    ...(organizers.length > 0 && { organizer: organizers }),
    performer: buildPerformers(event, performerName),
  };
};

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
  const sameAs = [release.bandcampUrl, release.soundcloudUrl, release.discogsUrl]
    .filter((url): url is string => Boolean(url));
  const numTracks = release.tracklist?.length ?? 0;

  return {
    '@type': 'MusicAlbum',
    name: release.title,
    ...(release.language && { inLanguage: release.language }),
    url: `${siteUrl}/works/${release.id}`,
    ...(sameAs.length > 0 && { sameAs }),
    ...(release.coverImage && { image: `${siteUrl}${release.coverImage}` }),
    ...(release.description && { description: stripHtml(localize(release.description, locale)) }),
    genre: [...MUSIC_GENRES],
    datePublished: release.datePublished ?? '',
    ...(numTracks > 0 && { numTracks }),
    byArtist: {
      '@type': 'Person',
      name: artistName,
      url: siteUrl,
    },
  };
};
