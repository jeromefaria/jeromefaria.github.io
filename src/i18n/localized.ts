import { type Locale } from './messages';
import { useLocale } from './useLocale';

export type Localized<T> = { en: T; pt: T };

export const isLocalized = <T>(value: unknown): value is Localized<T> =>
  typeof value === 'object' && value !== null && 'en' in value && 'pt' in value;

export const localize = <T>(value: T | Localized<T>, locale: Locale): T =>
  (isLocalized<T>(value) ? value[locale] : value);

export const useLocalized = (): (<T>(value: T | Localized<T>) => T) => {
  const { current } = useLocale();
  return value => localize(value, current.value);
};
