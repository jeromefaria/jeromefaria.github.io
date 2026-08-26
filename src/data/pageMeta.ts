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
    description: 'Biography and background of Jerome Faria, Portuguese sound artist and electronic music composer.',
    ogType: 'profile',
  },
  works: {
    title: 'Works',
    description: 'Discography, film scores, and works by Jerome Faria including solo releases, collaborations, and curatorial projects.',
  },
  live: {
    title: 'Live',
    description: 'Live performance history of Jerome Faria from 2005 to present, including festivals, concerts, and collaborations.',
  },
  contact: {
    title: 'Contact',
    description: 'Get in touch with Jerome Faria for commissions, collaborations, performance bookings, and general inquiries.',
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
