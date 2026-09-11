import { liveEvents } from '@/data/live';
import { siteConfig } from '@/data/navigation';
import { localizePlace } from '@/i18n/exonyms';
import { localize } from '@/i18n/localized';
import { DEFAULT_LOCALE, type Locale } from '@/i18n/messages';
import type { LiveEvent } from '@/types';

import { formatEventDateRange } from './formatters';

export const findLiveEvent = (eventId: string): LiveEvent | null =>
  liveEvents.find(event => event.id === eventId) ?? null;

export const liveEventPath = (eventId: string): string => `/live/${eventId}`;

interface LiveEventHead {
  title: string;
  description: string;
  image?: string;
}

const hasEventCard = (event: LiveEvent): boolean =>
  Boolean(event.images?.length) || Boolean(event.posters?.length);

const eventLocation = (event: LiveEvent, locale: Locale): string => {
  const place = [event.venue.city, event.venue.country]
    .filter((part): part is string => Boolean(part))
    .map(part => localizePlace(part, locale))
    .join(', ');

  return [event.venue.name, place].filter(Boolean).join(', ');
};

export const liveEventHead = (event: LiveEvent, locale: Locale = DEFAULT_LOCALE): LiveEventHead => {
  const location = eventLocation(event, locale);
  const date = formatEventDateRange(event.date, event.endDate, locale);
  const preposition = event.venue.name ? 'at' : 'in';
  const lead = locale === DEFAULT_LOCALE
    ? `${siteConfig.author.name} live ${preposition} ${location}`
    : `${siteConfig.author.name} ao vivo em ${location}`;

  return {
    title: localize(event.title, locale),
    description: `${lead} · ${date}.`,
    ...(hasEventCard(event) ? { image: `/og-live-${event.id}-${locale}.jpg` } : {}),
  };
};
