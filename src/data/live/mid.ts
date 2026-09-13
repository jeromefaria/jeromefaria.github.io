import type { LiveEvent } from '@/types/live';

export const midEvents: LiveEvent[] = [
  {
    id: 'heineken-series',
    eventType: ['series'],
    title: 'Heineken Series',
    date: '2015-09-18',
    venue: { name: 'Musicbox', url: 'https://www.musicboxlisboa.com/', city: 'Lisbon', country: 'Portugal' },
    setup: { kind: 'solo' },
    bill: [
      { text: 'William Basinski', url: 'https://www.mmlxii.com/' },
      { text: 'Mr. Herbert Quain', url: 'https://zigurartists.bandcamp.com/album/forgetting-is-a-liability' },
      { text: 'Cruz', url: 'https://www.viberate.com/artist/cruz-767/' },
    ],
    images: [
      {
        src: '/images/live/heineken-series-001.jpg',
        photographer: { name: 'Pedro Jafuno' },
      },
      {
        src: '/images/live/heineken-series-002.jpg',
        photographer: { name: 'Pedro Jafuno' },
      },
      {
        src: '/images/live/heineken-series-003.jpg',
        photographer: { name: 'Pedro Jafuno' },
      },
      {
        src: '/images/live/heineken-series-004.jpg',
        photographer: { name: 'Pedro Jafuno' },
      },
      {
        src: '/images/live/heineken-series-005.jpg',
        photographer: { name: 'Pedro Jafuno' },
      },
      {
        src: '/images/live/heineken-series-006.jpg',
        cover: true,
        photographer: { name: 'Pedro Jafuno' },
      },
      {
        src: '/images/live/heineken-series-007.jpg',
        photographer: { name: 'Pedro Jafuno' },
      },
      {
        src: '/images/live/heineken-series-008.jpg',
        photographer: { name: 'Pedro Jafuno' },
      },
      {
        src: '/images/live/heineken-series-009.jpg',
        photographer: { name: 'Pedro Jafuno' },
      },
      {
        src: '/images/live/heineken-series-010.jpg',
        photographer: { name: 'Pedro Jafuno' },
      },
    ],
  },
  {
    id: 'fica-na-cidade',
    eventType: ['open-air'],
    title: 'Fica na Cidade',
    titleUrl: 'https://www.visitfunchal.pt/pt/todos-os-eventos/280-fica-na-cidade.html',
    date: '2015-06-05',
    venue: { name: 'Praça de Colombo', city: 'Funchal', country: 'Portugal' },
    setup: { kind: 'solo' },
    bill: [
      { text: 'Tren Go! Sound System', url: 'https://trengosoundsystem.bandcamp.com/' },
    ],
    images: [
      {
        src: '/images/live/fica-na-cidade-001.jpg',
        photographer: { name: 'Fica na Cidade' },
      },
    ],
  },
  {
    id: 'cognitivopolis',
    eventType: ['festival'],
    title: 'Cognitivopolis',
    date: '2013-11-15',
    venue: { name: 'Estalagem da Ponta do Sol', city: 'Ponta do Sol', country: 'Portugal' },
    setup: { kind: 'solo' },
    bill: [
      { text: 'Massimo Banzi', url: 'https://massimobanzi.com/', suffix: '(Arduino)' },
      { text: 'David Rowan', url: 'https://davidrowan.com/', suffix: '(Wired UK)' },
      { text: 'Gian Giudice', suffix: '(CERN)' },
    ],
    note: {
      en: 'Festival about creativity, technology and science.',
      pt: 'Festival sobre criatividade, tecnologia e ciência.',
    },
    credit: {
      en: 'Presented by [[Urbanistas]].',
      pt: 'Apresentado pelos [[Urbanistas]].',
    },
  },
  {
    id: 'caligari-live-3',
    title: 'Concertos L: The Cabinet of Dr. Caligari',
    titleUrl: 'https://www.pontadosol.com/l-concerts',
    date: '2013-10-26',
    venue: { name: 'Estalagem da Ponta do Sol', city: 'Ponta do Sol', country: 'Portugal' },
    setup: { kind: 'duo', with: { text: 'Nuno Filipe', suffix: '(piano)' } },
    format: { kind: 'filmScore', film: { en: "Robert Wiene's 1920 expressionist silent film", pt: 'o filme mudo expressionista de Robert Wiene (1920)' } },
  },
  {
    id: 'caligari-live-2',
    altLocation: {
      subject: {
        en: 'Jerome Faria performing The Cabinet of Dr. Caligari',
        pt: 'Jerome Faria a interpretar The Cabinet of Dr. Caligari',
      },
      onVenue: true,
    },
    title: 'The Cabinet of Dr. Caligari',
    date: '2013-09-13',
    venue: { name: 'Scat Music Club', city: 'Funchal', country: 'Portugal' },
    setup: { kind: 'duo', with: { text: 'Nuno Filipe', suffix: '(piano)' } },
    format: { kind: 'filmScore', film: { en: "Robert Wiene's 1920 expressionist silent film", pt: 'o filme mudo expressionista de Robert Wiene (1920)' } },
    images: [
      {
        src: '/images/live/caligari-live-2-001.jpg',
        thumb: { position: '65% center' },
        photographer: { name: 'Pedro Jafuno' },
      },
    ],
  },
  {
    id: 'caligari-live',
    title: 'Cidades Electrónicas: The Cabinet of Dr. Caligari',
    date: '2013-05-11',
    venue: { name: 'Casa das Mudas', city: 'Calheta', country: 'Portugal' },
    setup: { kind: 'duo', with: { text: 'Nuno Filipe', suffix: '(piano)' } },
    format: { kind: 'filmScore', film: { en: "Robert Wiene's 1920 expressionist silent film", pt: 'o filme mudo expressionista de Robert Wiene (1920)' }, premiere: true },
    images: [
      {
        src: '/images/live/caligari-cidades-2013-001.jpg',
        cardThumb: { position: 'center 97%' },
      },
    ],
  },
  {
    id: 'cine-qua-non',
    eventType: ['series'],
    date: '2012-10-27',
    title: 'Cine Qua Non',
    venue: { name: 'Estalagem da Ponta do Sol', url: 'https://www.pontadosol.com/', city: 'Ponta do Sol', country: 'Portugal' },
    setup: { kind: 'ensemble', name: { en: 'Improvisation collective', pt: 'Colectivo de improvisação' } },
    note: {
      en: 'Electronics, piano ([[Nuno Filipe]]), percussion ([[Jorge Maggiore]]) and visuals (Filipe Ferraz).',
      pt: 'Electrónica, piano ([[Nuno Filipe]]), percussão ([[Jorge Maggiore]]) e visuais (Filipe Ferraz).',
    },
    credit: {
      en: 'Part of [[Concertos L]].',
      pt: 'Integrado nos [[Concertos L]].',
    },
    videos: [
      {
        url: 'https://www.youtube-nocookie.com/embed/41vx80KyONA',
        platform: 'youtube',
        title: { en: 'Cine Qua Non performance at Estalagem da Ponta do Sol, 2012', pt: 'Cine Qua Non ao vivo na Estalagem da Ponta do Sol, 2012' },
        author: { name: 'The Noise Spot', url: 'https://www.youtube.com/@thenoisespot' },
      },
    ],
  },
];
