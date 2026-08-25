import type { Credit } from './media';
import type { PressQuote } from './press';

export interface EpkPhoto {
  src: string;
  alt: string;
  photographer?: Credit;
}

export type EpkLongBio =
  | { source: 'about'; sectionIds: string[] }
  | { source: 'custom'; html: string };

export interface EpkManifest {
  photos: EpkPhoto[];
  shortBioId: string;
  longBio: EpkLongBio;
  pressQuoteIds: string[];
  highlightLiveIds: string[];
  highlightWorkIds: string[];
}

export interface EpkLiveHighlight {
  year: string;
  title: string;
  location: string;
}

export interface EpkWorkHighlight {
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
