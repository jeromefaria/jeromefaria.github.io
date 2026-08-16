import type { Photographer } from './lightbox';

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

export interface Edition {
  label: string;
  catalog?: string;
}

export interface ReleaseMeta {
  appearance?: string;
  credit?: string;
  format?: string;
  editions: Edition[];
  year: number;
  note?: string;
}

export interface Release {
  id: string;
  title: string;
  meta: ReleaseMeta;
  bandcampId?: string;
  bandcampUrl?: string;
  externalUrl?: string;
  coverImage?: string;
  tracklist?: string[];
  description?: string;
  credits?: string;
  images?: Image[];
  videos?: VideoItem[];
}

export const hasBandcampId = (release: Release): release is Release & { bandcampId: string } =>
  Boolean(release.bandcampId);

export const hasBandcampUrl = (release: Release): release is Release & { bandcampUrl: string } =>
  Boolean(release.bandcampUrl);

export const hasExternalUrl = (release: Release): release is Release & { externalUrl: string } =>
  Boolean(release.externalUrl);

export const hasCoverImage = (release: Release): release is Release & { coverImage: string } =>
  Boolean(release.coverImage);

export const hasTracklist = (release: Release): release is Release & { tracklist: string[] } =>
  Boolean(release.tracklist);

export const hasDescription = (release: Release): release is Release & { description: string } =>
  Boolean(release.description);

export const hasCredits = (release: Release): release is Release & { credits: string } =>
  Boolean(release.credits);

export const hasImages = (release: Release): release is Release & { images: Image[] } =>
  Boolean(release.images);

export const hasVideos = (release: Release): release is Release & { videos: VideoItem[] } =>
  Boolean(release.videos);

export interface WorksSection {
  title: string;
  id: string;
  items: Release[];
}

export type WorksData = Record<string, WorksSection>;
