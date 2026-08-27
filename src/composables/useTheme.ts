import type { Ref } from 'vue';
import { readonly, ref } from 'vue';

export type ThemeChoice = 'light' | 'dark' | 'system';

const STORAGE_KEY = 'theme';
const CHOICES: ThemeChoice[] = ['light', 'dark', 'system'];
const DARK_QUERY = '(prefers-color-scheme: dark)';

// Default is dark: a visitor with no stored choice, and any storage failure, lands on dark.
const choice = ref<ThemeChoice>('dark');
let mediaQuery: MediaQueryList | null = null;

const prefersDark = (): boolean => window.matchMedia(DARK_QUERY).matches;

const resolved = (): 'light' | 'dark' => {
  if (choice.value === 'system') return prefersDark() ? 'dark' : 'light';
  return choice.value;
};

const applyToDocument = (): void => {
  const root = document.documentElement;
  const theme = resolved();

  if (theme === 'dark') {
    root.setAttribute('data-theme', 'dark');
  } else {
    root.removeAttribute('data-theme');
  }

  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme === 'dark' ? '#0a0a0a' : '#ffffff');
};

const readStored = (): ThemeChoice => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY) as ThemeChoice | null;
    return stored && CHOICES.includes(stored) ? stored : 'dark';
  } catch {
    return 'dark';
  }
};

const persist = (value: ThemeChoice): void => {
  try {
    localStorage.setItem(STORAGE_KEY, value);
  } catch {
    // Storage can be unavailable (private mode) — the in-memory choice still applies.
  }
};

const onSystemChange = (): void => {
  if (choice.value === 'system') applyToDocument();
};

const watchSystem = (): void => {
  if (mediaQuery) return;

  mediaQuery = window.matchMedia(DARK_QUERY);
  mediaQuery.addEventListener('change', onSystemChange);
};

const setChoice = (value: ThemeChoice): void => {
  choice.value = value;
  persist(value);
  applyToDocument();
};

export const initTheme = (): void => {
  choice.value = readStored();
  applyToDocument();
  watchSystem();
};

export const toggleTheme = (): void => {
  setChoice(resolved() === 'dark' ? 'light' : 'dark');
};

export const matchSystemTheme = (): void => {
  setChoice('system');
};

export const useTheme = (): {
  choice: Readonly<Ref<ThemeChoice>>;
  toggleTheme: () => void;
  matchSystemTheme: () => void;
} => ({
  choice: readonly(choice),
  toggleTheme,
  matchSystemTheme,
});
