import type { Photographer, Video } from './media';

export interface LiveImage {
  src: string;
  alt?: string;
  photographer?: Photographer;
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
  videos?: Video[];
}

export interface LiveYearSection {
  title: string;
  id: string;
  items: LiveEvent[];
}

export type LiveData = Record<string, LiveYearSection>;
