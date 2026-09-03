import type { Localizable, Localized } from '@/i18n/localized';

import type { Credit, Video } from './media';

export interface LiveImage {
  src: string;
  photographer?: Credit;
}

export interface Act {
  text: string;
  url?: string;
  suffix?: string;
}

export type BillEntry = Act | Act[];

export type Setup =
  | { kind: 'solo' }
  | { kind: 'duo'; with: Act }
  | { kind: 'project'; name: Act; members?: Act[] }
  | { kind: 'band'; band: Act }
  | { kind: 'ensemble'; name: Localizable<string>; members?: Act[] };

export type Format =
  | { kind: 'theatre' }
  | { kind: 'talk' }
  | { kind: 'filmScore'; film: string; premiere?: boolean };

export interface Poster {
  src: string;
  alt: Localizable<string>;
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
  title: Localizable<string>;
  titleUrl?: string;
  // BCP-47 spoken language of the performance (e.g. 'pt-PT' for a theatre play or talk); omitted for instrumental sets.
  language?: string;
  date: string;
  endDate?: string;
  venue: EventVenue;
  setup: Setup;
  format?: Format;
  performedAs?: string;
  bill?: BillEntry[];
  note?: Localized<string>;
  imageAlt?: Localizable<string>;
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
