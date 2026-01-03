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
    // Handle SPA redirect from 404.html (client-side only)
    if (isClient) {
      const redirect = sessionStorage.getItem('spa-redirect');
      if (redirect) {
        sessionStorage.removeItem('spa-redirect');
        router.replace(redirect);
      }
    }
  },
);
