import { localizePlace } from '@/i18n/exonyms';
import { DEFAULT_LOCALE, type Locale } from '@/i18n/messages';
import type { EventVenue } from '@/types/live';

export const venuePlace = (venue: EventVenue, locale: Locale = DEFAULT_LOCALE): string =>
  [venue.city, venue.country]
    .filter((part): part is string => Boolean(part))
    .map(part => localizePlace(part, locale))
    .join(', ');

export const venueLabel = (venue: EventVenue, locale: Locale = DEFAULT_LOCALE): string =>
  [venue.name, venuePlace(venue, locale)].filter(Boolean).join(', ');

export const venueCompactLabel = (venue: EventVenue, locale: Locale = DEFAULT_LOCALE): string => {
  const city = venue.city ? localizePlace(venue.city, locale) : undefined;
  const parts = [venue.name, city].filter(Boolean);

  return parts.length > 0 ? parts.join(', ') : localizePlace(venue.country, locale);
};

export const venuePrimaryLabel = (venue: EventVenue, locale: Locale = DEFAULT_LOCALE): string =>
  localizePlace(venue.name ?? venue.city ?? venue.country, locale);
