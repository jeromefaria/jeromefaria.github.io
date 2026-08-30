import { audioPlayerEnabled } from '@/composables/useFeatureFlags';
import { openKeyboardHelp } from '@/composables/useOverlays';
import { isActiveStatus, usePlayer } from '@/composables/usePlayer';
import { matchSystemTheme, toggleTheme } from '@/composables/useTheme';
import { liveEvents } from '@/data/live';
import { siteConfig, social } from '@/data/navigation';
import { worksData } from '@/data/works';
import type { ActionCommand, Command } from '@/types/command';
import type { LiveEvent } from '@/types/live';
import type { Release, ReleaseMeta } from '@/types/works';
import { epkPdfHref, epkRiderHref, epkZipHref } from '@/utils/epk';
import { openInNewTab } from '@/utils/openInNewTab';
import { canPlayRelease, playReleaseAt } from '@/utils/releasePermalink';
import { plainCredits } from '@/utils/renderCredits';
import { stripHtml } from '@/utils/stripHtml';

import { pressQuotes } from './press';

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

// Indexed word-by-word after stripping HTML, so a query matches discrete words, not raw markup like URLs.
const words = (text: string): string[] => stripHtml(text).split(' ').filter(Boolean);

const eventPeople = (event: LiveEvent): string[] => {
  const { setup } = event;
  const names: string[] = [];

  if (setup.kind === 'duo') names.push(setup.with.text);
  if (setup.kind === 'band') names.push(setup.band.text);
  if (setup.kind === 'project') names.push(setup.name.text, ...(setup.members ?? []).map(member => member.text));
  if (setup.kind === 'ensemble') names.push(setup.name, ...(setup.members ?? []).map(member => member.text));

  names.push(...(event.bill ?? []).flatMap(entry => (Array.isArray(entry) ? entry.map(member => member.text) : [entry.text])));
  names.push(...(event.images ?? []).map(image => image.photographer?.name ?? ''));
  names.push(...(event.posters ?? []).map(poster => poster.artist?.name ?? ''));

  return names.filter(Boolean);
};

// Engineering credits are skipped — they carry no in-page anchor (they link out or to a real entry).
const releaseCommands = (): Command[] =>
  Object.values(worksData).flatMap(section =>
    section.items.filter(release => release.meta.kind !== 'engineering').map((release): Command => ({
      kind: 'result',
      id: `works:${release.id}`,
      title: release.title,
      subtitle: section.title,
      keywords: words([section.title, String(release.meta.year), ...metaText(release.meta), ...(release.tracklist ?? []).map(track => track.title), ...(release.images ?? []).map(image => image.photographer?.name ?? ''), ...(release.contributors ?? []).map(contributor => contributor.name)].join(' ')),
      text: words([release.description ?? '', plainCredits(release.credits ?? '')].join(' ')),
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
    keywords: words([event.venue.name ?? '', event.venue.city ?? '', event.venue.country, event.date.slice(0, 4), ...eventPeople(event)].join(' ')),
    text: words(event.note ?? ''),
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
    text: words(quote.quote),
    group: 'Press',
    to: `/press#${quote.id}`,
  }));

const allReleases = (): Release[] => Object.values(worksData).flatMap(section => section.items);

const releaseLinkCommands = (platform: string, keyword: string, urlOf: (release: Release) => string | undefined): Command[] =>
  allReleases().flatMap(release => {
    const url = urlOf(release);
    if (!url) return [];

    return [{
      kind: 'action',
      id: `act:${keyword}:${release.id}`,
      title: `Open '${release.title}' on ${platform}`,
      keywords: [release.title, keyword, 'listen', 'play'],
      group: 'Actions',
      external: true,
      run: () => openInNewTab(url),
    } satisfies Command];
  });

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

  const bandcamp = releaseLinkCommands('Bandcamp', 'bandcamp', release => release.bandcampUrl);
  const soundcloud = releaseLinkCommands('SoundCloud', 'soundcloud', release => release.soundcloudUrl);

  return [...downloads, help, ...appearance, contact, ...socials, ...bandcamp, ...soundcloud];
};

// Empty when no track is loaded; merged in reactively by useCommandPalette, not the static registry.
export const playbackCommands = (): Command[] => {
  const { currentTrack, status, hasNext, hasPrevious, expanded, toggle, next, previous, expand, collapse, stop } = usePlayer();
  const track = currentTrack.value;
  if (!track) return [];

  const control = (fields: Pick<ActionCommand, 'id' | 'title' | 'keywords' | 'run'> & { subtitle?: string }): Command => ({
    kind: 'action',
    group: 'Now Playing',
    transient: true,
    ...fields,
  });

  const commands: Command[] = [
    control({ id: 'play:toggle', title: isActiveStatus(status.value) ? 'Pause' : 'Play', subtitle: track.title, keywords: ['pause', 'play', 'resume', 'music', 'audio', 'playback'], run: () => toggle() }),
  ];

  if (hasNext.value) {
    commands.push(control({ id: 'play:next', title: 'Next track', keywords: ['next', 'skip', 'forward'], run: () => void next() }));
  }
  if (hasPrevious.value) {
    commands.push(control({ id: 'play:previous', title: 'Previous track', keywords: ['previous', 'back', 'prev'], run: () => void previous() }));
  }

  commands.push(control({ id: 'play:expand', title: expanded.value ? 'Collapse player' : 'Expand player', keywords: ['expand', 'collapse', 'now playing', 'minimise', 'minimize'], run: () => (expanded.value ? collapse() : expand()) }));
  commands.push(control({ id: 'play:stop', title: 'Stop playback', keywords: ['stop', 'close', 'dismiss', 'end'], run: () => stop() }));

  return commands;
};

export const playReleaseCommands = (): Command[] => {
  if (!audioPlayerEnabled.value) return [];

  return allReleases()
    .filter(release => canPlayRelease(release.id))
    .map((release): Command => ({
      kind: 'action',
      id: `play:release:${release.id}`,
      title: `Play '${release.title}'`,
      keywords: [release.title, 'play', 'listen', 'audio', 'music'],
      group: 'Actions',
      transient: true,
      run: () => playReleaseAt(release),
    }));
};

export const buildCommands = (): Command[] => [
  ...routeCommands(),
  ...sectionCommands(),
  ...releaseCommands(),
  ...liveCommands(),
  ...pressCommands(),
  ...actionCommands(),
];
