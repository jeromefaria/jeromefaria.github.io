import type { RouteMeta } from 'vue-router';

import { en, type MessageSchema } from './messagesEn';
import { pt } from './messagesPt';

export const SUPPORTED_LOCALES = ['en', 'pt'] as const;

export type Locale = (typeof SUPPORTED_LOCALES)[number];

export const DEFAULT_LOCALE: Locale = 'en';

export const BCP47_LOCALE: Record<Locale, string> = { en: 'en-GB', pt: 'pt-PT' };

export const localeFromMeta = (meta: RouteMeta): Locale =>
  SUPPORTED_LOCALES.includes(meta['locale'] as Locale) ? (meta['locale'] as Locale) : DEFAULT_LOCALE;

export const localePath = (path: string, locale: Locale): string => {
  if (locale === DEFAULT_LOCALE) return path;
  return path === '/' ? '/pt' : `/pt${path}`;
};

export const stripLocale = (path: string): string =>
  path === '/pt' || path.startsWith('/pt/') ? path.slice(3) || '/' : path;

export const localizeInternalLinks = (html: string, locale: Locale): string => {
  if (locale === DEFAULT_LOCALE) return html;
  return html.replace(/href="(\/[^/"][^"]*)"/g, (_match, path: string) => `href="${localePath(path, locale)}"`);
};

export type { MessageSchema };

export const messages: Record<Locale, MessageSchema> = { en, pt };
