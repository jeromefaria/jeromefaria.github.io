import type { PlayContext } from '@/composables/usePlayer';
import { worksData } from '@/data/works';
import type { Release } from '@/types';
import { hasCoverImage } from '@/types';

import { stripHtml } from './stripHtml';

export interface ReleasePermalinkOptions {
  track?: number;
  t?: number;
}

export const findRelease = (releaseId: string): Release | null => {
  for (const section of Object.values(worksData)) {
    const match = section.items.find(item => item.id === releaseId);
    if (match) return match;
  }
  return null;
};

export const buildReleaseContext = (release: Release): PlayContext => ({
  album: release.title,
  ...(hasCoverImage(release) ? { artwork: release.coverImage } : {}),
});

interface ReleaseHead {
  title: string;
  description: string;
  ogType: string;
  image?: string;
}

export const releaseHead = (release: Release): ReleaseHead => ({
  title: release.title,
  description: release.description
    ? stripHtml(release.description)
    : `${release.title} — a release by Jerome Faria.`,
  ogType: 'music.album',
  ...(hasCoverImage(release) ? { image: release.coverImage } : {}),
});

// The shareable path for a release, optionally pinned to a track (1-based) or a time offset.
export const releasePath = (releaseId: string, { track, t }: ReleasePermalinkOptions = {}): string => {
  const params = new URLSearchParams();

  if (t !== undefined) params.set('t', String(t));
  else if (track !== undefined) params.set('track', String(track));

  const query = params.toString();
  return `/works/${releaseId}${query ? `?${query}` : ''}`;
};
