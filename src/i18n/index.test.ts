import { describe, expect, it } from 'vitest';
import { createApp } from 'vue';

import { createAppI18n, installI18n } from './index';

describe('createAppI18n', () => {
  it('resolves a key in the default (en) locale', () => {
    const i18n = createAppI18n();

    expect(i18n.global.locale.value).toBe('en');
    expect(i18n.global.t('nav.about')).toBe('About');
  });

  it('resolves the same key in pt when the locale is set', () => {
    const i18n = createAppI18n('pt');

    expect(i18n.global.locale.value).toBe('pt');
    expect(i18n.global.t('footer.colophon')).toBe('Cólofon');
  });

  it('falls back to en', () => {
    expect(createAppI18n('pt').global.fallbackLocale.value).toBe('en');
  });

  it('installs onto a Vue app', () => {
    expect(() => installI18n(createApp({ render: () => null }), 'pt')).not.toThrow();
  });
});
