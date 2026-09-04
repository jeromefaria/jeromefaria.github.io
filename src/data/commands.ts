import { audioPlayerEnabled } from '@/composables/useFeatureFlags';
import { openKeyboardHelp } from '@/composables/useOverlays';
import { isActiveStatus, usePlayer } from '@/composables/usePlayer';
import { matchSystemTheme, toggleTheme } from '@/composables/useTheme';
import { liveEvents } from '@/data/live';
import { siteConfig, social } from '@/data/navigation';
import { worksData } from '@/data/works';
import { localize } from '@/i18n/localized';
import type { Locale } from '@/i18n/messages';
import type { TranslateFn } from '@/i18n/useT';
import type { ActionCommand, Command } from '@/types/command';
import type { LiveEvent } from '@/types/live';
import type { CommissionMeta, Edition, Release, ReleaseMeta } from '@/types/works';
import { epkPdfHref, epkRiderHref, epkZipHref } from '@/utils/epk';
import { openInNewTab } from '@/utils/openInNewTab';
import { canPlayRelease, playReleaseAt } from '@/utils/releasePermalink';
import { plainCredits } from '@/utils/renderCredits';
import { stripHtml } from '@/utils/stripHtml';

import { pressQuotes } from './press';

const words = (text: string): string[] => stripHtml(text).split(' ').filter(Boolean);

const routeCommands = (t: TranslateFn): Command[] => [
  { kind: 'navigate', id: 'nav:home', title: t('palette.home'), keywords: words(t('palette.kw.home')), group: 'Navigate', to: '/' },
  { kind: 'navigate', id: 'nav:works', title: t('nav.works'), keywords: words(t('palette.kw.works')), group: 'Navigate', to: '/works' },
  { kind: 'navigate', id: 'nav:live', title: t('nav.live'), keywords: words(t('palette.kw.live')), group: 'Navigate', to: '/live' },
  { kind: 'navigate', id: 'nav:press', title: t('nav.press'), keywords: words(t('palette.kw.press')), group: 'Navigate', to: '/press' },
  { kind: 'navigate', id: 'nav:about', title: t('nav.about'), keywords: words(t('palette.kw.about')), group: 'Navigate', to: '/about' },
  { kind: 'navigate', id: 'nav:contact', title: t('nav.contact'), keywords: words(t('palette.kw.contact')), group: 'Navigate', to: '/contact' },
  { kind: 'navigate', id: 'nav:epk', title: t('palette.pressKit'), keywords: words(t('palette.kw.pressKit')), group: 'Navigate', to: '/epk' },
  { kind: 'navigate', id: 'nav:privacy', title: t('footer.privacy'), keywords: words(t('palette.kw.privacy')), group: 'Navigate', to: '/privacy' },
  { kind: 'navigate', id: 'nav:colophon', title: t('footer.colophon'), keywords: words(t('palette.kw.colophon')), group: 'Navigate', to: '/colophon' },
];

const sectionCommands = (t: TranslateFn, locale: Locale): Command[] =>
  Object.entries(worksData).map(([key, section]): Command => ({
    kind: 'navigate',
    id: `nav:works:${key}`,
    title: t('palette.worksSection', { title: localize(section.title, locale) }),
    keywords: [localize(section.title, locale), ...words(t('palette.kw.worksSection'))],
    group: 'Navigate',
    to: `/works#section-${section.id}`,
  }));

const editionKeywords = (editions: Edition[]): string[] =>
  editions.flatMap(edition => [edition.label.text, edition.catalog ?? '']);

const commissionKeywords = (meta: CommissionMeta): string[] => {
  switch (meta.work) {
    case 'Film':
      return [meta.director.text];
    case 'Theatre':
      return [meta.venue.text];
    case 'DVD':
      return [meta.publisher.label.text];
    case 'Live Score':
      return [];
  }
};

const metaKeywords = (meta: ReleaseMeta): string[] => {
  switch (meta.kind) {
    case 'music':
      return editionKeywords(meta.editions);
    case 'compilation':
      return [...(meta.collaborators ?? []), meta.compilation.text, ...editionKeywords(meta.editions)];
    case 'engineering':
      return [...editionKeywords(meta.editions), ...(meta.artist ? [meta.artist.name] : [])];
    case 'commission':
      return commissionKeywords(meta);
    case 'publication':
      return [meta.publisher.text];
  }
};

