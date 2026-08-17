import type { Photographer } from './lightbox';

export interface LiveImage {
  src: string;
  // Per-image override; most galleries fall back to the event's imageAlt.
  alt?: string;
  photographer?: Photographer;
}

export interface LiveVideo {
  url: string;
  title: string;
  platform: 'youtube' | 'vimeo';
  author?: Photographer;
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
  date: string;
  venue: EventVenue;
  description?: string;
  imageAlt?: string;
  images?: LiveImage[];
  videos?: LiveVideo[];
}

export interface LiveYearSection {
  title: string;
  id: string;
  items: LiveEvent[];
}

export type LiveData = Record<string, LiveYearSection>;
