import { openKeyboardHelp } from '@/composables/useOverlays';
import { matchSystemTheme, toggleTheme } from '@/composables/useTheme';
import { liveEvents } from '@/data/live';
import { siteConfig, social } from '@/data/navigation';
import { worksData } from '@/data/works';
import type { Command } from '@/types/command';
import type { LiveEvent } from '@/types/live';
import type { ReleaseMeta } from '@/types/works';
import { epkPdfHref, epkRiderHref, epkZipHref } from '@/utils/epk';
import { openInNewTab } from '@/utils/openInNewTab';

import { pressQuotes } from './press';

// Authored (not router-derived) so each has a title + keywords, incl. routes not in the nav.
const routeCommands = (): Command[] => [
  { kind: 'navigate', id: 'nav:home', title: 'Home', keywords: ['start', 'index'], group: 'Navigate', to: '/' },
  { kind: 'navigate', id: 'nav:works', title: 'Works', keywords: ['discography', 'releases', 'music', 'albums'], group: 'Navigate', to: '/works' },
  { kind: 'navigate', id: 'nav:live', title: 'Live', keywords: ['shows', 'concerts', 'performances', 'gigs'], group: 'Navigate', to: '/live' },
  { kind: 'navigate', id: 'nav:press', title: 'Press', keywords: ['quotes', 'reviews', 'reception'], group: 'Navigate', to: '/press' },
  { kind: 'navigate', id: 'nav:about', title: 'About', keywords: ['bio', 'biography'], group: 'Navigate', to: '/about' },
  { kind: 'navigate', id: 'nav:contact', title: 'Contact', keywords: ['email', 'message', 'reach', 'booking'], group: 'Navigate', to: '/contact' },
  { kind: 'navigate', id: 'nav:epk', title: 'Press Kit', keywords: ['epk', 'downloads', 'photos'], group: 'Navigate', to: '/epk' },
  { kind: 'navigate', id: 'nav:privacy', title: 'Privacy', keywords: ['policy', 'data'], group: 'Navigate', to: '/privacy' },
];

const sectionCommands = (): Command[] => [
  ...Object.entries(worksData).map(([key, section]): Command => ({
    kind: 'navigate',
    id: `nav:works:${key}`,
    title: `Works — ${section.title}`,
    keywords: [section.title, 'works'],
    group: 'Navigate',
    to: `/works#section-${section.id}`,
  })),
];

// Every named entity attached to a release's metadata — labels, catalog numbers,
// collaborators, compilation, publisher, director, venue, mastered artist.
const metaText = (meta: ReleaseMeta): string[] => {
  const out: string[] = [];

  if ('editions' in meta) for (const edition of meta.editions) out.push(edition.label.text, edition.catalog ?? '');
  if ('collaborators' in meta && meta.collaborators) out.push(...meta.collaborators);
  if ('compilation' in meta) out.push(meta.compilation.text);
  if ('publisher' in meta) out.push('label' in meta.publisher ? meta.publisher.label.text : meta.publisher.text);
  if ('director' in meta) out.push(meta.director.text);
  if ('venue' in meta) out.push(meta.venue.text);
  if ('artist' in meta) out.push(meta.artist.name);

  return out.filter(Boolean);
};

