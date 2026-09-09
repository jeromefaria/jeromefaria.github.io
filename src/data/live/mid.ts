import type { LiveEvent } from '@/types/live';

export const midEvents: LiveEvent[] = [
  {
    id: 'heineken-series',
    title: 'Heineken Series',
    date: '2015-09-18',
    venue: { name: 'Musicbox', url: 'https://www.musicboxlisboa.com/', city: 'Lisbon', country: 'Portugal' },
    setup: { kind: 'solo' },
    bill: [
      { text: 'William Basinski', url: 'https://www.mmlxii.com/' },
      { text: 'Mr. Herbert Quain', url: 'https://zigurartists.bandcamp.com/album/forgetting-is-a-liability' },
      { text: 'Cruz', url: 'https://www.viberate.com/artist/cruz-767/' },
    ],
    imageAlt: { en: 'Jerome Faria performing at Heineken Series, Musicbox, Lisbon, 2015', pt: 'Jerome Faria a actuar na Heineken Series, Musicbox, Lisboa, 2015' },
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
    title: 'Fica na Cidade',
    titleUrl: 'https://www.visitfunchal.pt/pt/todos-os-eventos/280-fica-na-cidade.html',
    date: '2015-06-05',
    venue: { name: 'Praça de Colombo', city: 'Funchal', country: 'Portugal' },
    setup: { kind: 'solo' },
    bill: [
      { text: 'Tren Go! Sound System', url: 'https://trengosoundsystem.bandcamp.com/' },
    ],
    imageAlt: { en: 'Jerome Faria performing at Fica na Cidade, Praça de Colombo, Funchal, 2015', pt: 'Jerome Faria a actuar no Fica na Cidade, Praça de Colombo, Funchal, 2015' },
    images: [
      {
        src: '/images/live/fica-na-cidade-001.jpg',
        photographer: { name: 'Fica na Cidade' },
      },
    ],
  },
  {
    id: 'cognitivopolis',
    title: 'Cognitivopolis',
    date: '2013-11-15',
    venue: { name: 'Estalagem da Ponta do Sol', url: 'https://www.pontadosol.com/', city: 'Ponta do Sol', country: 'Portugal' },
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
      en: 'Presented by <a href="https://www.urbanistas.pt">Urbanistas</a>.',
      pt: 'Apresentado pelos <a href="https://www.urbanistas.pt">Urbanistas</a>.',
    },
  },
  {
    id: 'caligari-live-3',
    title: 'Concertos L: The Cabinet of Dr. Caligari',
    titleUrl: 'https://www.pontadosol.com/l-concerts',
    date: '2013-10-26',
    venue: { name: 'Estalagem da Ponta do Sol', url: 'https://www.pontadosol.com/', city: 'Ponta do Sol', country: 'Portugal' },
    setup: { kind: 'duo', with: { text: 'Nuno Filipe', suffix: '(piano)' } },
    format: { kind: 'filmScore', film: { en: "Robert Wiene's 1920 expressionist silent film", pt: 'o filme mudo expressionista de Robert Wiene (1920)' } },
  },
  {
    id: 'caligari-live-2',
    title: 'The Cabinet of Dr. Caligari',
    date: '2013-09-13',
    venue: { name: 'Scat Music Club', city: 'Funchal', country: 'Portugal' },
    setup: { kind: 'duo', with: { text: 'Nuno Filipe', suffix: '(piano)' } },
    format: { kind: 'filmScore', film: { en: "Robert Wiene's 1920 expressionist silent film", pt: 'o filme mudo expressionista de Robert Wiene (1920)' } },
    imageAlt: { en: 'Jerome Faria performing The Cabinet of Dr. Caligari at Scat Music Club, Funchal, 2013', pt: 'Jerome Faria a interpretar The Cabinet of Dr. Caligari no Scat Music Club, Funchal, 2013' },
    images: [
      {
        src: '/images/live/caligari-live-2-001.jpg',
        photographer: { name: 'Pedro Jafuno' },
      },
    ],
  },
  {
    id: 'caligari-live',
    title: 'Cidades Electrónicas: The Cabinet of Dr. Caligari',
    date: '2013-05-11',
    venue: { name: 'Casa das Mudas', url: 'https://museus.madeira.gov.pt/DetalhesMuseu?museumId=1', city: 'Calheta', country: 'Portugal' },
    setup: { kind: 'duo', with: { text: 'Nuno Filipe', suffix: '(piano)' } },
    format: { kind: 'filmScore', film: { en: "Robert Wiene's 1920 expressionist silent film", pt: 'o filme mudo expressionista de Robert Wiene (1920)' }, premiere: true },
    imageAlt: { en: 'Jerome Faria performing at Cidades Electrónicas: The Cabinet of Dr. Caligari, Casa das Mudas, Calheta, 2013', pt: 'Jerome Faria a actuar em Cidades Electrónicas: The Cabinet of Dr. Caligari, Casa das Mudas, Calheta, 2013' },
    images: [
      {
        src: '/images/live/caligari-cidades-2013-001.jpg',
      },
    ],
  },
  {
    id: 'cine-qua-non',
    date: '2012-10-27',
    title: 'Cine Qua Non',
    venue: { name: 'Estalagem da Ponta do Sol', url: 'https://www.pontadosol.com/', city: 'Ponta do Sol', country: 'Portugal' },
    setup: { kind: 'ensemble', name: { en: 'Improvisation collective', pt: 'Colectivo de improvisação' } },
    note: {
      en: 'Electronics, piano (<a href="https://nunoandtheend.bandcamp.com/">Nuno Filipe</a>), percussion (<a href="https://madeirajazzcollective.bandcamp.com/">Jorge Maggiore</a>) and visuals (Filipe Ferraz).',
      pt: 'Electrónica, piano (<a href="https://nunoandtheend.bandcamp.com/">Nuno Filipe</a>), percussão (<a href="https://madeirajazzcollective.bandcamp.com/">Jorge Maggiore</a>) e visuais (Filipe Ferraz).',
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
