import { BCP47_LOCALE, DEFAULT_LOCALE, type Locale } from '@/i18n/messages';

const parseLocalDate = (isoDate: string): Date => new Date(`${isoDate}T00:00:00`);

export const formatEventDate = (isoDate: string, locale: Locale = DEFAULT_LOCALE): string => {
  if (!isoDate) return '';

  const date = parseLocalDate(isoDate);
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
  return date.toLocaleDateString(BCP47_LOCALE[locale], options);
};

export const formatEventDateRange = (isoStart: string, isoEnd?: string, locale: Locale = DEFAULT_LOCALE): string => {
  if (!isoEnd || isoEnd === isoStart) return formatEventDate(isoStart, locale);

  const start = parseLocalDate(isoStart);
  const end = parseLocalDate(isoEnd);
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };

  return new Intl.DateTimeFormat(BCP47_LOCALE[locale], options).formatRange(start, end);
};
