// Site configuration and navigation data

import type { NavItem, SiteConfig, SocialLink } from '@/types/navigation';

export const siteConfig: SiteConfig = {
  title: 'Jerome Faria',
  tagline: 'Sound Artist & Composer',
  description: 'Creating at the edges of experimental electronics, film scoring, and live performance since 2004',
  url: 'https://jeromefaria.com',
  image: '/images/performance.jpg',
  author: {
    name: 'Jerome Faria',
    email: 'jerome.faria@gmail.com',
    bio: 'Composer & Sound Artist',
  },
};

export const navigation: NavItem[] = [
  { title: 'About', url: '/about' },
  { title: 'Works', url: '/works' },
  { title: 'Live', url: '/live' },
  { title: 'Press', url: '/press' },
  { title: 'Contact', url: '/contact' },
];

export const social: SocialLink[] = [
  { name: 'bandcamp', url: 'https://jeromefaria.bandcamp.com' },
  { name: 'patreon', url: 'https://www.patreon.com/jeromefaria' },
];
