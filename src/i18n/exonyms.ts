import { DEFAULT_LOCALE, type Locale } from './messages';

const PT_EXONYMS: Record<string, string> = {
  Lisbon: 'Lisboa',
  Spain: 'Espanha',
  France: 'França',
};

export const localizePlace = (name: string, locale: Locale): string =>
  locale === DEFAULT_LOCALE ? name : (PT_EXONYMS[name] ?? name);
