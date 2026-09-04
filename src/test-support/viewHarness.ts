import { createHead } from '@unhead/vue/client';
import { mount } from '@vue/test-utils';
import type { Component } from 'vue';
import { createMemoryHistory, createRouter, type RouteMeta } from 'vue-router';

export const mountView = async (component: Component, path = '/', meta: RouteMeta = {}) => {
  const head = createHead();
  const router = createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: '/works/:releaseId', component: { template: '<div />' } },
      { path: '/:pathMatch(.*)*', component: { template: '<div />' }, meta },
    ],
  });
  router.push(path);
  await router.isReady();
  return mount(component, { global: { plugins: [router, head] } });
};
