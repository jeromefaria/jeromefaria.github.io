import { DEFAULT_LOCALE, type Locale } from './messages';

// Place names spelled differently in Portuguese. Most cities and countries in
// the data are identical across both languages, so only the exonyms live here.
const PT_EXONYMS: Record<string, string> = {
  Lisbon: 'Lisboa',
  Spain: 'Espanha',
  France: 'França',
};

export const localizePlace = (name: string, locale: Locale): string =>
  locale === DEFAULT_LOCALE ? name : (PT_EXONYMS[name] ?? name);
