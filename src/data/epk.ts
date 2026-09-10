import type { EpkManifest } from '@/types/epk';

export const epkManifest: EpkManifest = {
  photos: [
    {
      src: '/images/press-portrait-1.jpg',
      alt: { en: 'Portrait of Jerome Faria', pt: 'Retrato de Jerome Faria' },
      photographer: { name: 'Pedro Jafuno' },
    },
    {
      src: '/images/press-portrait-2.jpg',
      alt: { en: 'Portrait of Jerome Faria', pt: 'Retrato de Jerome Faria' },
      photographer: { name: 'Pedro Jafuno' },
    },
    {
      src: '/images/press-portrait-3.jpg',
      alt: { en: 'Portrait of Jerome Faria', pt: 'Retrato de Jerome Faria' },
      photographer: { name: 'Pedro Jafuno' },
    },
    {
      src: '/images/press-live-2.jpg',
      alt: { en: 'Jerome Faria performing live', pt: 'Jerome Faria em concerto' },
      photographer: { name: 'Ricardo Almeida' },
    },
    {
      src: '/images/press-live-3.jpg',
      alt: { en: 'Jerome Faria performing live', pt: 'Jerome Faria em concerto' },
      photographer: { name: 'Pedro Roque' },
    },
    {
      src: '/images/press-live-1.jpg',
      alt: { en: 'Jerome Faria performing live', pt: 'Jerome Faria em concerto' },
      photographer: { name: 'Nuno Martins' },
    },
  ],
  shortBio: 'short',
  longBio: 'press',
  pressQuoteIds: ['quietus-madeiradig', 'bodyspace-basinski', 'acloserlisten', 'paralelo33-alvanoto'],
  highlightLiveIds: ['aragao-funchal', 'madeiradig-2011', 'eme-2008', 'olhares-de-outono-2010', 'storung-2008', 'migractions-2011'],
  highlightWorkIds: ['contraplacado', 'en-veille', '2504', { id: 'caligari-album', title: 'The Cabinet of Dr. Caligari' }, 'overlapse', '1714'],
  sharedStages: [
    { name: 'Alva Noto', url: 'https://www.alvanoto.com/' },
    { name: 'Oneohtrix Point Never', url: 'https://pointnever.com/' },
    { name: 'Hauschka', url: 'https://hauschka.bandcamp.com/' },
    { name: 'Fennesz', url: 'https://www.fennesz.com/' },
    { name: 'William Basinski', url: 'https://www.mmlxii.com/' },
    { name: 'Tim Hecker', url: 'https://sunblind.net/' },
    { name: 'Lee Ranaldo', url: 'https://www.leeranaldo.com/' },
    { name: 'Francisco López', url: 'https://www.franciscolopez.net/' },
    { name: 'Oval', url: 'https://oval.bandcamp.com/' },
    { name: 'Vladislav Delay', url: 'https://vladislavdelay.bandcamp.com/' },
    { name: 'Murcof', url: 'https://murcof.com/' },
    { name: 'Taylor Deupree', url: 'https://12k.com/' },
    { name: 'Frank Bretschneider', url: 'https://frankbretschneider.bandcamp.com/' },
  ],
};
