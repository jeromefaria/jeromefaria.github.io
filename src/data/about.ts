import type { AboutSection } from '@/types/about';

import { bios } from './bios';

export const aboutSections: AboutSection[] = [
  {
    id: 'short-bio',
    type: 'short-bio',
    content: bios.short,
  },
  {
    id: 'section-1',
    content: bios.long[0],
  },
  {
    id: 'image-group-1',
    type: 'image-group',
    images: [
      {
        src: '/images/about-2005-madeiradig.jpg',
        alt: 'Jerome Faria performing at MADEIRADIG 2005',
        position: 'center center',
        photographer: { name: 'Louie de Bettencourt' },
      },
      {
        src: '/images/about-2007-madeiradig.jpg',
        alt: 'Jerome Faria performing at MADEIRADIG 2007',
        position: 'center 50%',
        scale: 1.4,
        photographer: { name: 'Marta León', url: 'https://leonmarta.wordpress.com/' },
      },
      {
        src: '/images/about-2008-eme.jpg',
        alt: 'Jerome Faria performing at EME, Teatro Ibérico, Lisbon, 2008',
        position: 'center center',
        photographer: { name: 'EME Festival', url: 'https://www.emefestival.org/' },
      },
      {
        src: '/images/about-2009-madeiradig.jpg',
        alt: 'Jerome Faria and Hugo Olim performing at MADEIRADIG 2009',
        position: 'center 40%',
        photographer: { name: 'Miguel Apolinário', url: 'https://www.instagram.com/miguel_apolinario777/' },
      },
    ],
  },
  {
    id: 'image-group-2',
    type: 'image-group',
    images: [
      {
        src: '/images/about-2007-stfu.jpg',
        alt: 'Jerome Faria performing at STFU Porto, 2007',
        position: 'center 35%',
        photographer: { name: 'STFU Porto' },
      },
      {
        src: '/images/about-2008-storung.jpg',
        alt: 'Jerome Faria performing at Störung, Barcelona, 2008',
        position: 'center 35%',
        photographer: { name: 'Störung Festival', url: 'https://storung.com/' },
      },
    ],
  },
  {
    id: 'section-2',
    content: bios.long[1],
  },
  {
    id: 'image-group-3b',
    type: 'image-group',
    images: [
      {
        src: '/images/about-2009-olhares.jpg',
        alt: 'Jerome Faria performing at EME.LL Olhares, Porto, 2009',
        position: '100% center',
        scale: 1.3,
        photographer: { name: 'Vítor Joaquim', url: 'https://www.vitorjoaquim.pt/' },
      },
      {
        src: '/images/about-2010-olhares.jpg',
        alt: 'Jerome Faria performing at Olhares de Outono, 2010',
        position: '70% 60%',
        photographer: { name: 'Olhares de Outono' },
      },
    ],
  },
  {
    id: 'image-group-3',
    type: 'image-group',
    images: [
      {
        src: '/images/about-2011-migractions.jpg',
        alt: 'Jerome Faria performing at Festival Migractions, Paris, 2011',
        position: 'center 50%',
        scale: 1.3,
        photographer: { name: 'Sue-Elie Andrade-Dé', url: 'https://cargocollective.com/sueelieandradede' },
      },
      {
        src: '/images/about-2011-madeiradig.jpg',
        alt: 'Jerome Faria and Taylor Deupree performing at MADEIRADIG 2011',
        position: '40% center',
        scale: 1.3,
        rotate: 1,
        photographer: { name: 'Valentina Araújo' },
      },
      {
        src: '/images/about-2015-fica.jpg',
        alt: 'Jerome Faria performing at Fica na Cidade, 2015',
        position: 'center center',
        photographer: { name: 'Fica na Cidade' },
      },
      {
        src: '/images/about-2015-heineken.jpg',
        alt: 'Jerome Faria opening for William Basinski at Heineken Series, Lisbon, 2015',
        position: 'center 70%',
        photographer: { name: 'Pedro Jafuno', url: 'https://www.instagram.com/jafuno/' },
      },
    ],
  },
  {
    id: 'section-3',
    content: bios.long[2],
  },
  {
    id: 'image-group-4',
    type: 'image-group',
    images: [
      {
        src: '/images/about-2021-nariz.jpg',
        alt: 'Jerome Faria performing at Nariz Entupido, 2021',
        position: '60% center',
        photographer: { name: 'Ricardo Nogueira', url: 'https://www.instagram.com/nogueirafoto/' },
      },
      {
        src: '/images/about-2022-jejum.jpg',
        alt: 'Jerome Faria performing at Jejum #11, Lisbon, 2022',
        position: 'center center',
        photographer: { name: 'Pedro Jafuno', url: 'https://www.instagram.com/jafuno/' },
      },
    ],
  },
  {
    id: 'image-group-5',
    type: 'image-group',
    images: [
      {
        src: '/images/about-2022-amess-museu.jpg',
        alt: 'Jerome Faria with Amess at Museu Henrique e Francisco Franco, 2022',
        position: 'center 45%',
        photographer: { name: 'Miguel Apolinário', url: 'https://www.instagram.com/miguel_apolinario777/' },
      },
      {
        src: '/images/about-2022-amess-teatro.jpg',
        alt: 'Jerome Faria performing at Teatro Municipal Baltazar Dias, 2022',
        position: 'center 70%',
        photographer: { name: 'Óscar Silva', url: 'https://www.instagram.com/oscar_silva95/' },
      },
      {
        src: '/images/about-2025-fim.jpg',
        alt: 'Jerome Faria performing at Fim de Emissão #45, 2025',
        position: 'center 80%',
        photographer: { name: 'Pedro Roque', url: 'https://eyesofmadness-photography.blogspot.com/' },
      },
      {
        src: '/images/about-2025-showcase.jpg',
        alt: 'NOx (Jerome Faria and Pedro Roque) performing at Cooperativa Mula, Barreiro, 2025',
        position: 'center 90%',
        photographer: { name: 'Ricardo Almeida', url: 'https://www.instagram.com/ricardojosealmeida/' },
      },
    ],
  },
];
