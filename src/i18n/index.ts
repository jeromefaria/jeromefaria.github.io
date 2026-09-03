import type { App } from 'vue';
import { createI18n } from 'vue-i18n';
import type { Router } from 'vue-router';

import { DEFAULT_LOCALE, loadLocaleMessages, type Locale, localeFromMeta, messages, type MessageSchema } from './messages';
import { TRANSLATE_KEY } from './useT';

type AppI18n = ReturnType<typeof createAppI18n>;

export const createAppI18n = (locale: Locale = DEFAULT_LOCALE) =>
  createI18n({
    legacy: false,
    locale,
    fallbackLocale: DEFAULT_LOCALE,
    // Only English is eager; Portuguese is registered on demand via ensureLocale.
    // Typed as the full record so the instance's locale union includes 'pt' — the
    // runtime value carries only 'en' until ensureLocale('pt') loads the rest.
    messages: messages as Record<Locale, MessageSchema>,
  });

// Register the catalog for `locale` (a no-op for the eager English catalog or an
// already-loaded locale), then activate it.
export const ensureLocale = async (i18n: AppI18n, locale: Locale): Promise<void> => {
  if (!i18n.global.availableLocales.includes(locale)) {
    i18n.global.setLocaleMessage(locale, await loadLocaleMessages(locale));
  }
  i18n.global.locale.value = locale;
};

export const setupI18n = (app: App, router: Router): ((locale: Locale) => Promise<void>) => {
  const i18n = createAppI18n();
  app.use(i18n);
  app.provide(TRANSLATE_KEY, (key: string, params?: Record<string, string>) => i18n.global.t(key, params ?? {}));

  // Async guard: block the navigation until the target locale's catalog is loaded,
  // so a route never renders fallback strings. Covers the SSG pre-render (which
  // awaits router readiness) and client-side locale switches.
  router.beforeEach(to => ensureLocale(i18n, localeFromMeta(to.meta)));

  // Returned so the entry can await the initial locale before the app hydrates
  // (client hydration does not wait for router readiness).
  return (locale: Locale) => ensureLocale(i18n, locale);
};
