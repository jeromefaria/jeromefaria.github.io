import { audioPlayerEnabled } from '@/composables/useFeatureFlags';
import { play, type PlayContext, playFrom } from '@/composables/usePlayer';
import { getReleaseAudio, hasPlayableAudio } from '@/data/audio';
import { worksData } from '@/data/works';
import { localize } from '@/i18n/localized';
import { DEFAULT_LOCALE, type Locale } from '@/i18n/messages';
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

export const canPlayRelease = (releaseId: string): boolean =>
  audioPlayerEnabled.value && hasPlayableAudio(releaseId);

export const playReleaseAt = (release: Release, { track, t }: ReleasePermalinkOptions = {}): void => {
  const tracks = getReleaseAudio(release.id);
  if (tracks.length === 0) return;

  const context = buildReleaseContext(release);

  if (typeof t === 'number' && Number.isFinite(t) && t > 0) {
    void playFrom(tracks, t, context);
    return;
  }
  if (typeof track === 'number' && Number.isFinite(track) && track >= 1 && track <= tracks.length) {
    void play(tracks, track - 1, context);
    return;
  }
  void play(tracks, 0, context);
};

interface ReleaseHead {
  title: string;
  description: string;
  ogType: string;
  image?: string;
}

export const releaseHead = (release: Release, locale: Locale = DEFAULT_LOCALE): ReleaseHead => ({
  title: release.title,
  description: release.description
    ? stripHtml(localize(release.description, locale))
    : `${release.title} — a release by Jerome Faria.`,
  ogType: 'music.album',
  ...(hasCoverImage(release) ? { image: release.coverImage } : {}),
});

export const releasePath = (releaseId: string, { track, t }: ReleasePermalinkOptions = {}): string => {
  const params = new URLSearchParams();

  if (t !== undefined) params.set('t', String(t));
  else if (track !== undefined) params.set('track', String(track));

  const query = params.toString();
  return `/works/${releaseId}${query ? `?${query}` : ''}`;
};
