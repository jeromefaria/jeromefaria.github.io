import type { Credit, Video } from './media';

export interface LiveImage {
  src: string;
  photographer?: Credit;
}

export interface Act {
  // Paired/nested acts keep both links inline in `text` (e.g. '@c & Lia').
  text: string;
  url?: string;
  suffix?: string;
}

export type Setup =
  | { kind: 'solo' }
  | { kind: 'duo'; with: Act }
  | { kind: 'project'; name: Act; members?: Act[] }
  | { kind: 'band'; band: Act }
  | { kind: 'ensemble'; name: string; members?: Act[] };

export type Format =
  | { kind: 'theatre' }
  | { kind: 'talk' }
  | { kind: 'filmScore'; film: string; premiere?: boolean };

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
  endDate?: string;
  venue: EventVenue;
  setup: Setup;
  format?: Format;
  bill?: Act[];
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
