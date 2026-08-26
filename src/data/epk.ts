import type { EpkManifest } from '@/types/epk';

export const epkManifest: EpkManifest = {
  photos: [
    {
      src: '/images/press-portrait-1.jpg',
      alt: 'Portrait of Jerome Faria',
      photographer: { name: 'Pedro Jafuno', url: 'https://www.instagram.com/jafuno/' },
    },
    {
      src: '/images/press-portrait-2.jpg',
      alt: 'Portrait of Jerome Faria',
      photographer: { name: 'Pedro Jafuno', url: 'https://www.instagram.com/jafuno/' },
    },
    {
      src: '/images/press-portrait-3.jpg',
      alt: 'Portrait of Jerome Faria',
      photographer: { name: 'Pedro Jafuno', url: 'https://www.instagram.com/jafuno/' },
    },
    {
      src: '/images/press-live-1.jpg',
      alt: 'Jerome Faria performing live',
      photographer: { name: 'Pedro Jafuno', url: 'https://www.instagram.com/jafuno/' },
    },
    {
      src: '/images/press-live-2.jpg',
      alt: 'Jerome Faria performing live',
      photographer: { name: 'Ricardo Almeida', url: 'https://www.instagram.com/ricardojosealmeida/' },
    },
    {
      src: '/images/press-live-3.jpg',
      alt: 'Jerome Faria performing live',
      photographer: { name: 'Pedro Roque', url: 'https://eyesofmadness-photography.blogspot.com/' },
    },
  ],
  shortBio: 'short',
  longBio: 'press',
  pressQuoteIds: ['quietus-madeiradig', 'paralelo33-alvanoto', 'edicao-limitada', 'bodyspace-basinski'],
  highlightLiveIds: ['aragao-funchal', 'madeiradig-2011', 'eme-2008', 'olhares-de-outono-2010', 'storung-2008', 'migractions-2011'],
  highlightWorkIds: ['contraplacado', 'en-veille', '2504', 'caligari-album', 'overlapse', '1714'],
};
