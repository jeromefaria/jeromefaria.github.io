import type { Photographer, Video } from './media';

export interface Image {
  src: string;
  alt: string;
  photographer?: Photographer;
}

export interface MetaLink {
  text: string;
  url?: string;
}

export type Medium = 'Digital' | 'Cassette' | 'MP3' | 'CD' | 'CDr';

export interface Edition {
  label: MetaLink;
  catalog?: string;
}

export interface Isbn {
  value: string;
  url?: string;
}

export interface MusicMeta {
  kind: 'music';
  mediums: Medium[];
  editions: Edition[];
  year: number;
}

export interface CompilationMeta {
  kind: 'compilation';
  compilation: MetaLink;
  collaborators?: string[];
  mediums: Medium[];
  editions: Edition[];
  year: number;
}

export interface CommissionMeta {
  kind: 'commission';
  work: 'Film' | 'Theatre' | 'Live Score' | 'DVD';
  director?: MetaLink;
  venue?: MetaLink;
  publisher?: Edition;
  year: number;
}

export interface PublicationMeta {
  kind: 'publication';
  publisher: MetaLink;
  isbn?: Isbn;
  year: number;
}

export interface MasteringMeta {
  kind: 'mastering';
  artist: MetaLink;
  editions: Edition[];
  year: number;
}

export type ReleaseMeta = MusicMeta | CompilationMeta | CommissionMeta | PublicationMeta | MasteringMeta;

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
  videos?: Video[];
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

export const hasVideos = (release: Release): release is Release & { videos: Video[] } =>
  Boolean(release.videos);

export interface WorksSection {
  title: string;
  id: string;
  items: Release[];
}

export type WorksData = Record<string, WorksSection>;
