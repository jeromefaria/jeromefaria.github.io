import { siteConfig } from './navigation';

export interface PageMeta {
  title: string;
  description: string;
  ogType?: string;
}

export const pageMeta = {
  home: {
    title: `${siteConfig.title} - ${siteConfig.tagline}`,
    description: siteConfig.description,
  },
  about: {
    title: 'About',
    description: 'The biography of Jerome Faria — Portuguese composer and sound artist, from netlabel-era noise to drone, film scores, and theatre.',
    ogType: 'profile',
  },
  works: {
    title: 'Works',
    description: 'Discography and works by Jerome Faria — solo releases, film and theatre scores, collaborations, curation, mixing, and mastering.',
  },
  live: {
    title: 'Live',
    description: 'Live performance history of Jerome Faria from 2005 to present, including festivals, concerts, and collaborations.',
  },
  contact: {
    title: 'Contact',
    description: 'Get in touch with Jerome Faria — performance bookings, commissions, licensing, mastering, and general inquiries.',
  },
  press: {
    title: 'Press',
    description: 'Press coverage and reviews of Jerome Faria\'s work from The Quietus, Bodyspace, Indie Rock Mag, and more.',
  },
  epk: {
    title: 'Press Kit',
    description: 'Press kit for Jerome Faria — biography, selected performances and works, press quotes, photography, and contact.',
    ogType: 'profile',
  },
  privacy: {
    title: 'Privacy',
    description: 'How this site handles the contact form, spam protection, and your data — no cookies, no analytics, no tracking.',
  },
} satisfies Record<string, PageMeta>;
