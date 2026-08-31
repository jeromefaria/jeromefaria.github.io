import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import { defineComponent } from 'vue';
import { createMemoryHistory, createRouter } from 'vue-router';

import { useProse } from './useProse';

const mountAt = async (path: string): Promise<ReturnType<typeof useProse>> => {
  const router = createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: '/about', component: { render: () => null } },
      { path: '/pt/about', component: { render: () => null }, meta: { locale: 'pt' } },
    ],
  });

  let render: ReturnType<typeof useProse> | undefined;
  const Probe = defineComponent({
    setup() {
      render = useProse();
      return () => null;
    },
  });

  await router.push(path);
  await router.isReady();
  mount(Probe, { global: { plugins: [router] } });

  return render as ReturnType<typeof useProse>;
};

const body = { en: 'See <a href="/works">works</a>.', pt: 'Ver <a href="/works">obras</a>.' };

describe('useProse', () => {
  it('resolves the en body and leaves internal links unprefixed', async () => {
    const render = await mountAt('/about');
    const html = render(body);
    expect(html).toContain('href="/works"');
    expect(html).toContain('works</a>');
  });

  it('resolves the pt body and prefixes internal links', async () => {
    const render = await mountAt('/pt/about');
    const html = render(body);
    expect(html).toContain('href="/pt/works"');
    expect(html).toContain('obras</a>');
  });
});
