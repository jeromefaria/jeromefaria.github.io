import { describe, expect, it } from 'vitest';
import type { RouteRecordRaw } from 'vue-router';

import { buildRoutes, normalizeTrailingSlash, routes } from './index';

describe('router routes', () => {
  it('defines every page path plus a catch-all', () => {
    const paths = routes.map(route => route.path);
    expect(paths).toEqual([
      '/',
      '/about',
      '/works',
      '/works/:releaseId',
      '/live',
      '/press',
      '/contact',
      '/epk',
      '/privacy',
      '/colophon',
      '/:pathMatch(.*)*',
    ]);
  });

  it('names the home and not-found routes', () => {
    const names = routes.map(route => route.name);
    expect(names).toContain('home');
    expect(names).toContain('not-found');
  });

  it('lazy-loads every route component', async () => {
    for (const route of routes) {
      expect(typeof route.component).toBe('function');
      const loaded = await (route.component as () => Promise<{ default: unknown }>)();
      expect(loaded.default).toBeTruthy();
    }
  });
});

describe('buildRoutes (i18n)', () => {
  it('returns the base routes untouched when i18n is disabled', () => {
    expect(buildRoutes(routes, false)).toBe(routes);
  });

  it('mirrors every page under /pt with a locale tag, keeping one catch-all last', () => {
    const paths = buildRoutes(routes, true).map(route => route.path);

    expect(paths).toContain('/pt');
    expect(paths).toContain('/pt/about');
    expect(paths).toContain('/pt/works/:releaseId');
    expect(paths.filter(path => path.startsWith('/:pathMatch'))).toHaveLength(1);
    expect(paths.at(-1)).toBe('/:pathMatch(.*)*');
  });

  it('names and tags the pt home route', () => {
    const ptHome = buildRoutes(routes, true).find(route => route.path === '/pt');

    expect(ptHome?.name).toBe('pt-home');
    expect(ptHome?.meta?.locale).toBe('pt');
  });

  it('mirrors the catch-all under /pt (so /pt/<missing> renders in Portuguese), base last', () => {
    const built = buildRoutes(routes, true);
    const ptCatchAll = built.find(route => route.path === '/pt/:pathMatch(.*)*');

    expect(ptCatchAll?.name).toBe('pt-not-found');
    expect(ptCatchAll?.meta?.locale).toBe('pt');
    expect(built.at(-1)?.path).toBe('/:pathMatch(.*)*');
  });

  it('leaves a nameless route unnamed under /pt', () => {
    const base: RouteRecordRaw[] = [
      { path: '/loose', component: { render: () => null } },
      { path: '/:pathMatch(.*)*', name: 'not-found', component: { render: () => null } },
    ];

    const ptLoose = buildRoutes(base, true).find(route => route.path === '/pt/loose');

    expect(ptLoose?.name).toBeUndefined();
    expect(ptLoose?.meta?.locale).toBe('pt');
  });
});

describe('normalizeTrailingSlash', () => {
  it('redirects a trailing-slash path to its canonical extension-less form', () => {
    expect(normalizeTrailingSlash({ path: '/pt/', query: {}, hash: '' })).toEqual({ path: '/pt', query: {}, hash: '' });
    expect(normalizeTrailingSlash({ path: '/works/', query: {}, hash: '' })).toEqual({ path: '/works', query: {}, hash: '' });
    expect(normalizeTrailingSlash({ path: '/pt/works/', query: {}, hash: '' })).toEqual({ path: '/pt/works', query: {}, hash: '' });
  });

  it('preserves query and hash when normalizing', () => {
    expect(normalizeTrailingSlash({ path: '/works/', query: { track: '1' }, hash: '#credits' }))
      .toEqual({ path: '/works', query: { track: '1' }, hash: '#credits' });
  });

  it('leaves the root and slash-free paths untouched', () => {
    expect(normalizeTrailingSlash({ path: '/', query: {}, hash: '' })).toBe(true);
    expect(normalizeTrailingSlash({ path: '/works', query: {}, hash: '' })).toBe(true);
    expect(normalizeTrailingSlash({ path: '/pt', query: {}, hash: '' })).toBe(true);
  });
});
