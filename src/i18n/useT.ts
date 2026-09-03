import { inject, type InjectionKey } from 'vue';

import { messages, type MessageSchema } from './messages';

export type TranslateParams = Record<string, string>;

export type TranslateFn = (key: string, params?: TranslateParams) => string;

export const TRANSLATE_KEY: InjectionKey<TranslateFn> = Symbol('translate');

const resolve = (key: string, source: Record<string, unknown>): string => {
  const value = key.split('.').reduce<unknown>((node, part) => (node as Record<string, unknown>)?.[part], source);
  return typeof value === 'string' ? value : key;
};

const interpolate = (template: string, params?: TranslateParams): string =>
  params ? template.replace(/\{(\w+)\}/g, (_match, name: string) => params[name] ?? `{${name}}`) : template;

// Provider-less fallback (used before the i18n provider is installed — e.g. in unit
// tests). Defaults to the eager English catalog so the app path never imports the
// lazy Portuguese one; a caller may pass another catalog explicitly. The live app
// injects i18n.global.t, which carries the active locale.
export const createTranslate = (catalog: MessageSchema = messages.en): TranslateFn =>
  (key, params) => interpolate(resolve(key, catalog), params);

export const useT = (): TranslateFn => inject(TRANSLATE_KEY, createTranslate());
