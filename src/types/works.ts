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

// Field-presence guards for the Release union, so callers narrow once instead of
// repeating `'x' in release && release.x` at every use site.
export const hasBandcampId = (release: Release): release is Release & { bandcampId: string } =>
  'bandcampId' in release && Boolean(release.bandcampId);

export const hasBandcampUrl = (release: Release): release is Release & { bandcampUrl: string } =>
  'bandcampUrl' in release && Boolean(release.bandcampUrl);

export const hasExternalUrl = (release: Release): release is Release & { externalUrl: string } =>
  'externalUrl' in release && Boolean(release.externalUrl);

export const hasCoverImage = (release: Release): release is Release & { coverImage: string } =>
  'coverImage' in release && Boolean(release.coverImage);

export const hasTracklist = (release: Release): release is Release & { tracklist: string[] } =>
  'tracklist' in release && Boolean(release.tracklist);

export const hasDescription = (release: Release): release is Release & { description: string } =>
  'description' in release && Boolean(release.description);

export const hasCredits = (release: Release): release is Release & { credits: string } =>
  'credits' in release && Boolean(release.credits);

export const hasImages = (release: Release): release is Release & { images: Image[] } =>
  'images' in release && Boolean(release.images);

export const hasVideos = (release: Release): release is Release & { videos: VideoItem[] } =>
  'videos' in release && Boolean(release.videos);

export interface WorksSection {
  title: string;
  id: string;
  items: Release[];
}

export type WorksData = Record<string, WorksSection>;
