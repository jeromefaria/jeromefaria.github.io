import type { RouteLocationNormalized, RouteLocationRaw, RouteRecordRaw } from 'vue-router';

import { i18nEnabled } from '@/i18n/flag';
import type { Locale } from '@/i18n/messages';

export interface PaletteRouteMeta {
  title: string;
  keywords: string;
}

declare module 'vue-router' {
  interface RouteMeta {
    englishOnly?: boolean;
    locale?: Locale;
    palette?: PaletteRouteMeta;
  }
}

export const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/HomeView.vue'),
    meta: { palette: { title: 'palette.home', keywords: 'palette.kw.home' } },
  },
  {
    path: '/about',
    name: 'about',
    component: () => import('@/views/AboutView.vue'),
    meta: { palette: { title: 'nav.about', keywords: 'palette.kw.about' } },
  },
  {
    path: '/works',
    name: 'works',
    component: () => import('@/views/WorksView.vue'),
    meta: { palette: { title: 'nav.works', keywords: 'palette.kw.works' } },
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
    meta: { palette: { title: 'nav.live', keywords: 'palette.kw.live' } },
  },
  {
    path: '/live/:eventId',
    name: 'live-event',
    component: () => import('@/views/LiveView.vue'),
  },
  {
    path: '/press',
    name: 'press',
    component: () => import('@/views/PressView.vue'),
    meta: { palette: { title: 'nav.press', keywords: 'palette.kw.press' } },
  },
  {
    path: '/epk',
    name: 'epk',
    component: () => import('@/views/EpkView.vue'),
    meta: { palette: { title: 'palette.pressKit', keywords: 'palette.kw.pressKit' } },
  },
  {
    path: '/contact',
    name: 'contact',
    component: () => import('@/views/ContactView.vue'),
    meta: { palette: { title: 'nav.contact', keywords: 'palette.kw.contact' } },
  },
  {
    path: '/newsletter',
    name: 'newsletter',
    component: () => import('@/views/NewsletterView.vue'),
    meta: { palette: { title: 'footer.newsletter', keywords: 'palette.kw.newsletter' } },
  },
  {
    path: '/newsletter/:issue',
    name: 'newsletter-issue',
    component: () => import('@/views/NewsletterIssueView.vue'),
    meta: { englishOnly: true },
  },
  {
    path: '/privacy',
    name: 'privacy',
    component: () => import('@/views/PrivacyView.vue'),
    meta: { palette: { title: 'footer.privacy', keywords: 'palette.kw.privacy' } },
  },
  {
    path: '/colophon',
    name: 'colophon',
    component: () => import('@/views/ColophonView.vue'),
    meta: { palette: { title: 'footer.colophon', keywords: 'palette.kw.colophon' } },
  },
  {
    path: '/copyright',
    name: 'copyright',
    component: () => import('@/views/CopyrightView.vue'),
    meta: { palette: { title: 'palette.copyright', keywords: 'palette.kw.copyright' } },
  },
  {
    path: '/cv',
    name: 'cv',
    component: () => import('@/views/CvView.vue'),
    meta: { englishOnly: true, palette: { title: 'palette.cv', keywords: 'palette.kw.cv' } },
  },
  {
    path: '/writing',
    name: 'writing',
    component: () => import('@/views/WritingView.vue'),
    meta: { englishOnly: true, palette: { title: 'palette.writing', keywords: 'palette.kw.writing' } },
  },
  {
    path: '/writing/:slug',
    name: 'writing-essay',
    component: () => import('@/views/WritingEssayView.vue'),
    meta: { englishOnly: true },
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
  const mirrored = pages.filter(route => !route.meta?.['englishOnly']);
  const catchAll = base.filter(isCatchAll);
  return [...pages, ...mirrored.map(toPtRoute), ...catchAll.map(toPtRoute), ...catchAll];
};

export const appRoutes = buildRoutes(routes, i18nEnabled);

type NavigationTarget = Pick<RouteLocationNormalized, 'path' | 'query' | 'hash'>;

export const normalizeTrailingSlash = (to: NavigationTarget): RouteLocationRaw | true => {
  if (to.path.length > 1 && to.path.endsWith('/')) {
    return { path: to.path.replace(/\/+$/, ''), query: to.query, hash: to.hash };
  }
  return true;
};
