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
  shortBioId: 'short-bio',
  longBio: {
    source: 'custom',
    html: `
      <p>Jerome Faria (b. 1983) is a Portuguese composer and sound artist whose two-decade practice moves between confrontational noise and patient drone, spanning solo records, collaborations, and scores for film and theatre.</p>
      <p>That trajectory runs from the abrasive digital music of his early NNY releases — which placed him in the 2009 survey <em>Glitch: Designing Imperfection</em>, alongside Kim Cascone and JODI — to the sustained, long-form pieces he records under his own name, and into composition for screen and stage, including a live score for Robert Wiene's <em>The Cabinet of Dr. Caligari</em>. After several quieter years he returned around 2020, his solo output leaner and more deliberate — from <em>2504</em> (2024), a musique-concrète meditation on Portugal's Carnation Revolution, through to <em>En Veille</em> and <em>Contraplacado</em> (2026) — with the improvising duo NOx as a noisier counterweight.</p>
      <p>A recurring presence at MADEIRADIG between 2005 and 2011, he shared bills there with Alva Noto, Fennesz, Tim Hecker, Oval and Murcof, with further dates at Störung (Barcelona) and Festival Migractions (Paris); at MADEIRADIG 2011 he performed in duo with Taylor Deupree. Closer to home, he is rooted in Portugal's experimental community — sharing stages with @c, Vitor Joaquim and David Maranha, and a long-running duo with Hugo Olim that Alva Noto singled out for praise. These days he works more selectively, centred on an ongoing collaboration with the Lisbon experimental label Colectivo Casa Amarela, where he performs, records and masters.</p>
    `,
  },
  pressQuoteIds: ['quietus-madeiradig', 'paralelo33-alvanoto', 'edicao-limitada', 'bodyspace-basinski'],
  highlightLiveIds: ['aragao-funchal', 'madeiradig-2011', 'eme-2008', 'olhares-de-outono-2010', 'storung-2008', 'migractions-2011'],
  highlightWorkIds: ['contraplacado', 'en-veille', '2504', 'caligari-album', 'overlapse', '1714'],
};
