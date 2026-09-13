import type { Localizable, Localized } from '@/i18n/localized';
import type { PtGrammar } from '@/i18n/ptGrammar';

import type { Credit, Video } from './media';

export interface ThumbFraming {
  position?: string;
  scale?: number;
  rotate?: number;
  translateX?: string;
}

export interface LiveImage {
  src: string;
  photographer?: Credit;
  cover?: boolean;
  thumb?: ThumbFraming;
  cardThumb?: ThumbFraming;
}

export interface Act {
  text: string;
  url?: string;
  suffix?: Localizable<string>;
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
  | { kind: 'filmScore'; film: Localizable<string>; premiere?: boolean };

export interface LiveAltLocation {
  subject?: Localizable<string>;
  label?: Localizable<string>;
  grammar?: PtGrammar;
  onVenue?: boolean;
}

export type EventKind = 'festival' | 'series' | 'showcase' | 'open-air';

export interface Poster {
  src: string;
  alt: Localizable<string>;
  artist?: Credit;
  cover?: boolean;
  thumb?: ThumbFraming;
  cardThumb?: ThumbFraming;
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
  language?: string;
  date: string;
  endDate?: string;
  venue: EventVenue;
  setup: Setup;
  format?: Format;
  altLocation?: LiveAltLocation;
  eventType?: EventKind[];
  performedAs?: string;
  note?: Localized<string>;
  bill?: BillEntry[];
  credit?: Localized<string>;
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
