import type { LiveData, LiveEvent, LiveYearSection, RawLiveEvent } from '@/types/live';

import { earlyEvents } from './live/early.ts';
import { midEvents } from './live/mid.ts';
import { recentEvents } from './live/recent.ts';
import { resolveEventVenue } from './live/resolveVenue.ts';

const resolveEvent = (event: RawLiveEvent): LiveEvent => ({ ...event, venue: resolveEventVenue(event.venue) });

export const liveEvents: LiveEvent[] = [...recentEvents, ...midEvents, ...earlyEvents].map(resolveEvent);

const groupEventsByYear = (events: LiveEvent[]): LiveData => {
  const byYear: Record<string, LiveYearSection> = {};

  for (const event of events) {
    const year = event.date.slice(0, 4);
    const section = byYear[year] ?? { title: year, id: year, items: [] };
    section.items.push(event);
    byYear[year] = section;
  }

  return Object.fromEntries(
    Object.entries(byYear).map(([year, section]) => [
      year,
      { ...section, items: [...section.items].sort((a, b) => b.date.localeCompare(a.date)) },
    ]),
  );
};

export const sortedLiveData: LiveData = groupEventsByYear(liveEvents);

export const liveYears: string[] = Object.keys(sortedLiveData).sort((a, b) => b.localeCompare(a));
