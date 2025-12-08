import './styles/main.scss';

import { ViteSSG } from 'vite-ssg';

import App from './App.vue';
import { routes } from './router';

export const createApp = ViteSSG(
  App,
  {
    routes,
    scrollBehavior(to, from, savedPosition) {
      if (savedPosition) {
        return savedPosition;
      }
      return { top: 0 };
    },
  },
  ({ router, isClient }) => {
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