const metaText = (meta: ReleaseMeta): string[] => metaKeywords(meta).filter(Boolean);

const eventPeople = (event: LiveEvent, locale: Locale): string[] => {
  const { setup } = event;
  const names: string[] = [];

  if (setup.kind === 'duo') names.push(setup.with.text);
  if (setup.kind === 'band') names.push(setup.band.text);
  if (setup.kind === 'project') names.push(setup.name.text, ...(setup.members ?? []).map(member => member.text));
  if (setup.kind === 'ensemble') names.push(localize(setup.name, locale), ...(setup.members ?? []).map(member => member.text));

  names.push(...(event.bill ?? []).flatMap(entry => (Array.isArray(entry) ? entry.map(member => member.text) : [entry.text])));
  names.push(...(event.images ?? []).map(image => image.photographer?.name ?? ''));
  names.push(...(event.posters ?? []).map(poster => poster.artist?.name ?? ''));

  return names.filter(Boolean);
};

const releaseCommands = (locale: Locale): Command[] =>
  Object.values(worksData).flatMap(section =>
    section.items.filter(release => release.meta.kind !== 'engineering').map((release): Command => ({
      kind: 'result',
      id: `works:${release.id}`,
      title: release.title,
      subtitle: localize(section.title, locale),
      keywords: words([localize(section.title, locale), String(release.meta.year), ...metaText(release.meta), ...(release.tracklist ?? []).map(track => track.title), ...(release.images ?? []).map(image => image.photographer?.name ?? ''), ...(release.contributors ?? []).map(contributor => contributor.name)].join(' ')),
      text: words([localize(release.description ?? '', locale), plainCredits(release.credits ?? '', locale)].join(' ')),
      group: 'Works',
      to: `/works#${release.id}`,
    })),
  );

const liveCommands = (locale: Locale): Command[] =>
  liveEvents.map((event): Command => ({
    kind: 'result',
    id: `live:${event.id}`,
    title: localize(event.title, locale),
    subtitle: event.venue.name ?? event.venue.city ?? event.venue.country,
    keywords: words([event.venue.name ?? '', event.venue.city ?? '', event.venue.country, event.date.slice(0, 4), ...eventPeople(event, locale)].join(' ')),
    text: words(localize(event.note ?? '', locale)),
    group: 'Live',
    to: `/live#${event.id}`,
  }));

const pressCommands = (t: TranslateFn, locale: Locale): Command[] =>
  pressQuotes.map((quote): Command => ({
    kind: 'result',
    id: `press:${quote.id}`,
    title: quote.source,
    subtitle: t('nav.press'),
    keywords: words(t('palette.kw.pressQuote')),
    text: words(localize(quote.quote, locale)),
    group: 'Press',
    to: `/press#${quote.id}`,
  }));

const allReleases = (): Release[] => Object.values(worksData).flatMap(section => section.items);

const releaseLinkCommands = (t: TranslateFn, platform: string, keyword: string, urlOf: (release: Release) => string | undefined): Command[] =>
  allReleases().flatMap(release => {
    const url = urlOf(release);
    if (!url) return [];

    return [{
      kind: 'action',
      id: `act:${keyword}:${release.id}`,
      title: t('palette.openOnPlatform', { title: release.title, platform }),
      keywords: [release.title, keyword, ...words(t('palette.kw.releaseLink'))],
      group: 'Actions',
      external: true,
      run: () => openInNewTab(url),
    } satisfies Command];
  });

