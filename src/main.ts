import './styles/main.scss';

import { ViteSSG } from 'vite-ssg';
import type { App as VueApp } from 'vue';
import type { Router } from 'vue-router';

import App from './App.vue';
import { appRoutes } from './router';

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
    // Dynamic import so Rollup drops vue-i18n from the bundle when the flag is off.
    // The literal env check must stay inline here: Rollup only dead-code-eliminates
    // this import() gate — and drops vue-i18n — when it folds the comparison in place.
    // An imported i18nEnabled const defeats that (verified), so this one is not shared.
    if (import.meta.env.VITE_I18N === 'true') {
      const { setupI18n } = await import('./i18n');
      setupI18n(app, router);
    }

    // Client-side only: SSG pre-render has no session storage or live DOM.
    if (!isClient) return;

    // SPA redirect from 404.html — replace after the initial navigation resolves,
    // or the startup route overrides it and the stored path is lost.
    const redirect = sessionStorage.getItem('spa-redirect');
    if (redirect) {
      sessionStorage.removeItem('spa-redirect');
      void router.isReady().then(() => router.replace(redirect));
    }

    // Fire-and-forget: awaiting router.isReady() in the setup callback would
    // deadlock hydration (it resolves only after mount). The nested rAF waits
    // until event handlers are attached before flagging the body ready.
    void router.isReady().then(() => {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          document.body.classList.add('ready');
        });
      });
    });
  },
);
