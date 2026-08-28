import { createHead } from '@unhead/vue/client';
import { mount } from '@vue/test-utils';
import type { Component } from 'vue';
import { createMemoryHistory, createRouter } from 'vue-router';

/**
 * Mount a view component with the plugins it needs at runtime: a memory router
 * (for `useRoute` / `RouterLink`) and an unhead instance (for `usePageHead`).
 */
export const mountView = async (component: Component, path = '/') => {
  const head = createHead();
  const router = createRouter({
    history: createMemoryHistory(),
    routes: [
      // Mirrors the real release permalink so `useRoute().params.releaseId` resolves in tests.
      { path: '/works/:releaseId', component: { template: '<div />' } },
      { path: '/:pathMatch(.*)*', component: { template: '<div />' } },
    ],
  });
  router.push(path);
  await router.isReady();
  return mount(component, { global: { plugins: [router, head] } });
};
