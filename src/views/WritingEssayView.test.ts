import { createHead } from '@unhead/vue/client';
import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import { createMemoryHistory, createRouter } from 'vue-router';

import WritingEssayView from './WritingEssayView.vue';

const mountEssay = async (path: string) => {
  const head = createHead();
  const router = createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: '/writing/:slug', component: { template: '<div />' } },
      { path: '/writing', component: { template: '<div />' } },
      { path: '/:pathMatch(.*)*', component: { template: '<div />' } },
    ],
  });
  router.push(path);
  await router.isReady();
  return mount(WritingEssayView, { global: { plugins: [router, head] } });
};

describe('WritingEssayView', () => {
  it('renders the essay body and its in-text links', async () => {
    const wrapper = await mountEssay('/writing/orchestration');
    const html = wrapper.html();

    expect(html).toContain('Orchestration');
    expect(html).toContain('The conducting is still the part I keep');
    expect(html).toContain('href="/works/2504"');
    expect(html).toContain('href="/cv"');
    expect(html).toContain('github.com/jeromefaria/jeromefaria.github.io');
  });

  it('shows a fallback for an unknown essay slug', async () => {
    const wrapper = await mountEssay('/writing/does-not-exist');

    expect(wrapper.text()).toContain('could not be found');
  });
});