// Every field is indexed word-by-word after stripping HTML, so a query matches a discrete
// word rather than scattering across a passage or raw markup (e.g. URLs inside a note).
const stripHtml = (html?: string): string => (html ?? '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
const words = (text: string): string[] => stripHtml(text).split(' ').filter(Boolean);

// Everyone attached to a show — collaborators, the rest of the bill, photographers, poster artists.
const eventPeople = (event: LiveEvent): string[] => {
  const { setup } = event;
  const names: string[] = [];

  if (setup.kind === 'duo') names.push(setup.with.text);
  if (setup.kind === 'band') names.push(setup.band.text);
  if (setup.kind === 'project') names.push(setup.name.text, ...(setup.members ?? []).map(member => member.text));
  if (setup.kind === 'ensemble') names.push(setup.name, ...(setup.members ?? []).map(member => member.text));

  names.push(...(event.bill ?? []).map(act => act.text));
  names.push(...(event.images ?? []).map(image => image.photographer?.name ?? ''));
  names.push(...(event.posters ?? []).map(poster => poster.artist?.name ?? ''));

  return names.filter(Boolean);
};

// Each release deep-links to its entry; the accordion opens the owning section.
const releaseCommands = (): Command[] =>
  Object.values(worksData).flatMap(section =>
    section.items.map((release): Command => ({
      kind: 'result',
      id: `works:${release.id}`,
      title: release.title,
      subtitle: section.title,
      keywords: words([section.title, String(release.meta.year), ...metaText(release.meta), ...(release.tracklist ?? []).map(track => track.title), ...(release.images ?? []).map(image => image.photographer?.name ?? ''), release.description ?? '', release.credits ?? ''].join(' ')),
      group: 'Works',
      to: `/works#${release.id}`,
    })),
  );

const liveCommands = (): Command[] =>
  liveEvents.map((event): Command => ({
    kind: 'result',
    id: `live:${event.id}`,
    title: event.title,
    subtitle: event.venue.name ?? event.venue.city ?? event.venue.country,
    keywords: words([event.venue.name ?? '', event.venue.city ?? '', event.venue.country, event.date.slice(0, 4), event.note ?? '', ...eventPeople(event)].join(' ')),
    group: 'Live',
    to: `/live#${event.id}`,
  }));

const pressCommands = (): Command[] =>
  pressQuotes.map((quote): Command => ({
    kind: 'result',
    id: `press:${quote.id}`,
    title: quote.source,
    subtitle: 'Press',
    keywords: words(['press', 'review', 'quote', quote.quote].join(' ')),
    group: 'Press',
    to: `/press#${quote.id}`,
  }));

const actionCommands = (): Command[] => {
  const downloads: Command[] = [
    { kind: 'action', id: 'act:press-kit-pdf', title: 'Download press kit (PDF)', keywords: ['epk', 'pdf', 'press'], group: 'Actions', external: true, run: () => openInNewTab(epkPdfHref) },
    { kind: 'action', id: 'act:rider-pdf', title: 'Download technical rider (PDF)', keywords: ['rider', 'tech', 'pdf', 'stage'], group: 'Actions', external: true, run: () => openInNewTab(epkRiderHref) },
    { kind: 'action', id: 'act:press-kit-zip', title: 'Download press kit (ZIP)', keywords: ['epk', 'zip', 'photos', 'assets'], group: 'Actions', external: true, run: () => openInNewTab(epkZipHref) },
  ];

  const help: Command = {
    kind: 'action',
    id: 'act:shortcuts',
    title: 'Keyboard shortcuts',
    keywords: ['help', 'keys', 'bindings', 'cheatsheet'],
    group: 'Actions',
    run: () => openKeyboardHelp(),
  };

  const appearance: Command[] = [
    { kind: 'action', id: 'act:theme', title: 'Toggle theme', keywords: ['dark', 'light', 'mode', 'appearance', 'colour', 'color'], group: 'Actions', run: () => toggleTheme() },
    { kind: 'action', id: 'act:theme-system', title: 'Match system theme', keywords: ['system', 'os', 'auto', 'preference', 'appearance', 'theme'], group: 'Actions', run: () => matchSystemTheme() },
  ];

  const contact: Command = {
    kind: 'action',
    id: 'act:copy-email',
    title: 'Copy contact email',
    keywords: ['email', 'clipboard', 'contact'],
    group: 'Actions',
    run: () => { void navigator.clipboard?.writeText(siteConfig.author.email); },
  };

  const socials: Command[] = social.map((link): Command => ({
    kind: 'action',
    id: `act:social:${link.name}`,
    title: `Open ${link.name.charAt(0).toUpperCase()}${link.name.slice(1)}`,
    keywords: [link.name, 'social', 'link'],
    group: 'Actions',
    external: true,
    run: () => openInNewTab(link.url),
  }));

  const bandcamp: Command[] = Object.values(worksData)
    .flatMap(section => section.items)
    .flatMap(release => {
      const url = release.bandcampUrl;
      if (!url) return [];

      return [{
        kind: 'action',
        id: `act:bandcamp:${release.id}`,
        title: `Open '${release.title}' on Bandcamp`,
        keywords: [release.title, 'bandcamp', 'listen', 'play'],
        group: 'Actions',
        external: true,
        run: () => openInNewTab(url),
      } satisfies Command];
    });

  return [...downloads, help, ...appearance, contact, ...socials, ...bandcamp];
};

export const buildCommands = (): Command[] => [
  ...routeCommands(),
  ...sectionCommands(),
  ...releaseCommands(),
  ...liveCommands(),
  ...pressCommands(),
  ...actionCommands(),
];
