import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import { defineComponent } from 'vue';
import { createMemoryHistory, createRouter } from 'vue-router';

import { isLocalized, localize, useLocalized } from './localized';

describe('localize', () => {
  it('picks the locale value from a localized map', () => {
    expect(localize({ en: 'Works', pt: 'Obras' }, 'pt')).toBe('Obras');
    expect(localize({ en: 'Works', pt: 'Obras' }, 'en')).toBe('Works');
  });

  it('returns a plain value untouched', () => {
    expect(localize('Jerome Faria', 'pt')).toBe('Jerome Faria');
    expect(localize(['a', 'b'], 'pt')).toEqual(['a', 'b']);
  });
});

describe('isLocalized', () => {
  it('recognises a localized map and rejects plain values', () => {
    expect(isLocalized({ en: 'a', pt: 'b' })).toBe(true);
    expect(isLocalized('a')).toBe(false);
    expect(isLocalized(['a'])).toBe(false);
    expect(isLocalized(null)).toBe(false);
  });
});

describe('useLocalized', () => {
  const mountAt = async (path: string): Promise<(value: { en: string; pt: string }) => string> => {
    const router = createRouter({
      history: createMemoryHistory(),
      routes: [
        { path: '/about', component: { render: () => null } },
        { path: '/pt/about', component: { render: () => null }, meta: { locale: 'pt' } },
      ],
    });

    let localizeFn: ((value: { en: string; pt: string }) => string) | undefined;
    const Probe = defineComponent({
      setup() {
        localizeFn = useLocalized();
        return () => null;
      },
    });

    await router.push(path);
    await router.isReady();
    mount(Probe, { global: { plugins: [router] } });

    return localizeFn as (value: { en: string; pt: string }) => string;
  };

  it('resolves against the active route locale', async () => {
    const en = await mountAt('/about');
    expect(en({ en: 'Works', pt: 'Obras' })).toBe('Works');

    const pt = await mountAt('/pt/about');
    expect(pt({ en: 'Works', pt: 'Obras' })).toBe('Obras');
  });
});
