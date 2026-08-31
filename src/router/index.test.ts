import { describe, expect, it } from 'vitest';

import { buildRoutes, routes } from './index';

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
});
