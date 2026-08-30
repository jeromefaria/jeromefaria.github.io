import type { NavItem, SiteConfig, SocialLink } from '@/types/navigation';

export const siteConfig: SiteConfig = {
  title: 'Jerome Faria',
  tagline: 'Sound Artist & Composer',
  description: 'Portuguese composer and sound artist, moving between confrontational noise and patient drone, film scores and theatre.',
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
  { name: 'bluesky', url: 'https://bsky.app/profile/jeromefaria.com' },
  { name: 'github', url: 'https://github.com/jeromefaria' },
  { name: 'linkedin', url: 'https://www.linkedin.com/in/jeromefaria' },
  { name: 'patreon', url: 'https://www.patreon.com/jeromefaria' },
  { name: 'soundcloud', url: 'https://soundcloud.com/jeromefaria' },
  { name: 'substack', url: 'https://jeromefaria.substack.com' },
  { name: 'twitch', url: 'https://www.twitch.tv/jeromefaria' },
  { name: 'youtube', url: 'https://www.youtube.com/@jeromefaria' },
];
