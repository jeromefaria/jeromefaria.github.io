import type { LiveEvent } from '@/types/live';

export const recentEvents: LiveEvent[] = [
  {
    id: 'jejum-45',
    title: 'Jejum #45',
    date: '2026-09-19',
    endDate: '2026-09-20',
    venue: { name: 'Fábrica da Criatividade', url: 'https://www.cm-castelobranco.pt/visitante/fabrica-da-criatividade/', city: 'Castelo Branco', country: 'Portugal' },
    setup: { kind: 'solo' },
    bill: [
      { text: 'Guilherme Rodrigues', url: 'https://guilhermerodrigues.bandcamp.com' },
      { text: 'Zé Maria Carreira', url: 'https://soundcloud.com/z-maria-carreira' },
      { text: 'Gweynn', url: 'https://soundcloud.com/dystopiandream_cycles' },
      { text: 'Living Room DJs' },
      { text: 'Peak Bleak' },
      { text: 'Soria', url: 'https://soriasoriasoria.bandcamp.com' },
    ],
    credit: {
      en: 'Presented by [[Colectivo Casa Amarela]].',
      pt: 'Apresentado pelo [[Colectivo Casa Amarela]].',
    },
    posters: [
      {
        src: '/images/live/jejum-45-poster-001.jpg',
        alt: { en: 'Jejum #45 poster — Colectivo Casa Amarela at Fábrica da Criatividade, Castelo Branco, 19–20 September 2026, with Guilherme Rodrigues, Zé Maria Carreira, Gweynn, Jerome Faria, Living Room DJs, Peak Bleak and Soria', pt: 'Cartaz do Jejum #45 — Colectivo Casa Amarela na Fábrica da Criatividade, Castelo Branco, 19–20 de setembro de 2026, com Guilherme Rodrigues, Zé Maria Carreira, Gweynn, Jerome Faria, Living Room DJs, Peak Bleak e Soria' },
      },
    ],
  },
  {
    id: 'festival-multiplo-2026',
    title: 'Festival Múltiplo',
    titleUrl: 'https://zaratan.pt/en/event/806',
    date: '2026-08-23',
    venue: { name: 'Zaratan', url: 'https://zaratan.pt', city: 'Lisbon', country: 'Portugal' },
    setup: { kind: 'solo' },
    bill: [
      { text: 'Água Doce' },
      { text: 'Alga' },
      { text: 'Canadian Rifles', url: 'https://canadian-rifles.bandcamp.com/' },
      { text: 'Caranguejos' },
      { text: 'Double Double' },
      { text: 'Formidolor' },
      { text: 'Joana de Sá', url: 'https://joanadesa.work/' },
      { text: 'Llama Virgem', url: 'https://llamavirgem.bandcamp.com/' },
      { text: 'Musgos', url: 'https://musgosband.com/' },
      { text: 'Open Source 3IO' },
      { text: 'Pedro PMDS', url: 'https://pmds.bandcamp.com/' },
    ],
    posters: [
      {
        src: '/images/live/festival-multiplo-2026-poster-001.jpg',
        alt: { en: 'Festival Múltiplo 2026 poster listing the full three-day lineup, Zaratan, Lisbon', pt: 'Cartaz do Festival Múltiplo 2026 com o alinhamento completo dos três dias, Zaratan, Lisboa' },
      },
      {
        src: '/images/live/festival-multiplo-2026-poster-002.jpg',
        alt: { en: 'Festival Múltiplo 2026 poster for 23 August at Zaratan, Lisbon — Jerome Faria, Formidolor, Joana de Sá, Double Double', pt: 'Cartaz do Festival Múltiplo 2026 para 23 de Agosto no Zaratan, Lisboa — Jerome Faria, Formidolor, Joana de Sá, Double Double' },
      },
    ],
    imageAlt: { en: 'Jerome Faria performing at Festival Múltiplo, Zaratan, Lisbon, 2026', pt: 'Jerome Faria a actuar no Festival Múltiplo, Zaratan, Lisboa, 2026' },
    images: [
      {
        src: '/images/live/festival-multiplo-2026-001.jpg',
        photographer: { name: 'Nuno Martins' },
      },
      {
        src: '/images/live/festival-multiplo-2026-002.jpg',
        photographer: { name: 'Nuno Martins' },
      },
      {
        src: '/images/live/festival-multiplo-2026-003.jpg',
        cover: true,
        photographer: { name: 'Nuno Martins' },
      },
      {
        src: '/images/live/festival-multiplo-2026-004.jpg',
        photographer: { name: 'Nuno Martins' },
      },
      {
        src: '/images/live/festival-multiplo-2026-005.jpg',
        photographer: { name: 'Nuno Martins' },
      },
      {
        src: '/images/live/festival-multiplo-2026-006.jpg',
        photographer: { name: 'Nuno Martins' },
      },
    ],
  },
  {
    id: 'showcase-casa-amarela',
    title: 'Showcase Casa Amarela',
    titleUrl: 'https://outra.pt/evento/showcase-casa-amarela-copo-dagua-nox-tiaavo-rebolation-all-stars-dj-set/',
    date: '2025-06-14',
    venue: { name: 'Cooperativa Mula', url: 'https://www.instagram.com/cooperativamula/', city: 'Barreiro', country: 'Portugal' },
    setup: { kind: 'project', name: { text: 'NOx' }, members: [{ text: 'Pedro Roque', url: 'https://cavernancia.bandcamp.com/' }] },
    bill: [
      { text: "Copo d'Água", url: 'https://copodagua.bandcamp.com/' },
      { text: 'TiaAvô', url: 'https://casaamarela.bandcamp.com/album/tiaav' },
      { text: 'Rebolation All-Stars' },
    ],
    credit: {
      en: 'Presented by [[OUT.RA]] and [[Colectivo Casa Amarela]].',
      pt: 'Apresentado pela [[OUT.RA]] e pelo [[Colectivo Casa Amarela]].',
    },
    imageAlt: { en: 'NOx performing at Showcase Casa Amarela, Cooperativa Mula, Barreiro, 2025', pt: 'NOx a actuar no Showcase Casa Amarela, Cooperativa Mula, Barreiro, 2025' },
    images: [
      {
        src: '/images/live/showcase-casa-amarela-001.jpg',
        photographer: { name: 'Ricardo Almeida' },
      },
      {
        src: '/images/live/showcase-casa-amarela-002.jpg',
        cover: true,
        photographer: { name: 'Ricardo Almeida' },
      },
      {
        src: '/images/live/showcase-casa-amarela-003.jpg',
        photographer: { name: 'Ricardo Almeida' },
      },
      {
        src: '/images/live/showcase-casa-amarela-004.jpg',
        photographer: { name: 'Ricardo Almeida' },
      },
      {
        src: '/images/live/showcase-casa-amarela-005.jpg',
        photographer: { name: 'Ricardo Almeida' },
      },
      {
        src: '/images/live/showcase-casa-amarela-006.jpg',
        photographer: { name: 'Ricardo Almeida' },
      },
      {
        src: '/images/live/showcase-casa-amarela-007.jpg',
        photographer: { name: 'Ricardo Almeida' },
      },
      {
        src: '/images/live/showcase-casa-amarela-008.jpg',
        photographer: { name: 'Ricardo Almeida' },
      },
      {
        src: '/images/live/showcase-casa-amarela-010.jpg',
        photographer: { name: 'Ricardo Almeida' },
      },
      {
        src: '/images/live/showcase-casa-amarela-011.jpg',
        photographer: { name: 'Ricardo Almeida' },
      },
      {
        src: '/images/live/showcase-casa-amarela-012.jpg',
        photographer: { name: 'Ricardo Almeida' },
      },
    ],
    posters: [
      {
        src: '/images/live/showcase-casa-amarela-poster-001.jpg',
        alt: { en: 'Showcase Casa Amarela poster — Cooperativa Mula, Barreiro, 14 June 2025 — NOx, Copo d\'Água, TiaAvô, Rebolation All-Stars DJ set', pt: 'Cartaz do Showcase Casa Amarela — Cooperativa Mula, Barreiro, 14 de Junho de 2025 — NOx, Copo d\'Água, TiaAvô, DJ set Rebolation All-Stars' },
      },
    ],
  },
  {
    id: 'fim-de-emissao-45',
    title: 'Fim de Emissão #45',
    date: '2025-01-17',
    venue: { name: 'Desterro', city: 'Lisbon', country: 'Portugal' },
    setup: { kind: 'solo' },
    bill: [
      { text: 'Ai Feith', url: 'https://aifeith.bandcamp.com/' },
      { text: 'W.T.V.R' },
    ],
    credit: {
      en: 'Presented by [[Colectivo Casa Amarela]].',
      pt: 'Apresentado pelo [[Colectivo Casa Amarela]].',
    },
    imageAlt: { en: 'Jerome Faria performing at Fim de Emissão #45, Desterro, Lisbon, 2025', pt: 'Jerome Faria a actuar no Fim de Emissão #45, Desterro, Lisboa, 2025' },
    images: [
      {
        src: '/images/live/fim-de-emissao-45-001.jpg',
        photographer: { name: 'Pedro Roque' },
      },
      {
        src: '/images/live/fim-de-emissao-45-002.jpg',
        photographer: { name: 'Pedro Roque' },
      },
      {
        src: '/images/live/fim-de-emissao-45-003.jpg',
        photographer: { name: 'Pedro Roque' },
      },
      {
        src: '/images/live/fim-de-emissao-45-004.jpg',
        photographer: { name: 'Pedro Roque' },
      },
      {
        src: '/images/live/fim-de-emissao-45-005.jpg',
        cover: true,
        thumb: { position: 'center 85%' },
        photographer: { name: 'Pedro Roque' },
      },
      {
        src: '/images/live/fim-de-emissao-45-006.jpg',
        photographer: { name: 'Pedro Roque' },
      },
      {
        src: '/images/live/fim-de-emissao-45-007.jpg',
        photographer: { name: 'Pedro Roque' },
      },
      {
        src: '/images/live/fim-de-emissao-45-008.jpg',
        photographer: { name: 'Pedro Roque' },
      },
    ],
  },
  {
    id: 'cca-no-desterro-august',
    title: 'CCA no Desterro',
    date: '2024-08-10',
    venue: { name: 'Desterro', city: 'Lisbon', country: 'Portugal' },
    setup: { kind: 'solo' },
    bill: [
      { text: 'Moss Kissing', url: 'https://mosskissingmusic.bandcamp.com/' },
      { text: 'Rui Wentacid', suffix: '(DJ set)' },
    ],
    credit: {
      en: 'Presented by [[Colectivo Casa Amarela]].',
      pt: 'Apresentado pelo [[Colectivo Casa Amarela]].',
    },
  },
  {
    id: 'cca-no-desterro',
    title: 'CCA no Desterro',
    date: '2024-05-02',
    venue: { name: 'Desterro', city: 'Lisbon', country: 'Portugal' },
    setup: { kind: 'project', name: { text: 'NOx' }, members: [{ text: 'Pedro Roque', url: 'https://cavernancia.bandcamp.com/' }] },
    bill: [
      { text: "Copo d'Água", url: 'https://copodagua.bandcamp.com/' },
      { text: 'DJ Privilégio', url: 'https://soundcloud.com/djprivilegio' },
      { text: "Gallo'84", url: 'https://casaamarela.bandcamp.com/album/shimano' },
    ],
    credit: {
      en: 'Presented by [[Colectivo Casa Amarela]].',
      pt: 'Apresentado pelo [[Colectivo Casa Amarela]].',
    },
    imageAlt: { en: 'NOx performing at CCA no Desterro, Desterro, Lisbon, 2024', pt: 'NOx a actuar em CCA no Desterro, Desterro, Lisboa, 2024' },
    images: [
      {
        src: '/images/live/cca-no-desterro-001.jpg',
        photographer: { name: 'Daniela Jácome' },
      },
      {
        src: '/images/live/cca-no-desterro-002.jpg',
        photographer: { name: 'Daniela Jácome' },
      },
      {
        src: '/images/live/cca-no-desterro-003.jpg',
        photographer: { name: 'Daniela Jácome' },
      },
      {
        src: '/images/live/cca-no-desterro-004.jpg',
        photographer: { name: 'Daniela Jácome' },
      },
      {
        src: '/images/live/cca-no-desterro-005.jpg',
        photographer: { name: 'Daniela Jácome' },
      },
      {
        src: '/images/live/cca-no-desterro-006.jpg',
        photographer: { name: 'Pedro Jafuno' },
      },
      {
        src: '/images/live/cca-no-desterro-007.jpg',
        photographer: { name: 'Pedro Jafuno' },
      },
      {
        src: '/images/live/cca-no-desterro-008.jpg',
        photographer: { name: 'Pedro Jafuno' },
      },
      {
        src: '/images/live/cca-no-desterro-009.jpg',
        photographer: { name: 'Pedro Jafuno' },
      },
      {
        src: '/images/live/cca-no-desterro-010.jpg',
        photographer: { name: 'Pedro Jafuno' },
      },
      {
        src: '/images/live/cca-no-desterro-011.jpg',
        photographer: { name: 'Pedro Jafuno' },
      },
      {
        src: '/images/live/cca-no-desterro-012.jpg',
        photographer: { name: 'Pedro Jafuno' },
      },
      {
        src: '/images/live/cca-no-desterro-013.jpg',
        photographer: { name: 'Pedro Jafuno' },
      },
      {
        src: '/images/live/cca-no-desterro-014.jpg',
        photographer: { name: 'Pedro Jafuno' },
      },
      {
        src: '/images/live/cca-no-desterro-015.jpg',
        cover: true,
        photographer: { name: 'Pedro Jafuno' },
      },
    ],
    videos: [
      {
        url: 'https://www.youtube-nocookie.com/embed/ad8q90MI6Dc',
        platform: 'youtube',
        title: { en: 'NOx performing at CCA no Desterro, Desterro, Lisbon, 2024', pt: 'NOx a actuar em CCA no Desterro, Desterro, Lisboa, 2024' },
        author: { name: 'NOx', url: 'https://www.youtube.com/@noxexposure' },
      },
    ],
  },
  {
    id: 'amess-teatro-baltazar-dias',
    title: { en: 'Performance with Amess', pt: 'Actuação com Amess' },
    date: '2022-07-02',
    venue: { name: 'Teatro Municipal Baltazar Dias', city: 'Funchal', country: 'Portugal' },
    setup: { kind: 'band', band: { text: 'Amess' } },
    imageAlt: { en: 'Jerome Faria performing with Amess at Teatro Municipal Baltazar Dias, Funchal, 2022', pt: 'Jerome Faria a actuar com Amess no Teatro Municipal Baltazar Dias, Funchal, 2022' },
    images: [
      {
        src: '/images/live/amess-teatro-baltazar-dias-001.jpg',
        photographer: { name: 'Óscar Silva' },
      },
      {
        src: '/images/live/amess-teatro-baltazar-dias-002.jpg',
        cover: true,
        photographer: { name: 'Óscar Silva' },
      },
      {
        src: '/images/live/amess-teatro-baltazar-dias-003.jpg',
        photographer: { name: 'Óscar Silva' },
      },
    ],
  },
  {
    id: 'amess-museu-franco',
    title: { en: 'Performance with Amess', pt: 'Actuação com Amess' },
    date: '2022-03-18',
    venue: { name: 'Museu Henrique e Francisco Franco', url: 'https://museus.madeira.gov.pt/DetalhesMuseu?museumId=3', city: 'Funchal', country: 'Portugal' },
    setup: { kind: 'band', band: { text: 'Amess' } },
    imageAlt: { en: 'Jerome Faria performing with Amess at Museu Henrique e Francisco Franco, Funchal, 2022', pt: 'Jerome Faria a actuar com Amess no Museu Henrique e Francisco Franco, Funchal, 2022' },
    images: [
      {
        src: '/images/live/amess-museu-franco-001.jpg',
        photographer: { name: 'Miguel Apolinário' },
      },
      {
        src: '/images/live/amess-museu-franco-002.jpg',
        photographer: { name: 'Miguel Apolinário' },
      },
      {
        src: '/images/live/amess-museu-franco-003.jpg',
        cover: true,
        photographer: { name: 'Miguel Apolinário' },
      },
      {
        src: '/images/live/amess-museu-franco-004.jpg',
        photographer: { name: 'Miguel Apolinário' },
      },
      {
        src: '/images/live/amess-museu-franco-005.jpg',
        photographer: { name: 'Miguel Apolinário' },
      },
    ],
  },
  {
    id: 'jejum-11',
    title: 'Jejum #11',
    date: '2022-03-05',
    venue: { name: 'Rua das Gaivotas 6', url: 'https://ruadasgaivotas6.pt/', city: 'Lisbon', country: 'Portugal' },
    setup: { kind: 'solo' },
    credit: {
      en: 'Presented by [[Colectivo Casa Amarela]].',
      pt: 'Apresentado pelo [[Colectivo Casa Amarela]].',
    },
    imageAlt: { en: 'Jerome Faria performing at Jejum #11, Rua das Gaivotas 6, Lisbon, 2022', pt: 'Jerome Faria a actuar no Jejum #11, Rua das Gaivotas 6, Lisboa, 2022' },
    images: [
      {
        src: '/images/live/jejum-11-001.jpg',
        photographer: { name: 'Pedro Jafuno' },
      },
      {
        src: '/images/live/jejum-11-002.jpg',
        photographer: { name: 'Pedro Jafuno' },
      },
      {
        src: '/images/live/jejum-11-003.jpg',
        photographer: { name: 'Pedro Jafuno' },
      },
      {
        src: '/images/live/jejum-11-004.jpg',
        photographer: { name: 'Pedro Jafuno' },
      },
      {
        src: '/images/live/jejum-11-005.jpg',
        photographer: { name: 'Pedro Jafuno' },
      },
      {
        src: '/images/live/jejum-11-006.jpg',
        photographer: { name: 'Pedro Jafuno' },
      },
      {
        src: '/images/live/jejum-11-007.jpg',
        photographer: { name: 'Pedro Jafuno' },
      },
      {
        src: '/images/live/jejum-11-008.jpg',
        photographer: { name: 'Pedro Jafuno' },
      },
      {
        src: '/images/live/jejum-11-009.jpg',
        photographer: { name: 'Pedro Jafuno' },
      },
      {
        src: '/images/live/jejum-11-010.jpg',
        photographer: { name: 'Pedro Jafuno' },
      },
      {
        src: '/images/live/jejum-11-011.jpg',
        photographer: { name: 'Pedro Jafuno' },
      },
      {
        src: '/images/live/jejum-11-013.jpg',
        photographer: { name: 'Pedro Jafuno' },
      },
      {
        src: '/images/live/jejum-11-014.jpg',
        cover: true,
        photographer: { name: 'Pedro Jafuno' },
      },
      {
        src: '/images/live/jejum-11-015.jpg',
        photographer: { name: 'Pedro Jafuno' },
      },
    ],
  },
  {
    id: 'aragao-cartaxo',
    language: 'pt-PT',
    title: 'ARAGÃO',
    titleUrl: '/works#aragao',
    date: '2021-10-23',
    venue: { name: 'Centro Cultural do Cartaxo', url: 'https://www.cm-cartaxo.pt/servicos-municipais/cultura/equipamentos-culturais/item/49-centro-cultural-municipio-do-cartaxo', city: 'Cartaxo', country: 'Portugal' },
    setup: { kind: 'solo' },
    format: { kind: 'theatre' },
  },
  {
    id: 'nariz-entupido',
    title: '30 anos SPH / 20 anos Thisco',
    date: '2021-10-22',
    venue: { name: 'SMUP', url: 'https://www.smup.pt/', city: 'Parede', country: 'Portugal' },
    setup: { kind: 'duo', with: { text: 'CAVERNANCIA', url: 'https://cavernancia.bandcamp.com/' } },
    bill: [
      { text: 'António Caramelo', url: 'https://www.facebook.com/makearevolutione' },
      { text: 'Ghent', url: 'https://ghentelectronica.bandcamp.com/' },
      { text: 'Manuel Mota' },
      { text: 'Novo Major', suffix: '(DJ)' },
      { text: 'OndaXoque', url: 'https://ondaxoque.bandcamp.com/' },
      { text: 'shhh…', url: 'https://shhh-music.bandcamp.com/' },
      [
        { text: 'Violeta Lisboa', url: 'https://soundcloud.com/violeta-lisboa' },
        { text: 'Miguel Sá', url: 'https://soundcloud.com/miguel-sa', suffix: '(DJ)' },
      ],
      { text: 'Whalt Thisney', url: 'https://walthisney.bandcamp.com/' },
    ],
    credit: {
      en: 'Presented by [[Nariz Entupido]] with [[THISCO]] and SPH.',
      pt: 'Apresentado pela [[Nariz Entupido]] com a [[THISCO]] e a SPH.',
    },
    imageAlt: { en: 'Jerome Faria and CAVERNANCIA performing at SMUP, Parede, 2021', pt: 'Jerome Faria e CAVERNANCIA a actuar na SMUP, Parede, 2021' },
    images: [
      {
        src: '/images/live/nariz-entupido-001.jpg',
        photographer: { name: 'Ricardo Nogueira' },
      },
      {
        src: '/images/live/nariz-entupido-002.jpg',
        photographer: { name: 'Ricardo Nogueira' },
      },
      {
        src: '/images/live/nariz-entupido-003.jpg',
        cover: true,
        thumb: { scale: 1.2 },
        photographer: { name: 'Ricardo Nogueira' },
      },
      {
        src: '/images/live/nariz-entupido-004.jpg',
        photographer: { name: 'Ricardo Nogueira' },
      },
    ],
    posters: [
      {
        src: '/images/live/nariz-entupido-poster-001.jpg',
        alt: { en: 'Poster for 30 anos SPH / 20 anos Thisco — SMUP, Parede, 22–23 October 2021; CAVERNANCIA + Jerome Faria', pt: 'Cartaz de 30 anos SPH / 20 anos Thisco — SMUP, Parede, 22–23 de Outubro de 2021; CAVERNANCIA + Jerome Faria' },
        artist: { name: 'André Lemos', url: 'https://www.chilicomcarne.com/index.php/autores/gallery/18' },
      },
    ],
  },
  {
    id: 'aragao-funchal',
    language: 'pt-PT',
    title: 'ARAGÃO',
    titleUrl: '/works#aragao',
    date: '2021-09-22',
    endDate: '2021-09-25',
    venue: { name: 'Teatro Municipal Baltazar Dias', city: 'Funchal', country: 'Portugal' },
    setup: { kind: 'solo' },
    format: { kind: 'theatre' },
    imageAlt: { en: 'Aragão theatre production at Teatro Municipal Baltazar Dias, Funchal, 2021', pt: 'Produção teatral Aragão no Teatro Municipal Baltazar Dias, Funchal, 2021' },
    images: [
      {
        src: '/images/live/aragao-funchal-002.jpg',
        thumb: { position: 'center 59%' },
      },
      {
        src: '/images/live/aragao-funchal-001.jpg',
        photographer: { name: 'Mário André Pereira' },
      },
    ],
    posters: [
      {
        src: '/images/live/aragao-funchal-poster-001.jpg',
        alt: { en: 'Aragão poster — Teatro Municipal Baltazar Dias, Funchal, 22–25 September 2021; text by Rui Zink, staged by Sara Gonçalves', pt: 'Cartaz de Aragão — Teatro Municipal Baltazar Dias, Funchal, 22–25 de Setembro de 2021; texto de Rui Zink, encenação de Sara Gonçalves' },
      },
      {
        src: '/images/live/aragao-funchal-poster-002.jpg',
        alt: { en: 'Aragão programme spread — synopsis and technical credits, Teatro Municipal Baltazar Dias, Funchal, 2021', pt: 'Folha de sala de Aragão — sinopse e ficha técnica, Teatro Municipal Baltazar Dias, Funchal, 2021' },
      },
    ],
    videos: [
      {
        url: 'https://www.youtube-nocookie.com/embed/6LpRJBS7pzg',
        platform: 'youtube',
        title: { en: 'Aragão at Teatro Municipal Baltazar Dias, Funchal, 2021', pt: 'Aragão no Teatro Municipal Baltazar Dias, Funchal, 2021' },
        author: { name: 'TRANSLOCAL Culturas Contemporâneas Locais e Urbanas' },
      },
    ],
  },
  {
    id: 'reviralho',
    title: 'Reviralho',
    date: '2021-08-20',
    venue: { name: 'Cais do Carvão', city: 'Funchal', country: 'Portugal' },
    setup: { kind: 'band', band: { text: 'Amess' } },
  },
];
