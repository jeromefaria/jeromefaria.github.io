import type { Credit, Video } from './media';

export interface Image {
  src: string;
  alt: string;
  photographer?: Credit;
}

export interface MetaLink {
  text: string;
  url?: string;
}

export interface Track {
  title: string;
  artist?: MetaLink;
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

// Each commission `work` requires exactly its own credit field, so the variant
// is discriminated rather than carrying three undiscriminated optionals.
interface FilmCommission {
  kind: 'commission';
  work: 'Film';
  director: MetaLink;
  year: number;
}

interface TheatreCommission {
  kind: 'commission';
  work: 'Theatre';
  venue: MetaLink;
  year: number;
}

interface DvdCommission {
  kind: 'commission';
  work: 'DVD';
  publisher: Edition;
  year: number;
}

interface LiveScoreCommission {
  kind: 'commission';
  work: 'Live Score';
  year: number;
}

export type CommissionMeta = FilmCommission | TheatreCommission | DvdCommission | LiveScoreCommission;

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
  tracklist?: Track[];
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

export const hasTracklist = (release: Release): release is Release & { tracklist: Track[] } =>
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
