import { venues } from '@/data/venues';

const byName = new Map<string, string>();

for (const venue of Object.values(venues)) byName.set(venue.name, venue.url);

export const venueUrl = (name: string): string | undefined => byName.get(name);
