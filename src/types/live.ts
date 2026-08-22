import type { MetaLink } from './common';
import type { Credit, Video } from './media';

export interface LiveImage {
  src: string;
  photographer?: Credit;
}

// Rare paired or nested acts keep both links inline in `text` (e.g. '@c & Lia').
export interface Act {
  text: string;
  url?: string;
  suffix?: string;
}

export type Performance =
  | { kind: 'solo' }
  | { kind: 'duo'; with: Act }
  | { kind: 'project'; name: MetaLink; members?: MetaLink[] }
  | { kind: 'withBand'; band: MetaLink }
  | { kind: 'ensemble'; name: string; note?: string }
  | { kind: 'theatre' }
  | { kind: 'filmScore'; film: string; with?: Act; premiere?: boolean }
  | { kind: 'talk' };

// Event artwork, not a photograph: alt is required (it carries the event's text) and it credits an artist.
export interface Poster {
  src: string;
  alt: string;
  artist?: Credit;
}

export interface EventVenue {
  name?: string;
  url?: string;
  city?: string;
  country: string;
}

export interface LiveEvent {
  id: string;
  title: string;
  titleUrl?: string;
  date: string;
  venue: EventVenue;
  performance: Performance;
  lineup?: Act[];
  note?: string;
  imageAlt?: string;
  images?: LiveImage[];
  posters?: Poster[];
  videos?: Video[];
}

export interface LiveYearSection {
  title: string;
  id: string;
  items: LiveEvent[];
}

export type LiveData = Record<string, LiveYearSection>;
