import type { EventVenue, VenueInput } from '@/types/live';

import { venues } from '../venues.ts';

export const resolveEventVenue = (venue: VenueInput): EventVenue => {
  if (!('ref' in venue)) return venue;

  const entry = venues[venue.ref];
  if (!entry) throw new Error(`Unknown venue ref: "${venue.ref}"`);

  return {
    name: entry.name,
    country: venue.country,
    ...(entry.url ? { url: entry.url } : {}),
    ...(entry.label ? { label: entry.label } : {}),
    ...(entry.pt ? { pt: entry.pt } : {}),
    ...(venue.city ? { city: venue.city } : {}),
  };
};
