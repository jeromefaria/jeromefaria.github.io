import type { App } from 'vue';
import { createI18n } from 'vue-i18n';
import type { RouteMeta, Router } from 'vue-router';

import { DEFAULT_LOCALE, type Locale, messages, SUPPORTED_LOCALES } from './messages';

export const createAppI18n = (locale: Locale = DEFAULT_LOCALE) =>
  createI18n({
    legacy: false,
    locale,
    fallbackLocale: DEFAULT_LOCALE,
    messages,
  });

export const localeFromMeta = (meta: RouteMeta): Locale =>
  SUPPORTED_LOCALES.includes(meta['locale'] as Locale) ? (meta['locale'] as Locale) : DEFAULT_LOCALE;

export const setupI18n = (app: App, router: Router): void => {
  const i18n = createAppI18n();
  app.use(i18n);

  router.beforeEach(to => {
    i18n.global.locale.value = localeFromMeta(to.meta);
  });
};
