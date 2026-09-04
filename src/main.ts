import './styles/main.scss';

import { ViteSSG } from 'vite-ssg';
import type { App as VueApp } from 'vue';
import type { Router } from 'vue-router';

import App from './App.vue';
import { appRoutes, normalizeTrailingSlash } from './router';

interface ViteSSGContext {
  app: VueApp;
  router: Router;
  isClient: boolean;
}

export const createApp = ViteSSG(
  App,
  {
    routes: appRoutes,
    scrollBehavior(to, _from, savedPosition) {
      if (savedPosition) return savedPosition;
      if (to.hash) return false;
      return { top: 0 };
    },
  },
  async ({ app, router, isClient }: ViteSSGContext) => {
    // eslint-disable-next-line local/no-comments -- irreducible build constraint
    // Keep this env check inline: Rollup only dead-code-eliminates the import() gate (dropping vue-i18n) when the VITE_I18N literal is folded in place; an imported const defeats it.
    if (import.meta.env.VITE_I18N === 'true') {
      const { setupI18n } = await import('./i18n');
      setupI18n(app, router);
    }

    if (!isClient) return;

    router.beforeEach(normalizeTrailingSlash);

    const redirect = sessionStorage.getItem('spa-redirect');
    if (redirect) {
      sessionStorage.removeItem('spa-redirect');
      void router.isReady().then(() => router.replace(redirect));
    }

    // eslint-disable-next-line local/no-comments -- irreducible hydration footgun
    // Must stay fire-and-forget: awaiting router.isReady() here deadlocks hydration (it resolves only after mount).
    void router.isReady().then(() => {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          document.body.classList.add('ready');
        });
      });
    });
  },
);
