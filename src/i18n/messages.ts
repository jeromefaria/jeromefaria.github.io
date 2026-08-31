import type { RouteMeta } from 'vue-router';

export const SUPPORTED_LOCALES = ['en', 'pt'] as const;

export type Locale = (typeof SUPPORTED_LOCALES)[number];

export const DEFAULT_LOCALE: Locale = 'en';

export const localeFromMeta = (meta: RouteMeta): Locale =>
  SUPPORTED_LOCALES.includes(meta['locale'] as Locale) ? (meta['locale'] as Locale) : DEFAULT_LOCALE;

export const localePath = (path: string, locale: Locale): string => {
  if (locale === DEFAULT_LOCALE) return path;
  return path === '/' ? '/pt' : `/pt${path}`;
};

const en = {
  nav: {
    about: 'About',
    works: 'Works',
    live: 'Live',
    press: 'Press',
    contact: 'Contact',
  },
  footer: {
    privacy: 'Privacy',
    colophon: 'Colophon',
  },
  common: {
    switchLanguage: 'Português',
  },
  keyboardHelp: {
    title: 'Keyboard shortcuts',
    openPalette: 'Open the command palette',
    moveSelection: 'Move selection',
    moveSelectionVim: 'Move selection (Vim / fzf)',
    jumpHalfPage: 'Jump half a page',
    openCommand: 'Open the selected command',
    openNewTab: 'Open in a new tab',
    close: 'Close',
    showHelp: 'Show this help',
  },
};

const pt: typeof en = {
  nav: {
    about: 'Sobre',
    works: 'Obras',
    live: 'Concertos',
    press: 'Imprensa',
    contact: 'Contacto',
  },
  footer: {
    privacy: 'Privacidade',
    colophon: 'Colophon',
  },
  common: {
    switchLanguage: 'English',
  },
  keyboardHelp: {
    title: 'Atalhos de teclado',
    openPalette: 'Abrir a paleta de comandos',
    moveSelection: 'Mover a selecção',
    moveSelectionVim: 'Mover a selecção (Vim / fzf)',
    jumpHalfPage: 'Saltar meia página',
    openCommand: 'Abrir o comando seleccionado',
    openNewTab: 'Abrir num novo separador',
    close: 'Fechar',
    showHelp: 'Mostrar esta ajuda',
  },
};

export type MessageSchema = typeof en;

export const messages: Record<Locale, MessageSchema> = { en, pt };
