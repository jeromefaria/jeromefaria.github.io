import { bios } from '@/data/bios';
import { liveEvents } from '@/data/live';
import { pressQuotes } from '@/data/press';
import { worksData } from '@/data/works';
import { localize } from '@/i18n/localized';
import { DEFAULT_LOCALE, type Locale } from '@/i18n/messages';
import type { EpkContent, EpkLiveHighlight, EpkManifest, EpkPhoto, EpkWorkHighlight } from '@/types/epk';
import type { EventVenue, LiveEvent } from '@/types/live';
import type { Release } from '@/types/works';

const findById = <T extends { id: string }>(items: T[], id: string): T => {
  const match = items.find(item => item.id === id);

  if (!match) {
    throw new Error(`EPK manifest references unknown id: ${id}`);
  }

  return match;
};

const slugify = (value: string): string =>
  value
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

export const photoDownloadFilename = (photo: EpkPhoto, index: number): string => {
  const credit = photo.photographer ? `-by-${slugify(photo.photographer.name)}` : '';

  return `jerome-faria-${index + 1}${credit}.jpg`;
};

export const photoDownloadHref = (photo: EpkPhoto, index: number): string =>
  `/epk/photos/${photoDownloadFilename(photo, index)}`;

export const epkKitBasename = 'jerome-faria-press-kit';
export const epkRiderBasename = 'jerome-faria-tech-rider';

export const localeSuffix = (locale: Locale): string => (locale === DEFAULT_LOCALE ? '' : `-${locale}`);

export const epkKitFile = (locale: Locale = DEFAULT_LOCALE): string => `${epkKitBasename}${localeSuffix(locale)}`;
export const epkRiderFile = (locale: Locale = DEFAULT_LOCALE): string => `${epkRiderBasename}${localeSuffix(locale)}`;

export const epkZipHref = (locale: Locale = DEFAULT_LOCALE): string => `/epk/${epkKitFile(locale)}.zip`;
export const epkPdfHref = (locale: Locale = DEFAULT_LOCALE): string => `/epk/${epkKitFile(locale)}.pdf`;
export const epkRiderHref = (locale: Locale = DEFAULT_LOCALE): string => `/epk/${epkRiderFile(locale)}.pdf`;

export const eventLocation = (venue: EventVenue): string => {
  const parts = [venue.name, venue.city].filter(Boolean);

  return parts.length > 0 ? parts.join(', ') : venue.country;
};

export const toLiveHighlight = (event: LiveEvent): EpkLiveHighlight => ({
  id: event.id,
  year: event.date.slice(0, 4),
  title: event.title,
  location: eventLocation(event.venue),
});

export const toWorkHighlight = (release: Release): EpkWorkHighlight => ({
  id: release.id,
  year: release.meta.year,
  title: release.title,
});

export const resolveEpkContent = (manifest: EpkManifest, locale: Locale = DEFAULT_LOCALE): EpkContent => {
  const works = Object.values(worksData).flatMap(section => section.items);

  return {
    photos: manifest.photos,
    shortBio: localize(bios[manifest.shortBio], locale),
    longBio: localize(bios[manifest.longBio], locale),
    quotes: manifest.pressQuoteIds.map(id => findById(pressQuotes, id)),
    liveHighlights: manifest.highlightLiveIds
      .map(id => findById(liveEvents, id))
      .sort((a, b) => b.date.localeCompare(a.date))
      .map(toLiveHighlight),
    workHighlights: manifest.highlightWorkIds
      .map(id => findById(works, id))
      .sort((a, b) => b.meta.year - a.meta.year)
      .map(toWorkHighlight),
  };
};
