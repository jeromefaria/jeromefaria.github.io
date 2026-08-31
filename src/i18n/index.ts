import type { App } from 'vue';
import { createI18n } from 'vue-i18n';
import type { Router } from 'vue-router';

import { DEFAULT_LOCALE, type Locale, localeFromMeta, messages } from './messages';
import { TRANSLATE_KEY } from './useT';

export const createAppI18n = (locale: Locale = DEFAULT_LOCALE) =>
  createI18n({
    legacy: false,
    locale,
    fallbackLocale: DEFAULT_LOCALE,
    messages,
  });

export const setupI18n = (app: App, router: Router): void => {
  const i18n = createAppI18n();
  app.use(i18n);
  app.provide(TRANSLATE_KEY, (key: string) => i18n.global.t(key));

  router.beforeEach(to => {
    i18n.global.locale.value = localeFromMeta(to.meta);
  });
};
