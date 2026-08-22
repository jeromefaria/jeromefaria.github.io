import { createHead } from '@unhead/vue/client';
import { flushPromises, mount, type VueWrapper } from '@vue/test-utils';
import { afterEach, describe, expect, it } from 'vitest';
import { nextTick } from 'vue';
import { createMemoryHistory, createRouter } from 'vue-router';

import App from './App.vue';

const LinksPage = {
  template: `<div>
    <a href="https://external.example.com">external</a>
    <a href="/about">internal</a>
    <a href="http://localhost/local-page">same-origin absolute</a>
  </div>`,
};

const SecondPage = {
  template: '<div><a href="https://second.example.com">second</a></div>',
};

// App wraps the router-view in <Suspense>, so the routed component commits to
// the DOM a macrotask after mount — later than flushPromises (microtasks) can
// wait for. Settle across a few macrotask + microtask rounds so onMounted's
// processExternalLinks has run against the committed <main>.
const settle = async () => {
  for (let round = 0; round < 3; round += 1) {
    await new Promise(resolve => setTimeout(resolve, 0));
    await flushPromises();
    await nextTick();
  }
};

// App resolves the active <main> with a document-wide query, so only one App
// may be attached at a time — otherwise a stale, still-attached instance would
// be scanned instead of the current one.
let activeWrapper: VueWrapper | null = null;

const mountApp = async () => {
  const head = createHead();
  const router = createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: '/', component: LinksPage },
      { path: '/about', component: SecondPage },
    ],
  });
  router.push('/');
  await router.isReady();
  const wrapper = mount(App, { global: { plugins: [router, head] }, attachTo: document.body });
  activeWrapper = wrapper;
  await settle();
  return { wrapper, router };
};

describe('App', () => {
  afterEach(() => {
    activeWrapper?.unmount();
    activeWrapper = null;
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

  it('marks a cross-origin link in the main content as a new-tab, safe link', async () => {
    const { wrapper } = await mountApp();
    const external = wrapper.get('main a[href="https://external.example.com"]');

    expect(external.attributes('target')).toBe('_blank');
    expect(external.attributes('rel')).toBe('noopener noreferrer');
  });

  it('leaves a same-origin internal link untouched', async () => {
    const { wrapper } = await mountApp();
    const internal = wrapper.get('main a[href="/about"]');

    expect(internal.attributes('target')).toBeUndefined();
    expect(internal.attributes('rel')).toBeUndefined();
  });

  it('leaves a same-origin absolute link untouched', async () => {
    const { wrapper } = await mountApp();
    const sameOrigin = wrapper.get('main a[href="http://localhost/local-page"]');

    expect(sameOrigin.attributes('target')).toBeUndefined();
    expect(sameOrigin.attributes('rel')).toBeUndefined();
  });

  it('reprocesses a freshly rendered external link after navigation', async () => {
    const { wrapper, router } = await mountApp();
    await router.push('/about');
    await settle();

    const external = wrapper.get('main a[href="https://second.example.com"]');
    expect(external.attributes('target')).toBe('_blank');
    expect(external.attributes('rel')).toBe('noopener noreferrer');
  });
});
