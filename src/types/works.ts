// Works/Discography types

import type { Photographer } from './lightbox';

export interface BaseRelease {
  id: string;
  title: string;
  meta: string;
  credits?: string;
  videos?: VideoItem[];
}

export interface BandcampRelease extends BaseRelease {
  bandcampId: string;
  coverImage: string;
  bandcampUrl: string;
  tracklist: string[];
  credits: string;
}

export interface ExternalRelease extends BaseRelease {
  coverImage: string;
  externalUrl: string;
  tracklist: string[];
  credits: string;
}

export interface FilmScore extends BaseRelease {
  coverImage: string;
  description: string;
  credits: string;
  tracklist?: string[];
}

export interface PublicationRelease extends BaseRelease {
  coverImage: string;
  externalUrl: string;
  description: string;
  credits: string;
  images: Image[];
}

export interface CompilationTrack {
  id: string;
  title: string;
  meta: string;
}

export interface MasteringCredit {
  id: string;
  title: string;
  meta: string;
  externalUrl?: string;
}

export interface CollaborationRelease extends BaseRelease {
  bandcampId?: string;
  coverImage?: string;
  bandcampUrl?: string;
  tracklist?: string[];
  credits: string;
  description?: string;
}

export type Release = BandcampRelease | ExternalRelease | FilmScore | PublicationRelease | CompilationTrack | MasteringCredit | CollaborationRelease;

export interface VideoItem {
  url: string;
  title: string;
  platform: 'youtube' | 'vimeo';
  author?: Photographer;
}

export interface Image {
  src: string;
  alt: string;
  photographer?: {
    name: string;
    url?: string;
  };
}

export interface WorksSection {
  title: string;
  id: string;
  items: Release[];
}

export type WorksData = Record<string, WorksSection>;
