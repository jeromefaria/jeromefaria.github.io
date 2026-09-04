import type { WorksSection } from '@/types/works';

export const nny: WorksSection = {
  title: { en: 'NNY (2004–2009)', pt: 'NNY (2004–2009)' },
  id: 'nny',
  items: [
    {
      id: 'nny-plus',
      title: 'NNY++',
      coverImage: '/images/nny.jpg',
      externalUrl: 'https://www.discogs.com/release/932955-NNY-NNY',
      meta: {
        kind: 'music',
        mediums: ['CDr'],
        editions: [{ label: { text: 'Almasud Records', url: 'https://www.discogs.com/label/84424-Almasud-Records' }, catalog: 'CDRASUD015' }],
        year: 2007,
      },
      tracklist: [
        { title: '001' },
        { title: '002' },
        { title: '003' },
      ],
      credits: {
        style: 'by',
        clauses: [
          { role: 'music', of: 'Jerome Faria, Kazuya Mise, and Filipe Cruz' },
          { role: 'artwork', of: '[[Filipe Cruz]]' },
        ],
      },
      contributors: [
        { name: 'Filipe Cruz', url: 'https://webuser.scene.org/~ps/' },
      ],
    },
    {
      id: 'coil',
      title: 'COIL',
      bandcampId: '2124016895',
      coverImage: '/images/coil.jpg',
      bandcampUrl: 'https://mimirecords.bandcamp.com/album/coil',
      meta: {
        kind: 'music',
        mediums: ['Digital'],
        editions: [{ label: { text: 'MiMi Records', url: 'https://mimirecords.bandcamp.com/' }, catalog: 'MI056' }],
        year: 2006,
      },
      tracklist: [
        { title: 'Dream Cycles In Perpetual Motion' },
      ],
      credits: {
        style: 'by',
        clauses: [
          { role: 'music', of: 'Jerome Faria' },
          { role: 'recordedMixedMastered', of: 'Human Error Labs', connector: 'at' },
          { role: 'artwork', of: 'Louie de Bettencourt' },
        ],
      },
    },
    {
      id: 'readerror',
      title: '(READ.ERROR)',
      bandcampId: '2169776155',
      coverImage: '/images/readerror.jpg',
      bandcampUrl: 'https://mimirecords.bandcamp.com/album/read-error',
      meta: {
        kind: 'music',
        mediums: ['Digital'],
        editions: [{ label: { text: 'MiMi Records', url: 'https://mimirecords.bandcamp.com/' }, catalog: 'MI031' }],
        year: 2005,
      },
      tracklist: [
        { title: 'God Grnlzer' },
        { title: 'Vber' },
        { title: 'Maladie' },
        { title: 'Ob jeqt' },
        { title: 'Gleetch' },
        { title: '_ex1' },
        { title: 'Hell Rendered' },
        { title: 'Mutnt' },
      ],
      credits: {
        style: 'by',
        clauses: [
          { role: 'music', of: 'Jerome Faria' },
          { role: 'artwork', of: '[[Philip Baljeu]]' },
        ],
      },
      contributors: [
        { name: 'Philip Baljeu', url: 'https://www.instagram.com/pbalpbal/' },
      ],
    },
    {
      id: 'ect',
      title: 'ECT',
      coverImage: '/images/ect.jpg',
      externalUrl: 'https://www.monocromatica.com/netlabel/releases/tube026.htm',
      meta: {
        kind: 'music',
        mediums: ['Digital'],
        editions: [{ label: { text: 'Test Tube', url: 'https://www.monocromatica.com/netlabel/' }, catalog: 'TUBE026' }],
        year: 2005,
      },
      tracklist: [
        { title: 'Play' },
        { title: '1noise' },
        { title: 'Spctiv' },
        { title: 'Mem.' },
        { title: 'Mcruscul' },
        { title: 'Ngen' },
        { title: 'Tekrish' },
        { title: 'Sy.kic/Pa.trn' },
        { title: 'Artria' },
        { title: '1noise (ps mix)' },
      ],
      credits: {
        style: 'by',
        clauses: [
          { role: 'music', of: 'Jerome Faria' },
          { role: 'artwork', of: 'Louie de Bettencourt' },
        ],
      },
    },
    {
      id: 'offear',
      title: 'OFFEAR.EP',
      coverImage: '/images/offear.jpg',
      externalUrl: 'https://archive.org/details/enrmp040_nny_-_offear_ep',
      meta: {
        kind: 'music',
        mediums: ['Digital'],
        editions: [{ label: { text: 'Enough Records', url: 'https://enoughrecords.scene.org/' }, catalog: 'ENRMP040' }],
        year: 2004,
      },
      tracklist: [
        { title: 'Ve.Fe.Re' },
        { title: 'Zro:ne' },
        { title: 'Slid Stp' },
        { title: 'Exmatik' },
        { title: 'BL_P+' },
      ],
      credits: {
        style: 'by',
        clauses: [
          { role: 'music', of: 'Jerome Faria' },
          { role: 'artwork', of: '[[Spiraljoe]]' },
        ],
      },
      contributors: [
        { name: 'Spiraljoe', url: 'https://www.deviantart.com/spiraljoe' },
      ],
    },
  ],
};
