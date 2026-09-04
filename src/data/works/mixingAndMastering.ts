import type { WorksSection } from '@/types/works';

export const mixingAndMastering: WorksSection = {
  title: { en: 'Mixing & Mastering', pt: 'Mistura & Masterização' },
  id: 'mixing-and-mastering',
  items: [
    {
      id: 'master-open',
      title: 'Open',
      externalUrl: 'https://casaamarela.bandcamp.com/album/open',
      meta: {
        kind: 'engineering',
        roles: ['mastering'],
        artist: { name: 'Hugo Calcio' },
        editions: [{ label: { text: 'Colectivo Casa Amarela', url: 'https://casaamarela.bandcamp.com/' }, catalog: 'CCA#016' }],
        year: 2021,
      },
    },
    {
      id: 'master-vessels',
      title: 'Vessels',
      externalUrl: 'https://archive.org/details/brqn-004-rui-p.-andrade-01-what-hath-god-wrought',
      meta: {
        kind: 'engineering',
        roles: ['mastering'],
        artist: { name: 'Rui P. Andrade', url: 'https://canadian-rifles.bandcamp.com/' },
        editions: [{ label: { text: 'BRØQN' }, catalog: 'BRQN004' }],
        year: 2012,
      },
    },
  ],
};
