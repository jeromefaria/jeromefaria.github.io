import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const root = document.documentElement;
let systemListeners: Array<() => void>;
let themeColor: HTMLMetaElement;

const installMatchMedia = (matches: boolean): void => {
  window.matchMedia = ((query: string) => ({
    matches,
    media: query,
    onchange: null,
    addEventListener: (_: string, handler: () => void) => systemListeners.push(handler),
    removeEventListener: () => {},
    addListener: () => {},
    removeListener: () => {},
    dispatchEvent: () => true,
  })) as unknown as typeof window.matchMedia;
};

const load = (osPrefersDark = false): Promise<typeof import('./useTheme')> => {
  installMatchMedia(osPrefersDark);
  return import('./useTheme');
};

describe('useTheme', () => {
  beforeEach(() => {
    vi.resetModules();
    localStorage.clear();
    systemListeners = [];
    root.removeAttribute('data-theme');

    themeColor = document.createElement('meta');
    themeColor.setAttribute('name', 'theme-color');
    document.head.appendChild(themeColor);
  });

  afterEach(() => {
    themeColor.remove();
  });

  it('defaults to dark when nothing is stored', async () => {
    const { initTheme } = await load();
    initTheme();

    expect(root.getAttribute('data-theme')).toBe('dark');
    expect(themeColor.getAttribute('content')).toBe('#0a0a0a');
  });

  it('applies a stored light choice by clearing the attribute', async () => {
    localStorage.setItem('theme', 'light');
    const { initTheme } = await load();
    initTheme();

    expect(root.hasAttribute('data-theme')).toBe(false);
    expect(themeColor.getAttribute('content')).toBe('#ffffff');
  });

  it('falls back to dark for an unrecognised stored value', async () => {
    localStorage.setItem('theme', 'sepia');
    const { initTheme } = await load();
    initTheme();

    expect(root.getAttribute('data-theme')).toBe('dark');
  });

  it('toggles dark → light → dark and persists the choice', async () => {
    const { initTheme, toggleTheme } = await load();
    initTheme();

    toggleTheme();
    expect(root.hasAttribute('data-theme')).toBe(false);
    expect(localStorage.getItem('theme')).toBe('light');

    toggleTheme();
    expect(root.getAttribute('data-theme')).toBe('dark');
    expect(localStorage.getItem('theme')).toBe('dark');
  });

  it('matches the system theme and follows a live OS change', async () => {
    const { initTheme, matchSystemTheme } = await load(false);
    initTheme();

    matchSystemTheme();
    expect(localStorage.getItem('theme')).toBe('system');
    expect(root.hasAttribute('data-theme')).toBe(false);

    installMatchMedia(true);
    systemListeners.forEach(notify => notify());
    expect(root.getAttribute('data-theme')).toBe('dark');
  });

  it('ignores OS changes once an explicit choice is set', async () => {
    const { initTheme, toggleTheme } = await load(false);
    initTheme();
    toggleTheme();
    expect(root.hasAttribute('data-theme')).toBe(false);

    installMatchMedia(true);
    systemListeners.forEach(notify => notify());

    expect(root.hasAttribute('data-theme')).toBe(false);
  });

  it('falls back to dark when a stored choice cannot be read', async () => {
    // Stored 'light' would win via the normal path — asserting 'dark' proves the catch fired.
    localStorage.setItem('theme', 'light');
    const getItem = vi.spyOn(localStorage, 'getItem').mockImplementation(() => {
      throw new Error('blocked');
    });

    const { initTheme } = await load();
    initTheme();

    expect(root.getAttribute('data-theme')).toBe('dark');
    getItem.mockRestore();
  });

  it('still applies the choice when persistence fails', async () => {
    const setItem = vi.spyOn(localStorage, 'setItem').mockImplementation(() => {
      throw new Error('blocked');
    });

    const { initTheme, toggleTheme } = await load();
    initTheme();
    toggleTheme();

    expect(root.hasAttribute('data-theme')).toBe(false);
    setItem.mockRestore();
  });
});
