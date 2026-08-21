import type { Photographer, Video } from './media';

export interface LiveImage {
  src: string;
  alt?: string;
  photographer?: Photographer;
}

// Event artwork, not a photograph: alt is required (it carries the event's text) and it credits an artist.
export interface Poster {
  src: string;
  alt: string;
  artist?: Photographer;
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
  posters?: Poster[];
  videos?: Video[];
}

export interface LiveYearSection {
  title: string;
  id: string;
  items: LiveEvent[];
}

export type LiveData = Record<string, LiveYearSection>;
