import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import { defineComponent } from 'vue';
import { createMemoryHistory, createRouter } from 'vue-router';

import { useLocale } from './useLocale';

const emptyComponent = { render: () => null };

const mountAt = async (path: string): Promise<ReturnType<typeof useLocale>> => {
  const router = createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: '/about', component: emptyComponent },
      { path: '/works', component: emptyComponent },
      { path: '/cv', component: emptyComponent, meta: { englishOnly: true } },
      { path: '/pt/about', component: emptyComponent, meta: { locale: 'pt' } },
    ],
  });

  let api: ReturnType<typeof useLocale> | undefined;
  const Probe = defineComponent({
    setup() {
      api = useLocale();
      return () => null;
    },
  });

  await router.push(path);
  await router.isReady();
  mount(Probe, { global: { plugins: [router] } });

  return api as ReturnType<typeof useLocale>;
};

describe('useLocale', () => {
  it('prefixes paths under pt and strips the prefix for the switch link', async () => {
    const pt = await mountAt('/pt/about');

    expect(pt.current.value).toBe('pt');
    expect(pt.other.value).toBe('en');
    expect(pt.toLocalePath('/works')).toBe('/pt/works');
    expect(pt.switchPath.value).toBe('/about');
  });

  it('leaves en paths unprefixed and switches into pt', async () => {
    const en = await mountAt('/about');

    expect(en.current.value).toBe('en');
    expect(en.toLocalePath('/works')).toBe('/works');
    expect(en.switchPath.value).toBe('/pt/about');
    expect(en.hasAlternate.value).toBe(true);
  });

  it('reports no alternate for an English-only route', async () => {
    const cv = await mountAt('/cv');

    expect(cv.hasAlternate.value).toBe(false);
  });
});
