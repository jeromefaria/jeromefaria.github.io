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

  if (locale !== DEFAULT_LOCALE) {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Intl.DateTimeFormat(BCP47_LOCALE[locale], options).formatRange(start, end);
  }

  if (start.getFullYear() !== end.getFullYear()) {
    return `${formatEventDate(isoStart, locale)} – ${formatEventDate(isoEnd, locale)}`;
  }

  if (start.getMonth() !== end.getMonth()) {
    const dayAndMonth: Intl.DateTimeFormatOptions = { month: 'long', day: 'numeric' };
    return `${start.toLocaleDateString(BCP47_LOCALE[locale], dayAndMonth)} – ${end.toLocaleDateString(BCP47_LOCALE[locale], dayAndMonth)}, ${start.getFullYear()}`;
  }

  const month = start.toLocaleDateString(BCP47_LOCALE[locale], { month: 'long' });
  return `${month} ${start.getDate()}–${end.getDate()}, ${start.getFullYear()}`;
};
