import { describe, expect, it } from 'vitest';

import { routes } from './index';

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
