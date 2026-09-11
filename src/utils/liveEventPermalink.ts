import { liveEvents } from '@/data/live';
import { siteConfig } from '@/data/navigation';
import { localize } from '@/i18n/localized';
import { DEFAULT_LOCALE, type Locale } from '@/i18n/messages';
import type { LiveEvent } from '@/types';

import { formatEventDateRange } from './formatters';
import { venueLabel } from './venueFormat';

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

export const liveEventHead = (event: LiveEvent, locale: Locale = DEFAULT_LOCALE): LiveEventHead => {
  const location = venueLabel(event.venue, locale);
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
