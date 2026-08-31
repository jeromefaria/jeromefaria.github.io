import { inject, type InjectionKey } from 'vue';

import { DEFAULT_LOCALE, messages } from './messages';

export type TranslateFn = (key: string) => string;

export const TRANSLATE_KEY: InjectionKey<TranslateFn> = Symbol('translate');

const resolve = (key: string, source: Record<string, unknown>): string => {
  const value = key.split('.').reduce<unknown>((node, part) => (node as Record<string, unknown>)?.[part], source);
  return typeof value === 'string' ? value : key;
};

const fallbackTranslate: TranslateFn = key => resolve(key, messages[DEFAULT_LOCALE]);

export const useT = (): TranslateFn => inject(TRANSLATE_KEY, fallbackTranslate);
