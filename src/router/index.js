export const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/HomeView.vue')
  },
  {
    path: '/about',
    name: 'about',
    component: () => import('@/views/AboutView.vue')
  },
  {
    path: '/works',
    name: 'works',
    component: () => import('@/views/WorksView.vue')
  },
  {
    path: '/live',
    name: 'live',
    component: () => import('@/views/LiveView.vue')
  },
  {
    path: '/press',
    name: 'press',
    component: () => import('@/views/PressView.vue')
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('@/views/NotFoundView.vue')
  }
]
