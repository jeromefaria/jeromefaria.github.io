export const SUPPORTED_LOCALES = ['en', 'pt'] as const;

export type Locale = (typeof SUPPORTED_LOCALES)[number];

export const DEFAULT_LOCALE: Locale = 'en';

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
};

const pt: typeof en = {
  nav: {
    about: 'Sobre',
    works: 'Obras',
    live: 'Ao Vivo',
    press: 'Imprensa',
    contact: 'Contacto',
  },
  footer: {
    privacy: 'Privacidade',
    colophon: 'Cólofon',
  },
};

export type MessageSchema = typeof en;

export const messages: Record<Locale, MessageSchema> = { en, pt };
