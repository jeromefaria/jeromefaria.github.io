import { afterEach, describe, expect, it, vi } from 'vitest';

import { buildCommands } from './commands';

describe('buildCommands', () => {
  const commands = buildCommands();

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

    for (const title of ['Home', 'Works', 'Live', 'Press', 'About', 'Contact', 'Press Kit', 'Privacy']) {
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

  it('gives every command a unique id', () => {
    const ids = commands.map(command => command.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});
