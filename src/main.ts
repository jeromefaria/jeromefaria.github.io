import './styles/main.scss';

import { ViteSSG } from 'vite-ssg';
import type { Router } from 'vue-router';

import App from './App.vue';
import { routes } from './router';

interface ViteSSGContext {
  router: Router;
  isClient: boolean;
}

export const createApp = ViteSSG(
  App,
  {
    routes,
    scrollBehavior(to, _from, savedPosition) {
      if (savedPosition) return savedPosition;
      if (to.hash) return false;
      return { top: 0 };
    },
  },
  ({ router, isClient }: ViteSSGContext) => {
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
