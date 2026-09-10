import { venues } from '@/data/venues';
import { createNameLookup } from '@/utils/registry';

const findVenue = createNameLookup(venues);

export const venueUrl = (name: string): string | undefined => findVenue(name)?.url;
