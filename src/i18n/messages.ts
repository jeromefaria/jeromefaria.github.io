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
};

export type MessageSchema = typeof en;

export const messages: Record<Locale, MessageSchema> = { en, pt };
