import type { Localizable } from '@/i18n/localized';

import type { Credit } from './media';
import type { PressQuote } from './press';

export interface EpkPhoto {
  src: string;
  alt: Localizable<string>;
  photographer?: Credit;
}

export type BioVariant = 'short' | 'press';

export interface EpkManifest {
  photos: EpkPhoto[];
  shortBio: BioVariant;
  longBio: BioVariant;
  pressQuoteIds: string[];
  highlightLiveIds: string[];
  highlightWorkIds: string[];
}

export interface EpkLiveHighlight {
  id: string;
  year: string;
  title: string;
  location: string;
}

export interface EpkWorkHighlight {
  id: string;
  year: number;
  title: string;
}

export interface EpkContent {
  photos: EpkPhoto[];
  shortBio: string;
  longBio: string;
  quotes: PressQuote[];
  liveHighlights: EpkLiveHighlight[];
  workHighlights: EpkWorkHighlight[];
}
