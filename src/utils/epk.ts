import { aboutSections } from '@/data/about';
import { liveEvents } from '@/data/live';
import { pressQuotes } from '@/data/press';
import { worksData } from '@/data/works';
import type { AboutSection, AboutTextSection } from '@/types/about';
import { isImageSection } from '@/types/about';
import type { EpkContent, EpkLiveHighlight, EpkLongBio, EpkManifest, EpkWorkHighlight } from '@/types/epk';
import type { EventVenue, LiveEvent } from '@/types/live';
import type { Release } from '@/types/works';

const findById = <T extends { id: string }>(items: T[], id: string): T => {
  const match = items.find(item => item.id === id);

  if (!match) {
    throw new Error(`EPK manifest references unknown id: ${id}`);
  }

  return match;
};

const isTextSection = (section: AboutSection): section is AboutTextSection => !isImageSection(section);

export const resolveLongBio = (longBio: EpkLongBio, sections: AboutSection[]): string => {
  if (longBio.source === 'custom') {
    return longBio.html;
  }

  const textSections = sections.filter(isTextSection);

  return longBio.sectionIds.map(id => findById(textSections, id).content).join('\n');
};

export const eventLocation = (venue: EventVenue): string => {
  const parts = [venue.name, venue.city].filter(Boolean);

  return parts.length > 0 ? parts.join(', ') : venue.country;
};

export const toLiveHighlight = (event: LiveEvent): EpkLiveHighlight => ({
  year: event.date.slice(0, 4),
  title: event.title,
  location: eventLocation(event.venue),
});

export const toWorkHighlight = (release: Release): EpkWorkHighlight => ({
  year: release.meta.year,
  title: release.title,
});

export const resolveEpkContent = (manifest: EpkManifest): EpkContent => {
  const textSections = aboutSections.filter(isTextSection);
  const works = Object.values(worksData).flatMap(section => section.items);

  return {
    photos: manifest.photos,
    shortBio: findById(textSections, manifest.shortBioId).content,
    longBio: resolveLongBio(manifest.longBio, aboutSections),
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
