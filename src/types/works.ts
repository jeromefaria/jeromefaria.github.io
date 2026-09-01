import type { Localized } from '@/i18n/localized';

import type { Contributor, MetaLink } from './common';
import type { Credits } from './credits';
import type { Credit, Video } from './media';

export type { MetaLink };

export interface Image {
  src: string;
  alt: string;
  photographer?: Credit;
}

export interface Track {
  title: string;
  artist?: Credit;
  // Offset (seconds) of this movement within a single-file release, for chaptered seeking.
  start?: number;
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

export type EngineeringRole = 'mixing' | 'mastering';

// A mixing/mastering credit; `artist` names the third-party act, omitted on a generated own-release credit.
export interface EngineeringMeta {
  kind: 'engineering';
  artist?: Credit;
  roles: EngineeringRole[];
  editions: Edition[];
  year: number;
}

export type ReleaseMeta = MusicMeta | CompilationMeta | CommissionMeta | PublicationMeta | EngineeringMeta;

export interface Release {
  id: string;
  title: string;
  meta: ReleaseMeta;
  bandcampId?: string;
  bandcampUrl?: string;
  soundcloudUrl?: string;
  externalUrl?: string;
  coverImage?: string;
  tracklist?: Track[];
  description?: Localized<string>;
  credits?: Credits;
  contributors?: Contributor[];
  images?: Image[];
  videos?: Video[];
  // Roles on one of Jerome's own releases — generates a Mixing & Mastering credit without duplicating it.
  engineering?: EngineeringRole[];
  // On a generated credit: the canonical release id it links back to.
  worksRef?: string;
}

export const hasBandcampId = (release: Release): release is Release & { bandcampId: string } =>
  Boolean(release.bandcampId);

export const hasBandcampUrl = (release: Release): release is Release & { bandcampUrl: string } =>
  Boolean(release.bandcampUrl);

export const hasSoundcloudUrl = (release: Release): release is Release & { soundcloudUrl: string } =>
  Boolean(release.soundcloudUrl);

export const hasExternalUrl = (release: Release): release is Release & { externalUrl: string } =>
  Boolean(release.externalUrl);

export const hasCoverImage = (release: Release): release is Release & { coverImage: string } =>
  Boolean(release.coverImage);

export const hasTracklist = (release: Release): release is Release & { tracklist: Track[] } =>
  Boolean(release.tracklist);

export const hasDescription = (release: Release): release is Release & { description: Localized<string> } =>
  Boolean(release.description);

export const hasCredits = (release: Release): release is Release & { credits: string } =>
  Boolean(release.credits);

export const hasImages = (release: Release): release is Release & { images: Image[] } =>
  Boolean(release.images);

export const hasVideos = (release: Release): release is Release & { videos: Video[] } =>
  Boolean(release.videos);

export interface WorksSection {
  title: Localized<string>;
  id: string;
  items: Release[];
}

export type WorksData = Record<string, WorksSection>;
