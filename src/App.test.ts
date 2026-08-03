import { createHead } from '@unhead/vue/client';
import { flushPromises, mount } from '@vue/test-utils';
import { afterEach, describe, expect, it } from 'vitest';
import { createMemoryHistory, createRouter } from 'vue-router';

import App from './App.vue';

// A route component containing an external and an internal link, so we can
// exercise App's processExternalLinks pass.
const LinksPage = {
  template: '<div><a href="https://external.example.com">external</a> <a href="/about">internal</a></div>',
};

const mountApp = async () => {
  const head = createHead();
  const router = createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: '/', component: LinksPage },
      { path: '/about', component: LinksPage },
    ],
  });
  router.push('/');
  await router.isReady();
  const wrapper = mount(App, { global: { plugins: [router, head] }, attachTo: document.body });
  await flushPromises();
  return { wrapper, router };
};

describe('App', () => {
  afterEach(() => {
    document.body.classList.remove('ready');
  });

  it('renders the skip link and the main content region', async () => {
    const { wrapper } = await mountApp();
    expect(wrapper.get('.skip-link').attributes('href')).toBe('#main-content');
    expect(wrapper.find('main#main-content').exists()).toBe(true);
  });

  it('marks the body ready on mount', async () => {
    await mountApp();
    expect(document.body.classList.contains('ready')).toBe(true);
  });

  it('reprocesses links on navigation without error', async () => {
    const { wrapper, router } = await mountApp();
    await router.push('/about');
    await flushPromises();
    await wrapper.vm.$nextTick();
    expect(wrapper.find('main').exists()).toBe(true);
  });
});
