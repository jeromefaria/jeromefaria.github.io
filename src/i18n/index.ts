import type { App } from 'vue';
import { createI18n } from 'vue-i18n';

import { DEFAULT_LOCALE, type Locale, messages } from './messages';

export const createAppI18n = (locale: Locale = DEFAULT_LOCALE) =>
  createI18n({
    legacy: false,
    locale,
    fallbackLocale: DEFAULT_LOCALE,
    messages,
  });

export const installI18n = (app: App, locale: Locale = DEFAULT_LOCALE): void => {
  app.use(createAppI18n(locale));
};