const actionCommands = (t: TranslateFn): Command[] => {
  const downloads: Command[] = [
    { kind: 'action', id: 'act:press-kit-pdf', title: t('palette.downloadKitPdf'), keywords: words(t('palette.kw.downloadKitPdf')), group: 'Actions', external: true, run: () => openInNewTab(epkPdfHref()) },
    { kind: 'action', id: 'act:rider-pdf', title: t('palette.downloadRiderPdf'), keywords: words(t('palette.kw.downloadRiderPdf')), group: 'Actions', external: true, run: () => openInNewTab(epkRiderHref()) },
    { kind: 'action', id: 'act:press-kit-zip', title: t('palette.downloadKitZip'), keywords: words(t('palette.kw.downloadKitZip')), group: 'Actions', external: true, run: () => openInNewTab(epkZipHref()) },
  ];

  const help: Command = {
    kind: 'action',
    id: 'act:shortcuts',
    title: t('keyboardHelp.title'),
    keywords: words(t('palette.kw.shortcuts')),
    group: 'Actions',
    run: () => openKeyboardHelp(),
  };

  const appearance: Command[] = [
    { kind: 'action', id: 'act:theme', title: t('palette.toggleTheme'), keywords: words(t('palette.kw.toggleTheme')), group: 'Actions', run: () => toggleTheme() },
    { kind: 'action', id: 'act:theme-system', title: t('palette.matchSystemTheme'), keywords: words(t('palette.kw.matchSystemTheme')), group: 'Actions', run: () => matchSystemTheme() },
  ];

  const contact: Command = {
    kind: 'action',
    id: 'act:copy-email',
    title: t('palette.copyEmail'),
    keywords: words(t('palette.kw.copyEmail')),
    group: 'Actions',
    run: () => { void navigator.clipboard?.writeText(siteConfig.author.email); },
  };

  const socials: Command[] = social.map((link): Command => ({
    kind: 'action',
    id: `act:social:${link.name}`,
    title: t('palette.openSocial', { name: `${link.name.charAt(0).toUpperCase()}${link.name.slice(1)}` }),
    keywords: [link.name, ...words(t('palette.kw.social'))],
    group: 'Actions',
    external: true,
    run: () => openInNewTab(link.url),
  }));

  const bandcamp = releaseLinkCommands(t, 'Bandcamp', 'bandcamp', release => release.bandcampUrl);
  const soundcloud = releaseLinkCommands(t, 'SoundCloud', 'soundcloud', release => release.soundcloudUrl);

  return [...downloads, help, ...appearance, contact, ...socials, ...bandcamp, ...soundcloud];
};

export const playbackCommands = (t: TranslateFn): Command[] => {
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
    control({ id: 'play:toggle', title: isActiveStatus(status.value) ? t('palette.pause') : t('palette.play'), subtitle: track.title, keywords: words(t('palette.kw.playToggle')), run: () => toggle() }),
  ];

  if (hasNext.value) {
    commands.push(control({ id: 'play:next', title: t('palette.nextTrack'), keywords: words(t('palette.kw.nextTrack')), run: () => void next() }));
  }
  if (hasPrevious.value) {
    commands.push(control({ id: 'play:previous', title: t('palette.previousTrack'), keywords: words(t('palette.kw.previousTrack')), run: () => void previous() }));
  }

  commands.push(control({ id: 'play:expand', title: expanded.value ? t('palette.collapsePlayer') : t('palette.expandPlayer'), keywords: words(t('palette.kw.player')), run: () => (expanded.value ? collapse() : expand()) }));
  commands.push(control({ id: 'play:stop', title: t('palette.stopPlayback'), keywords: words(t('palette.kw.stopPlayback')), run: () => stop() }));

  return commands;
};

export const playReleaseCommands = (t: TranslateFn): Command[] => {
  if (!audioPlayerEnabled.value) return [];

  return allReleases()
    .filter(release => canPlayRelease(release.id))
    .map((release): Command => ({
      kind: 'action',
      id: `play:release:${release.id}`,
      title: t('palette.playRelease', { title: release.title }),
      keywords: [release.title, ...words(t('palette.kw.playRelease'))],
      group: 'Actions',
      transient: true,
      run: () => playReleaseAt(release),
    }));
};

export const buildCommands = (t: TranslateFn, locale: Locale): Command[] => [
  ...routeCommands(t),
  ...sectionCommands(t, locale),
  ...releaseCommands(locale),
  ...liveCommands(locale),
  ...pressCommands(t, locale),
  ...actionCommands(t),
];
