// Live performance types

import type { Photographer } from './lightbox';

export interface LiveImage {
  src: string;
  alt: string;
  position?: string;
  scale?: number;
  rotate?: number;
  photographer?: Photographer;
}

export interface LiveVideo {
  url: string;
  title: string;
  platform: 'youtube' | 'vimeo';
}

export interface LiveEvent {
  id: string;
  title: string;
  date: string;
  venue: string;
  description?: string;
  images?: LiveImage[];
  videos?: LiveVideo[];
}

export interface LiveYearSection {
  title: string;
  id: string;
  defaultOpen?: boolean;
  items: LiveEvent[];
}

export type LiveData = Record<string, LiveYearSection>;
