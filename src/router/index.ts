import type { RouteRecordRaw } from 'vue-router';

import { i18nEnabled } from '@/i18n/flag';

export const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/HomeView.vue'),
  },
  {
    path: '/about',
    name: 'about',
    component: () => import('@/views/AboutView.vue'),
  },
  {
    path: '/works',
    name: 'works',
    component: () => import('@/views/WorksView.vue'),
  },
  {
    path: '/works/:releaseId',
    name: 'work-release',
    component: () => import('@/views/WorksView.vue'),
  },
  {
    path: '/live',
    name: 'live',
    component: () => import('@/views/LiveView.vue'),
  },
  {
    path: '/press',
    name: 'press',
    component: () => import('@/views/PressView.vue'),
  },
  {
    path: '/contact',
    name: 'contact',
    component: () => import('@/views/ContactView.vue'),
  },
  {
    path: '/epk',
    name: 'epk',
    component: () => import('@/views/EpkView.vue'),
  },
  {
    path: '/privacy',
    name: 'privacy',
    component: () => import('@/views/PrivacyView.vue'),
  },
  {
    path: '/colophon',
    name: 'colophon',
    component: () => import('@/views/ColophonView.vue'),
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('@/views/NotFoundView.vue'),
  },
];

const PT_PREFIX = '/pt';

const isCatchAll = (route: RouteRecordRaw): boolean => route.path.startsWith('/:pathMatch');

const toPtRoute = (route: RouteRecordRaw): RouteRecordRaw => ({
  ...route,
  path: route.path === '/' ? PT_PREFIX : `${PT_PREFIX}${route.path}`,
  name: route.name ? `pt-${String(route.name)}` : undefined,
  meta: { ...route.meta, locale: 'pt' },
});

export const buildRoutes = (base: RouteRecordRaw[], i18nEnabled: boolean): RouteRecordRaw[] => {
  if (!i18nEnabled) return base;

  const pages = base.filter(route => !isCatchAll(route));
  return [...pages, ...pages.map(toPtRoute), ...base.filter(isCatchAll)];
};

export const appRoutes = buildRoutes(routes, i18nEnabled);
