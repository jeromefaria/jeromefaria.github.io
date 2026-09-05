import type { Localized } from '@/i18n/localized';

import { siteConfig } from './navigation';

export interface PageMeta {
  title: Localized<string>;
  description: Localized<string>;
  ogType?: string;
}

export const pageMeta = {
  home: {
    title: {
      en: `${siteConfig.title} - ${siteConfig.tagline.en}`,
      pt: `${siteConfig.title} - ${siteConfig.tagline.pt}`,
    },
    description: siteConfig.description,
  },
  notFound: {
    title: { en: 'Page Not Found', pt: 'Página não encontrada' },
    description: {
      en: 'The page you are looking for does not exist.',
      pt: 'A página que procura não existe.',
    },
  },
  about: {
    title: { en: 'About', pt: 'Sobre' },
    description: {
      en: 'The biography of Jerome Faria — Portuguese composer and sound artist, from netlabel-era noise to drone, film scores, and theatre.',
      pt: 'A biografia de Jerome Faria — compositor e artista sonoro português, do ruído da era das netlabels ao drone, às bandas sonoras e ao teatro.',
    },
    ogType: 'profile',
  },
  works: {
    title: { en: 'Works', pt: 'Obras' },
    description: {
      en: 'Discography and works by Jerome Faria — solo releases, film and theatre scores, collaborations, curation, mixing, and mastering.',
      pt: 'Discografia e obra de Jerome Faria — edições a solo, bandas sonoras para cinema e teatro, colaborações, curadoria, mistura e masterização.',
    },
  },
  live: {
    title: { en: 'Live', pt: 'Concertos' },
    description: {
      en: 'Live performance history of Jerome Faria from 2005 to present, including festivals, concerts, and collaborations.',
      pt: 'Historial de actuações ao vivo de Jerome Faria de 2005 até hoje, incluindo festivais, concertos e colaborações.',
    },
  },
  contact: {
    title: { en: 'Contact', pt: 'Contacto' },
    description: {
      en: 'Get in touch with Jerome Faria — performance bookings, commissions, licensing, mixing and mastering, and general inquiries.',
      pt: 'Entre em contacto com Jerome Faria — marcação de actuações, encomendas, licenciamento, mistura e masterização, e outros pedidos.',
    },
  },
  press: {
    title: { en: 'Press', pt: 'Imprensa' },
    description: {
      en: 'Press coverage and reviews of Jerome Faria\'s work from The Quietus, Bodyspace, Indie Rock Mag, and more.',
      pt: 'Cobertura de imprensa e críticas ao trabalho de Jerome Faria em The Quietus, Bodyspace, Indie Rock Mag e outros.',
    },
  },
  epk: {
    title: { en: 'Press Kit', pt: 'Dossier de Imprensa' },
    description: {
      en: 'Press kit for Jerome Faria — biography, selected performances and works, press quotes, photography, and contact.',
      pt: 'Dossier de imprensa de Jerome Faria — biografia, actuações e obras seleccionadas, citações de imprensa, fotografia e contacto.',
    },
    ogType: 'profile',
  },
  privacy: {
    title: { en: 'Privacy', pt: 'Privacidade' },
    description: {
      en: 'How this site handles the contact form, spam protection, and your data — no cookies, no analytics, no tracking.',
      pt: 'Como este site trata o formulário de contacto, a protecção contra spam e os seus dados — sem cookies, sem estatísticas, sem rastreio.',
    },
  },
  cv: {
    title: { en: 'CV — Jerome Faria', pt: 'CV — Jerome Faria' },
    description: {
      en: 'Curriculum vitae of Jerome Faria — senior frontend engineer (Vue / TypeScript).',
      pt: 'Curriculum vitae de Jerome Faria — senior frontend engineer (Vue / TypeScript).',
    },
  },
  colophon: {
    title: { en: 'Colophon', pt: 'Colophon' },
    description: {
      en: 'The tech behind this site — Vue 3, Vite-SSG static rendering, TypeScript, and a keyboard-first, tested-to-the-pixel build.',
      pt: 'A tecnologia por detrás deste site — Vue 3, renderização estática com Vite-SSG, TypeScript e uma construção pensada para o teclado e testada ao pormenor.',
    },
  },
} satisfies Record<string, PageMeta>;
