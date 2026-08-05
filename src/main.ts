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
      if (savedPosition) {
        return savedPosition;
      }
      // If there's a hash, don't scroll - let the component handle it
      if (to.hash) {
        return false;
      }
      return { top: 0 };
    },
  },
  ({ router, isClient }: ViteSSGContext) => {
    // Client-side only: SSG pre-render has no session storage or live DOM.
    if (!isClient) return;

    // Handle SPA redirect from 404.html.
    const redirect = sessionStorage.getItem('spa-redirect');
    if (redirect) {
      sessionStorage.removeItem('spa-redirect');
      router.replace(redirect);
    }

    // Add the ready class to body once Vue is fully hydrated. This is a
    // deliberate fire-and-forget: the setup callback must NOT await
    // router.isReady() here, since that resolves only after mount and would
    // deadlock hydration. The nested rAF ensures event handlers are attached.
    router.isReady().then(() => {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          document.body.classList.add('ready');
        });
      });
    });
  },
);
