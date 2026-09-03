import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { audioPlayerEnabled } from '@/composables/useFeatureFlags';
import { getMediaElement, next, play, stop, usePlayer } from '@/composables/usePlayer';
import { createTranslate } from '@/i18n/useT';
import { routes } from '@/router';
import type { AudioTrack } from '@/types/audio';

import { buildCommands, playbackCommands, playReleaseCommands } from './commands';

const t = createTranslate('en');

const idsOf = (commands: ReturnType<typeof playbackCommands>): string[] => commands.map(command => command.id);

describe('buildCommands', () => {
  const commands = buildCommands(t, 'en');

  afterEach(() => {
    vi.restoreAllMocks();
    localStorage.clear();
    document.documentElement.removeAttribute('data-theme');
  });

  it('runs each action — downloads and socials open a tab, copy-email hits the clipboard', async () => {
    const open = vi.spyOn(window, 'open').mockReturnValue(null);
    const writeText = vi.fn();
    Object.defineProperty(navigator, 'clipboard', { value: { writeText }, configurable: true });

    for (const command of commands) {
      if (command.kind === 'action') await command.run();
    }

    expect(open).toHaveBeenCalled();
    expect(writeText).toHaveBeenCalledWith(expect.stringContaining('@'));
  });

  it('includes every top-level route as a navigate command', () => {
    const navTitles = commands.filter(command => command.kind === 'navigate').map(command => command.title);

    for (const title of ['Home', 'Works', 'Live', 'Press', 'About', 'Contact', 'Press Kit', 'Privacy', 'Colophon']) {
      expect(navTitles).toContain(title);
    }
  });

  it('deep-links works sections and individual releases', () => {
    const section = commands.find(command => command.id.startsWith('nav:works:'));
    expect(section?.kind === 'navigate' ? section.to : '').toMatch(/^\/works#section-/);

    const release = commands.find(command => command.kind === 'result' && command.group === 'Works');
    expect(release?.kind === 'result' ? release.to : '').toMatch(/^\/works#/);
  });

  it('creates result commands for live events and press quotes', () => {
    expect(commands.some(command => command.kind === 'result' && command.group === 'Live')).toBe(true);
    expect(commands.some(command => command.kind === 'result' && command.group === 'Press')).toBe(true);
  });

  it('indexes labels, catalog, credits, and collaborators for search', () => {
    const offear = commands.find(command => command.title === 'OFFEAR.EP');
    expect(offear?.keywords).toEqual(expect.arrayContaining(['Enough', 'Records', 'ENRMP040']));

    const hyphema = commands.find(command => command.title === 'Hyphema');
    expect(hyphema?.keywords).toEqual(expect.arrayContaining(['Victor', 'Martins']));

    const madeiradig = commands.find(command => command.id === 'live:madeiradig-2011');
    expect(madeiradig?.keywords).toEqual(expect.arrayContaining(['Taylor', 'Deupree']));
  });

  it('includes download, copy-email, and social actions', () => {
    const actionIds = commands.filter(command => command.kind === 'action').map(command => command.id);

    expect(actionIds).toContain('act:press-kit-pdf');
    expect(actionIds).toContain('act:copy-email');
    expect(actionIds).toContain('act:shortcuts');
    expect(actionIds).toContain('act:theme');
    expect(actionIds).toContain('act:theme-system');
    expect(actionIds.some(id => id.startsWith('act:social:'))).toBe(true);
  });

  it('adds a Bandcamp action for each release that has a Bandcamp URL', () => {
    const bandcamp = commands.filter(command => command.id.startsWith('act:bandcamp:'));

    expect(bandcamp.length).toBeGreaterThan(0);
    expect(bandcamp.every(command => command.title.includes('Bandcamp'))).toBe(true);
  });

  it('adds a SoundCloud action for each release that has a SoundCloud URL', () => {
    const soundcloud = commands.filter(command => command.id.startsWith('act:soundcloud:'));

    expect(soundcloud.length).toBeGreaterThan(0);
    expect(soundcloud.every(command => command.kind === 'action' && command.external)).toBe(true);
    expect(soundcloud.every(command => command.title.includes('SoundCloud'))).toBe(true);
  });

  it('gives every command a unique id', () => {
    const ids = commands.map(command => command.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  // Command targets and router routes are authored independently; a renamed or removed
  // route would leave a navigate/result command pointing at a dead path. Guard the seam.
  it('points every navigable command at a defined route', () => {
    const routePaths = new Set(routes.map(route => route.path));
    const targets = commands.flatMap(command =>
      command.kind === 'navigate' || command.kind === 'result' ? [command.to] : []);
    expect(targets.length).toBeGreaterThan(0);

    for (const target of targets) {
      const basePath = target.split('#')[0] || '/';
      expect(routePaths.has(basePath), `command target "${target}"`).toBe(true);
    }
  });

  it('localizes navigate titles and work sections to the requested locale', () => {
    const portuguese = buildCommands(createTranslate('pt'), 'pt');
    const navTitles = portuguese.filter(command => command.kind === 'navigate').map(command => command.title);

    expect(navTitles).toContain('Início');
    expect(navTitles).toContain('Obras');
    expect(portuguese.some(command => command.id.startsWith('nav:works:') && command.title.startsWith('Obras — '))).toBe(true);
  });
});

const twoTracks: AudioTrack[] = [
  { key: 'a', title: 'First movement', duration: 120 },
  { key: 'b', title: 'Second movement', duration: 90 },
];

describe('playbackCommands', () => {
  beforeEach(() => {
    HTMLMediaElement.prototype.play = vi.fn().mockResolvedValue(undefined);
    HTMLMediaElement.prototype.pause = vi.fn();
    HTMLMediaElement.prototype.load = vi.fn();
    stop();
  });

  afterEach(() => stop());

  it('is empty until a track is loaded', () => {
    expect(playbackCommands(t)).toEqual([]);
  });

  it('exposes transport that tracks the queue position and player state', async () => {
    await play(twoTracks);

    const atStart = playbackCommands(t);
    expect(idsOf(atStart)).toEqual(['play:toggle', 'play:next', 'play:expand', 'play:stop']);
    expect(atStart[0]?.subtitle).toBe('First movement');
    expect(atStart.every(command => command.kind === 'action' && command.transient)).toBe(true);

    getMediaElement().dispatchEvent(new Event('playing'));
    const toggle = playbackCommands(t)[0];
    if (toggle?.kind === 'action') await toggle.run();
    expect(HTMLMediaElement.prototype.pause).toHaveBeenCalled();

    await next();
    const atEnd = idsOf(playbackCommands(t));
    expect(atEnd).toContain('play:previous');
    expect(atEnd).not.toContain('play:next');
  });

  it('labels the toggle and expand controls from live state', async () => {
    const { expanded } = usePlayer();
    await play(twoTracks);
    const media = getMediaElement();

    const toggleTitle = (): string | undefined =>
      playbackCommands(t).find(command => command.id === 'play:toggle')?.title;

    media.dispatchEvent(new Event('playing'));
    expect(toggleTitle()).toBe('Pause');

    media.dispatchEvent(new Event('pause'));
    expect(toggleTitle()).toBe('Play');

    const expand = playbackCommands(t).find(command => command.id === 'play:expand');
    if (expand?.kind === 'action') await expand.run();
    expect(expanded.value).toBe(true);
    expect(playbackCommands(t).find(command => command.id === 'play:expand')?.title).toBe('Collapse player');
  });
});

describe('playReleaseCommands', () => {
  beforeEach(() => {
    HTMLMediaElement.prototype.play = vi.fn().mockResolvedValue(undefined);
    HTMLMediaElement.prototype.pause = vi.fn();
    HTMLMediaElement.prototype.load = vi.fn();
    audioPlayerEnabled.value = true;
    stop();
  });

  afterEach(() => {
    stop();
    audioPlayerEnabled.value = true;
  });

  it('offers a Play action for every streamable release, gated on the flag', () => {
    const commands = playReleaseCommands(t);

    expect(commands.length).toBeGreaterThan(0);
    expect(commands.every(command => command.id.startsWith('play:release:'))).toBe(true);
    expect(commands.every(command => command.title.startsWith("Play '"))).toBe(true);
    expect(commands.every(command => command.kind === 'action' && command.transient)).toBe(true);

    audioPlayerEnabled.value = false;
    expect(playReleaseCommands(t)).toEqual([]);
  });

  it('starts the chosen release when run', async () => {
    const { currentTrack } = usePlayer();
    const command = playReleaseCommands(t).find(entry => entry.id === 'play:release:2504');

    if (command?.kind === 'action') await command.run();
    expect(currentTrack.value).not.toBeNull();
  });
});
