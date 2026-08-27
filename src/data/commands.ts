import { openKeyboardHelp } from '@/composables/useOverlays';
import { liveEvents } from '@/data/live';
import { siteConfig, social } from '@/data/navigation';
import { worksData } from '@/data/works';
import type { Command } from '@/types/command';
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

// Each release deep-links to its entry; the accordion opens the owning section.
const releaseCommands = (): Command[] =>
  Object.values(worksData).flatMap(section =>
    section.items.map((release): Command => ({
      kind: 'result',
      id: `works:${release.id}`,
      title: release.title,
      subtitle: section.title,
      keywords: [section.title, String(release.meta.year)],
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
    keywords: [event.venue.city ?? '', event.venue.country, event.date.slice(0, 4)].filter(Boolean),
    group: 'Live',
    to: `/live#${event.id}`,
  }));

const pressCommands = (): Command[] =>
  pressQuotes.map((quote): Command => ({
    kind: 'result',
    id: `press:${quote.id}`,
    title: quote.source,
    subtitle: 'Press',
    keywords: ['press', 'review', 'quote'],
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

  return [...downloads, help, contact, ...socials, ...bandcamp];
};

export const buildCommands = (): Command[] => [
  ...routeCommands(),
  ...sectionCommands(),
  ...releaseCommands(),
  ...liveCommands(),
  ...pressCommands(),
  ...actionCommands(),
];
