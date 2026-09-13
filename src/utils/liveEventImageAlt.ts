import { orgs } from '@/data/orgs';
import { venues } from '@/data/venues';
import { localizePlace } from '@/i18n/exonyms';
import { localize } from '@/i18n/localized';
import { DEFAULT_LOCALE, type Locale } from '@/i18n/messages';
import { ptContract, type PtGrammar } from '@/i18n/ptGrammar';
import type { EventVenue, LiveAltLocation, LiveEvent } from '@/types/live';
import { createNameLookup } from '@/utils/registry';

const PERFORMER = 'Jerome Faria';

interface Phrases {
  solo: string;
  duo: (withAct: string) => string;
  project: (name: string) => string;
  band: (band: string) => string;
  theatre: (title: string) => string;
}

const PHRASES: Record<Locale, Phrases> = {
  en: {
    solo: `${PERFORMER} performing`,
    duo: withAct => `${PERFORMER} and ${withAct} performing`,
    project: name => `${name} performing`,
    band: band => `${PERFORMER} performing with ${band}`,
    theatre: title => `${title} theatre production`,
  },
  pt: {
    solo: `${PERFORMER} a actuar`,
    duo: withAct => `${PERFORMER} e ${withAct} a actuar`,
    project: name => `${name} a actuar`,
    band: band => `${PERFORMER} a actuar com ${band}`,
    theatre: title => `Produção teatral ${title}`,
  },
};

const findVenue = createNameLookup(venues);

const normalizeName = (value: string): string =>
  value
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .replace(/\s*#\d+\s*$/, '')
    .replace(/[^a-z0-9]/g, '');

const orgByNormalizedName = new Map(Object.values(orgs).map(org => [normalizeName(org.name), org] as const));

interface Anchor {
  label: string;
  grammar: PtGrammar | undefined;
}

const titleAnchor = (event: LiveEvent, locale: Locale, altLocation?: LiveAltLocation): Anchor => {
  const rawTitle = localize(event.title, locale);
  const org = orgByNormalizedName.get(normalizeName(rawTitle));

  return {
    label: localize(altLocation?.label ?? org?.label ?? rawTitle, locale),
    grammar: altLocation?.grammar ?? org?.pt,
  };
};

const venueAnchor = (venue: EventVenue, locale: Locale, altLocation?: LiveAltLocation): Anchor => {
  const entity = venue.name ? findVenue(venue.name) : undefined;

  return {
    label: localize(entity?.label ?? venue.name ?? '', locale),
    grammar: altLocation?.grammar ?? entity?.pt,
  };
};

const subjectFor = (event: LiveEvent, locale: Locale, titleLabel: string, altLocation?: LiveAltLocation): string => {
  if (altLocation?.subject) return localize(altLocation.subject, locale);

  const phrases = PHRASES[locale];
  const { format, setup } = event;

  if (format?.kind === 'theatre') return phrases.theatre(titleLabel);
  if (format?.kind === 'filmScore') return phrases.solo;

  switch (setup.kind) {
    case 'solo':
      return phrases.solo;
    case 'duo':
      return phrases.duo(setup.with.text);
    case 'project':
      return phrases.project(setup.name.text);
    case 'band':
      return phrases.band(setup.band.text);
    case 'ensemble':
      return localize(setup.name, locale);
  }
};

const tailFor = (event: LiveEvent, locale: Locale, venueLabel?: string): string => {
  const place = localizePlace(event.venue.city ?? event.venue.country, locale);
  const year = event.date.slice(0, 4);
  const prefix = venueLabel ? `${venueLabel}, ` : '';

  return `, ${prefix}${place}, ${year}`;
};

export const liveEventImageAlt = (event: LiveEvent, locale: Locale = DEFAULT_LOCALE): string => {
  const { altLocation, format, setup, venue } = event;
  const onVenue = altLocation?.onVenue ?? (setup.kind === 'band' || format?.kind === 'theatre');

  const title = titleAnchor(event, locale, altLocation);
  const place = venueAnchor(venue, locale, altLocation);
  const anchor = onVenue ? place : title;

  const subject = subjectFor(event, locale, title.label, altLocation);
  const connector = locale === 'en' ? 'at' : ptContract('em', anchor.grammar);
  const tail = tailFor(event, locale, onVenue ? undefined : place.label);

  return `${subject} ${connector} ${anchor.label}${tail}`;
};
