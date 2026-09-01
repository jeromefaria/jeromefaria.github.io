import { inject, type InjectionKey } from 'vue';

import { DEFAULT_LOCALE, type Locale, messages } from './messages';

export type TranslateParams = Record<string, string>;

export type TranslateFn = (key: string, params?: TranslateParams) => string;

export const TRANSLATE_KEY: InjectionKey<TranslateFn> = Symbol('translate');

const resolve = (key: string, source: Record<string, unknown>): string => {
  const value = key.split('.').reduce<unknown>((node, part) => (node as Record<string, unknown>)?.[part], source);
  return typeof value === 'string' ? value : key;
};

const interpolate = (template: string, params?: TranslateParams): string =>
  params ? template.replace(/\{(\w+)\}/g, (_match, name: string) => params[name] ?? `{${name}}`) : template;

export const createTranslate = (locale: Locale): TranslateFn =>
  (key, params) => interpolate(resolve(key, messages[locale]), params);

export const useT = (): TranslateFn => inject(TRANSLATE_KEY, createTranslate(DEFAULT_LOCALE));
