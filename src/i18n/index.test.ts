import { describe, expect, it } from 'vitest';
import { createApp } from 'vue';
import { createMemoryHistory, createRouter } from 'vue-router';

import { createAppI18n, localeFromMeta, setupI18n } from './index';

describe('createAppI18n', () => {
  it('resolves a key in the default (en) locale', () => {
    const i18n = createAppI18n();

    expect(i18n.global.locale.value).toBe('en');
    expect(i18n.global.t('nav.about')).toBe('About');
  });

  it('resolves the same key in pt when the locale is set', () => {
    const i18n = createAppI18n('pt');

    expect(i18n.global.locale.value).toBe('pt');
    expect(i18n.global.t('nav.about')).toBe('Biografia');
  });

  it('falls back to en', () => {
    expect(createAppI18n('pt').global.fallbackLocale.value).toBe('en');
  });
});

describe('localeFromMeta', () => {
  it('reads the pt locale from route meta', () => {
    expect(localeFromMeta({ locale: 'pt' })).toBe('pt');
  });

  it('defaults to en when meta carries no locale', () => {
    expect(localeFromMeta({})).toBe('en');
  });

  it('defaults to en for an unknown locale value', () => {
    expect(localeFromMeta({ locale: 'xx' })).toBe('en');
  });
});

describe('setupI18n', () => {
  it('installs i18n and runs the locale guard on navigation', async () => {
    const app = createApp({ render: () => null });
    const router = createRouter({
      history: createMemoryHistory(),
      routes: [
        { path: '/', component: { render: () => null } },
        { path: '/pt', meta: { locale: 'pt' }, component: { render: () => null } },
      ],
    });

    expect(() => setupI18n(app, router)).not.toThrow();
    await expect(router.push('/pt')).resolves.not.toThrow();
  });
});
