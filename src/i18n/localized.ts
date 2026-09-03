import { type Locale } from './messages';
import { type UseLocale, useLocale } from './useLocale';

export type Localized<T> = { en: T; pt: T };
export type Localizable<T> = T | Localized<T>;

export const isLocalized = <T>(value: unknown): value is Localized<T> =>
  typeof value === 'object' && value !== null && 'en' in value && 'pt' in value;

export const localize = <T>(value: Localizable<T>, locale: Locale): T =>
  (isLocalized<T>(value) ? value[locale] : value);

export const useLocalized = (): UseLocale & { localize: <T>(value: Localizable<T>) => T } => {
  const locale = useLocale();
  return { ...locale, localize: <T>(value: Localizable<T>): T => localize(value, locale.current.value) };
};
