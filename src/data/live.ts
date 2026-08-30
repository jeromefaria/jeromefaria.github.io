import type { LiveData, LiveEvent, LiveYearSection } from '@/types/live';

export const liveEvents: LiveEvent[] = [
  {
    id: 'tbc-2026-09-19',
    title: 'TBC',
    date: '2026-09-19',
    venue: { country: 'Portugal' },
    setup: { kind: 'solo' },
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
      { text: 'Musgos' },
      { text: 'Open Source 3IO' },
      { text: 'Pedro PMDS' },
    ],
    posters: [
      {
        src: '/images/live/festival-multiplo-2026-poster-001.jpg',
        alt: 'Festival Múltiplo 2026 poster listing the full three-day lineup, Zaratan, Lisbon',
      },
      {
        src: '/images/live/festival-multiplo-2026-poster-002.jpg',
        alt: 'Festival Múltiplo 2026 poster for 23 August at Zaratan, Lisbon — Jerome Faria, Formidolor, Joana de Sá, Double Double',
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
      { text: 'TiaAvô' },
      { text: 'Rebolation All-Stars' },
    ],
    imageAlt: 'NOx performing at Showcase Casa Amarela, Cooperativa Mula, Barreiro, 2025',
    images: [
      {
        src: '/images/live/showcase-casa-amarela-001.jpg',
        photographer: { name: 'Ricardo Almeida', url: 'https://www.instagram.com/ricardojosealmeida/' },
      },
      {
        src: '/images/live/showcase-casa-amarela-002.jpg',
        photographer: { name: 'Ricardo Almeida', url: 'https://www.instagram.com/ricardojosealmeida/' },
      },
      {
        src: '/images/live/showcase-casa-amarela-003.jpg',
        photographer: { name: 'Ricardo Almeida', url: 'https://www.instagram.com/ricardojosealmeida/' },
      },
      {
        src: '/images/live/showcase-casa-amarela-004.jpg',
        photographer: { name: 'Ricardo Almeida', url: 'https://www.instagram.com/ricardojosealmeida/' },
      },
      {
        src: '/images/live/showcase-casa-amarela-005.jpg',
        photographer: { name: 'Ricardo Almeida', url: 'https://www.instagram.com/ricardojosealmeida/' },
      },
      {
        src: '/images/live/showcase-casa-amarela-006.jpg',
        photographer: { name: 'Ricardo Almeida', url: 'https://www.instagram.com/ricardojosealmeida/' },
      },
      {
        src: '/images/live/showcase-casa-amarela-007.jpg',
        photographer: { name: 'Ricardo Almeida', url: 'https://www.instagram.com/ricardojosealmeida/' },
      },
      {
        src: '/images/live/showcase-casa-amarela-008.jpg',
        photographer: { name: 'Ricardo Almeida', url: 'https://www.instagram.com/ricardojosealmeida/' },
      },
      {
        src: '/images/live/showcase-casa-amarela-010.jpg',
        photographer: { name: 'Ricardo Almeida', url: 'https://www.instagram.com/ricardojosealmeida/' },
      },
      {
        src: '/images/live/showcase-casa-amarela-011.jpg',
        photographer: { name: 'Ricardo Almeida', url: 'https://www.instagram.com/ricardojosealmeida/' },
      },
      {
        src: '/images/live/showcase-casa-amarela-012.jpg',
        photographer: { name: 'Ricardo Almeida', url: 'https://www.instagram.com/ricardojosealmeida/' },
      },
    ],
    posters: [
      {
        src: '/images/live/showcase-casa-amarela-poster-001.jpg',
        alt: 'Showcase Casa Amarela poster — Cooperativa Mula, Barreiro, 14 June 2025 — NOx, Copo d\'Água, TiaAvô, Rebolation All-Stars DJ set',
      },
    ],
  },
  {
    id: 'fim-de-emissao-45',
    title: 'Fim de Emissão #45',
    date: '2025-01-17',
    venue: { name: 'Desterro', url: 'https://darc.pt', city: 'Lisbon', country: 'Portugal' },
    setup: { kind: 'solo' },
    bill: [
      { text: 'Ai Feith' },
      { text: 'W.T.V.R' },
    ],
    imageAlt: 'Jerome Faria performing at Fim de Emissão #45, Desterro, Lisbon, 2025',
    images: [
      {
        src: '/images/live/fim-de-emissao-45-001.jpg',
        photographer: { name: 'Pedro Roque', url: 'https://eyesofmadness-photography.blogspot.com/' },
      },
      {
        src: '/images/live/fim-de-emissao-45-002.jpg',
        photographer: { name: 'Pedro Roque', url: 'https://eyesofmadness-photography.blogspot.com/' },
      },
      {
        src: '/images/live/fim-de-emissao-45-003.jpg',
        photographer: { name: 'Pedro Roque', url: 'https://eyesofmadness-photography.blogspot.com/' },
      },
      {
        src: '/images/live/fim-de-emissao-45-004.jpg',
        photographer: { name: 'Pedro Roque', url: 'https://eyesofmadness-photography.blogspot.com/' },
      },
      {
        src: '/images/live/fim-de-emissao-45-005.jpg',
        photographer: { name: 'Pedro Roque', url: 'https://eyesofmadness-photography.blogspot.com/' },
      },
      {
        src: '/images/live/fim-de-emissao-45-006.jpg',
        photographer: { name: 'Pedro Roque', url: 'https://eyesofmadness-photography.blogspot.com/' },
      },
      {
        src: '/images/live/fim-de-emissao-45-007.jpg',
        photographer: { name: 'Pedro Roque', url: 'https://eyesofmadness-photography.blogspot.com/' },
      },
      {
        src: '/images/live/fim-de-emissao-45-008.jpg',
        photographer: { name: 'Pedro Roque', url: 'https://eyesofmadness-photography.blogspot.com/' },
      },
    ],
  },
  {
    id: 'cca-no-desterro-august',
    title: 'CCA no Desterro',
    date: '2024-08-10',
    venue: { name: 'Desterro', url: 'https://darc.pt', city: 'Lisbon', country: 'Portugal' },
    setup: { kind: 'solo' },
    bill: [
      { text: 'Moss Kissing', url: 'https://mosskissingmusic.bandcamp.com/' },
      { text: 'Rui Wentacid', suffix: '(DJ set)' },
    ],
  },
  {
    id: 'cca-no-desterro',
    title: 'CCA no Desterro',
    date: '2024-05-02',
    venue: { name: 'Desterro', url: 'https://darc.pt', city: 'Lisbon', country: 'Portugal' },
    setup: { kind: 'project', name: { text: 'NOx' }, members: [{ text: 'Pedro Roque', url: 'https://cavernancia.bandcamp.com/' }] },
    bill: [
      { text: "Copo d'Água", url: 'https://copodagua.bandcamp.com/' },
      { text: 'DJ Privilégio', url: 'https://soundcloud.com/djprivilegio' },
      { text: "Gallo'84", url: 'https://casaamarela.bandcamp.com/album/shimano' },
    ],
    imageAlt: 'NOx performing at CCA no Desterro, Desterro, Lisbon, 2024',
    images: [
      {
        src: '/images/live/cca-no-desterro-001.jpg',
        photographer: { name: 'Daniela Jácome', url: 'https://www.instagram.com/danielajacomeph/' },
      },
      {
        src: '/images/live/cca-no-desterro-002.jpg',
        photographer: { name: 'Daniela Jácome', url: 'https://www.instagram.com/danielajacomeph/' },
      },
      {
        src: '/images/live/cca-no-desterro-003.jpg',
        photographer: { name: 'Daniela Jácome', url: 'https://www.instagram.com/danielajacomeph/' },
      },
      {
        src: '/images/live/cca-no-desterro-004.jpg',
        photographer: { name: 'Daniela Jácome', url: 'https://www.instagram.com/danielajacomeph/' },
      },
      {
        src: '/images/live/cca-no-desterro-005.jpg',
        photographer: { name: 'Daniela Jácome', url: 'https://www.instagram.com/danielajacomeph/' },
      },
      {
        src: '/images/live/cca-no-desterro-006.jpg',
        photographer: { name: 'Pedro Jafuno', url: 'https://www.instagram.com/jafuno/' },
      },
      {
        src: '/images/live/cca-no-desterro-007.jpg',
        photographer: { name: 'Pedro Jafuno', url: 'https://www.instagram.com/jafuno/' },
      },
      {
        src: '/images/live/cca-no-desterro-008.jpg',
        photographer: { name: 'Pedro Jafuno', url: 'https://www.instagram.com/jafuno/' },
      },
      {
        src: '/images/live/cca-no-desterro-009.jpg',
        photographer: { name: 'Pedro Jafuno', url: 'https://www.instagram.com/jafuno/' },
      },
      {
        src: '/images/live/cca-no-desterro-010.jpg',
        photographer: { name: 'Pedro Jafuno', url: 'https://www.instagram.com/jafuno/' },
      },
      {
        src: '/images/live/cca-no-desterro-011.jpg',
        photographer: { name: 'Pedro Jafuno', url: 'https://www.instagram.com/jafuno/' },
      },
      {
        src: '/images/live/cca-no-desterro-012.jpg',
        photographer: { name: 'Pedro Jafuno', url: 'https://www.instagram.com/jafuno/' },
      },
      {
        src: '/images/live/cca-no-desterro-013.jpg',
        photographer: { name: 'Pedro Jafuno', url: 'https://www.instagram.com/jafuno/' },
      },
      {
        src: '/images/live/cca-no-desterro-014.jpg',
        photographer: { name: 'Pedro Jafuno', url: 'https://www.instagram.com/jafuno/' },
      },
      {
        src: '/images/live/cca-no-desterro-015.jpg',
        photographer: { name: 'Pedro Jafuno', url: 'https://www.instagram.com/jafuno/' },
      },
    ],
    videos: [
      {
        url: 'https://www.youtube-nocookie.com/embed/ad8q90MI6Dc',
        platform: 'youtube',
        title: 'NOx performing at CCA no Desterro, Desterro, Lisbon, 2024',
        author: { name: 'NOx', url: 'https://www.youtube.com/@noxexposure' },
      },
    ],
  },
  {
    id: 'amess-teatro-baltazar-dias',
    title: 'Performance with Amess',
    date: '2022-07-02',
    venue: { name: 'Teatro Municipal Baltazar Dias', url: 'https://www.teatromunicipal.pt/', city: 'Funchal', country: 'Portugal' },
    setup: { kind: 'band', band: { text: 'Amess', url: 'https://www.instagram.com/amess.music/' } },
    imageAlt: 'Jerome Faria performing with Amess at Teatro Municipal Baltazar Dias, Funchal, 2022',
    images: [
      {
        src: '/images/live/amess-teatro-baltazar-dias-001.jpg',
        photographer: { name: 'Óscar Silva', url: 'https://www.instagram.com/oscar_silva95/' },
      },
      {
        src: '/images/live/amess-teatro-baltazar-dias-002.jpg',
        photographer: { name: 'Óscar Silva', url: 'https://www.instagram.com/oscar_silva95/' },
      },
      {
        src: '/images/live/amess-teatro-baltazar-dias-003.jpg',
        photographer: { name: 'Óscar Silva', url: 'https://www.instagram.com/oscar_silva95/' },
      },
    ],
  },
  {
    id: 'amess-museu-franco',
    title: 'Performance with Amess',
    date: '2022-03-18',
    venue: { name: 'Museu Henrique e Francisco Franco', url: 'https://museus.madeira.gov.pt/DetalhesMuseu?museumId=3', city: 'Funchal', country: 'Portugal' },
    setup: { kind: 'band', band: { text: 'Amess', url: 'https://www.instagram.com/amess.music/' } },
    imageAlt: 'Jerome Faria performing with Amess at Museu Henrique e Francisco Franco, Funchal, 2022',
    images: [
      {
        src: '/images/live/amess-museu-franco-001.jpg',
        photographer: { name: 'Miguel Apolinário', url: 'https://www.instagram.com/miguel_apolinario777/' },
      },
      {
        src: '/images/live/amess-museu-franco-002.jpg',
        photographer: { name: 'Miguel Apolinário', url: 'https://www.instagram.com/miguel_apolinario777/' },
      },
      {
        src: '/images/live/amess-museu-franco-003.jpg',
        photographer: { name: 'Miguel Apolinário', url: 'https://www.instagram.com/miguel_apolinario777/' },
      },
      {
        src: '/images/live/amess-museu-franco-004.jpg',
        photographer: { name: 'Miguel Apolinário', url: 'https://www.instagram.com/miguel_apolinario777/' },
      },
      {
        src: '/images/live/amess-museu-franco-005.jpg',
        photographer: { name: 'Miguel Apolinário', url: 'https://www.instagram.com/miguel_apolinario777/' },
      },
    ],
  },
  {
    id: 'jejum-11',
    title: 'Jejum #11',
    date: '2022-03-05',
    venue: { name: 'Rua das Gaivotas 6', url: 'https://ruadasgaivotas6.pt/', city: 'Lisbon', country: 'Portugal' },
    setup: { kind: 'solo' },
    imageAlt: 'Jerome Faria performing at Jejum #11, Rua das Gaivotas 6, Lisbon, 2022',
    images: [
      {
        src: '/images/live/jejum-11-001.jpg',
        photographer: { name: 'Pedro Jafuno', url: 'https://www.instagram.com/jafuno/' },
      },
      {
        src: '/images/live/jejum-11-002.jpg',
        photographer: { name: 'Pedro Jafuno', url: 'https://www.instagram.com/jafuno/' },
      },
      {
        src: '/images/live/jejum-11-003.jpg',
        photographer: { name: 'Pedro Jafuno', url: 'https://www.instagram.com/jafuno/' },
      },
      {
        src: '/images/live/jejum-11-004.jpg',
        photographer: { name: 'Pedro Jafuno', url: 'https://www.instagram.com/jafuno/' },
      },
      {
        src: '/images/live/jejum-11-005.jpg',
        photographer: { name: 'Pedro Jafuno', url: 'https://www.instagram.com/jafuno/' },
      },
      {
        src: '/images/live/jejum-11-006.jpg',
        photographer: { name: 'Pedro Jafuno', url: 'https://www.instagram.com/jafuno/' },
      },
      {
        src: '/images/live/jejum-11-007.jpg',
        photographer: { name: 'Pedro Jafuno', url: 'https://www.instagram.com/jafuno/' },
      },
      {
        src: '/images/live/jejum-11-008.jpg',
        photographer: { name: 'Pedro Jafuno', url: 'https://www.instagram.com/jafuno/' },
      },
      {
        src: '/images/live/jejum-11-009.jpg',
        photographer: { name: 'Pedro Jafuno', url: 'https://www.instagram.com/jafuno/' },
      },
      {
        src: '/images/live/jejum-11-010.jpg',
        photographer: { name: 'Pedro Jafuno', url: 'https://www.instagram.com/jafuno/' },
      },
      {
        src: '/images/live/jejum-11-011.jpg',
        photographer: { name: 'Pedro Jafuno', url: 'https://www.instagram.com/jafuno/' },
      },
      {
        src: '/images/live/jejum-11-013.jpg',
        photographer: { name: 'Pedro Jafuno', url: 'https://www.instagram.com/jafuno/' },
      },
      {
        src: '/images/live/jejum-11-014.jpg',
        photographer: { name: 'Pedro Jafuno', url: 'https://www.instagram.com/jafuno/' },
      },
      {
        src: '/images/live/jejum-11-015.jpg',
        photographer: { name: 'Pedro Jafuno', url: 'https://www.instagram.com/jafuno/' },
      },
    ],
  },
  {
    id: 'aragao-cartaxo',
    title: 'ARAGÃO',
    titleUrl: '/works#aragao',
    date: '2021-10-23',
    venue: { name: 'Centro Cultural do Cartaxo', url: 'https://www.cm-cartaxo.pt/servicos-municipais/cultura/equipamentos-culturais/item/49-centro-cultural-municipio-do-cartaxo', city: 'Cartaxo', country: 'Portugal' },
    setup: { kind: 'solo' },
    format: { kind: 'theatre' },
  },
  {
    id: 'nariz-entupido',
    title: 'Nariz Entupido',
    date: '2021-10-22',
    venue: { name: 'SMUP', url: 'https://www.smup.pt/', city: 'Parede', country: 'Portugal' },
    setup: { kind: 'duo', with: { text: 'CAVERNANCIA', url: 'https://cavernancia.bandcamp.com/' } },
    note: '<a href="https://thisco.bandcamp.com/">THISCO</a> / SPH anniversary celebration.',
    imageAlt: 'Jerome Faria and CAVERNANCIA performing at Nariz Entupido, SMUP, Parede, 2021',
    images: [
      {
        src: '/images/live/nariz-entupido-001.jpg',
        photographer: { name: 'Ricardo Nogueira', url: 'https://www.instagram.com/nogueirafoto/' },
      },
      {
        src: '/images/live/nariz-entupido-002.jpg',
        photographer: { name: 'Ricardo Nogueira', url: 'https://www.instagram.com/nogueirafoto/' },
      },
      {
        src: '/images/live/nariz-entupido-003.jpg',
        photographer: { name: 'Ricardo Nogueira', url: 'https://www.instagram.com/nogueirafoto/' },
      },
      {
        src: '/images/live/nariz-entupido-004.jpg',
        photographer: { name: 'Ricardo Nogueira', url: 'https://www.instagram.com/nogueirafoto/' },
      },
    ],
    posters: [
      {
        src: '/images/live/nariz-entupido-poster-001.jpg',
        alt: 'Nariz Entupido poster — 30 anos SPH / 20 anos Thisco anniversary, SMUP, Parede, 22 October 2021; CAVERNANCIA + Jerome Faria',
        artist: { name: 'André Lemos', url: 'https://www.chilicomcarne.com/index.php/autores/gallery/18' },
      },
    ],
  },
  {
    id: 'aragao-funchal',
    title: 'ARAGÃO',
    titleUrl: '/works#aragao',
    date: '2021-09-22',
    endDate: '2021-09-25',
    venue: { name: 'Teatro Municipal Baltazar Dias', url: 'https://www.teatromunicipal.pt/', city: 'Funchal', country: 'Portugal' },
    setup: { kind: 'solo' },
    format: { kind: 'theatre' },
    imageAlt: 'Aragão theatre production at Teatro Municipal Baltazar Dias, Funchal, 2021',
    images: [
      {
        src: '/images/live/aragao-funchal-001.jpg',
        photographer: { name: 'Mário André Pereira' },
      },
    ],
    posters: [
      {
        src: '/images/live/aragao-funchal-poster-001.jpg',
        alt: 'Aragão poster — Teatro Municipal Baltazar Dias, Funchal, 22–25 September 2021; text by Rui Zink, staged by Sara Gonçalves',
      },
      {
        src: '/images/live/aragao-funchal-poster-002.jpg',
        alt: 'Aragão programme spread — synopsis and technical credits, Teatro Municipal Baltazar Dias, Funchal, 2021',
      },
    ],
    videos: [
      {
        url: 'https://www.youtube-nocookie.com/embed/6LpRJBS7pzg',
        platform: 'youtube',
        title: 'Aragão at Teatro Municipal Baltazar Dias, Funchal, 2021',
        author: { name: 'TRANSLOCAL Culturas Contemporâneas Locais e Urbanas', url: 'https://www.youtube.com/@translocalculturascontempo3938' },
      },
    ],
  },
  {
    id: 'reviralho',
    title: 'Reviralho',
    date: '2021-08-20',
    venue: { name: 'Cais do Carvão', city: 'Funchal', country: 'Portugal' },
    setup: { kind: 'band', band: { text: 'Amess', url: 'https://www.instagram.com/amess.music/' } },
  },
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
    imageAlt: 'Jerome Faria performing at Heineken Series, Musicbox, Lisbon, 2015',
    images: [
      {
        src: '/images/live/heineken-series-001.jpg',
        photographer: { name: 'Pedro Jafuno', url: 'https://www.instagram.com/jafuno/' },
      },
      {
        src: '/images/live/heineken-series-002.jpg',
        photographer: { name: 'Pedro Jafuno', url: 'https://www.instagram.com/jafuno/' },
      },
      {
        src: '/images/live/heineken-series-003.jpg',
        photographer: { name: 'Pedro Jafuno', url: 'https://www.instagram.com/jafuno/' },
      },
      {
        src: '/images/live/heineken-series-004.jpg',
        photographer: { name: 'Pedro Jafuno', url: 'https://www.instagram.com/jafuno/' },
      },
      {
        src: '/images/live/heineken-series-005.jpg',
        photographer: { name: 'Pedro Jafuno', url: 'https://www.instagram.com/jafuno/' },
      },
      {
        src: '/images/live/heineken-series-006.jpg',
        photographer: { name: 'Pedro Jafuno', url: 'https://www.instagram.com/jafuno/' },
      },
      {
        src: '/images/live/heineken-series-007.jpg',
        photographer: { name: 'Pedro Jafuno', url: 'https://www.instagram.com/jafuno/' },
      },
      {
        src: '/images/live/heineken-series-008.jpg',
        photographer: { name: 'Pedro Jafuno', url: 'https://www.instagram.com/jafuno/' },
      },
      {
        src: '/images/live/heineken-series-009.jpg',
        photographer: { name: 'Pedro Jafuno', url: 'https://www.instagram.com/jafuno/' },
      },
      {
        src: '/images/live/heineken-series-010.jpg',
        photographer: { name: 'Pedro Jafuno', url: 'https://www.instagram.com/jafuno/' },
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
    imageAlt: 'Jerome Faria performing at Fica na Cidade, Praça de Colombo, Funchal, 2015',
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
    note: 'Festival about creativity, technology and science.',
  },
  {
    id: 'caligari-live-3',
    title: 'Concertos L: The Cabinet of Dr. Caligari',
    titleUrl: 'https://www.pontadosol.com/l-concerts',
    date: '2013-10-26',
    venue: { name: 'Estalagem da Ponta do Sol', url: 'https://www.pontadosol.com/', city: 'Ponta do Sol', country: 'Portugal' },
    setup: { kind: 'duo', with: { text: 'Nuno Filipe', url: 'https://nunoandtheend.bandcamp.com/', suffix: '(piano)' } },
    format: { kind: 'filmScore', film: "Robert Wiene's 1920 expressionist silent film" },
  },
  {
    id: 'caligari-live-2',
    title: 'The Cabinet of Dr. Caligari',
    date: '2013-09-13',
    venue: { name: 'Scat Music Club', city: 'Funchal', country: 'Portugal' },
    setup: { kind: 'duo', with: { text: 'Nuno Filipe', url: 'https://nunoandtheend.bandcamp.com/', suffix: '(piano)' } },
    format: { kind: 'filmScore', film: "Robert Wiene's 1920 expressionist silent film" },
    imageAlt: 'Jerome Faria performing The Cabinet of Dr. Caligari at Scat Music Club, Funchal, 2013',
    images: [
      {
        src: '/images/live/caligari-live-2-001.jpg',
        photographer: { name: 'Pedro Jafuno', url: 'https://www.instagram.com/jafuno/' },
      },
    ],
  },
  {
    id: 'caligari-live',
    title: 'Cidades Eletrónicas: The Cabinet of Dr. Caligari',
    date: '2013-05-11',
    venue: { name: 'Casa das Mudas', url: 'https://museus.madeira.gov.pt/DetalhesMuseu?museumId=1', city: 'Calheta', country: 'Portugal' },
    setup: { kind: 'duo', with: { text: 'Nuno Filipe', url: 'https://nunoandtheend.bandcamp.com/', suffix: '(piano)' } },
    format: { kind: 'filmScore', film: "Robert Wiene's 1920 expressionist silent film", premiere: true },
    imageAlt: 'Jerome Faria performing at Cidades Eletrónicas: The Cabinet of Dr. Caligari, Casa das Mudas, Calheta, 2013',
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
    setup: { kind: 'ensemble', name: 'Improvisation collective' },
    note: 'Electronics, piano (<a href="https://nunoandtheend.bandcamp.com/">Nuno Filipe</a>), percussion (<a href="https://madeirajazzcollective.bandcamp.com/">Jorge Maggiore</a>) and visuals (Filipe Ferraz).',
    videos: [
      {
        url: 'https://www.youtube-nocookie.com/embed/41vx80KyONA',
        platform: 'youtube',
        title: 'Cine Qua Non performance at Estalagem da Ponta do Sol, 2012',
        author: { name: 'The Noise Spot', url: 'https://www.youtube.com/@thenoisespot' },
      },
    ],
  },
  {
    id: 'madeiradig-2011',
    title: 'MADEIRADIG',
    titleUrl: 'https://digitalinberlin.eu/',
    date: '2011-12-02',
    venue: { name: 'Casa das Mudas', url: 'https://museus.madeira.gov.pt/DetalhesMuseu?museumId=1', city: 'Calheta', country: 'Portugal' },
    setup: { kind: 'duo', with: { text: 'Taylor Deupree', url: 'https://12k.com/' } },
    bill: [
      { text: 'Tim Hecker', url: 'https://sunblind.net/' },
      { text: 'Oneohtrix Point Never', url: 'https://pointnever.com/' },
      { text: 'KTL', url: 'https://ktl10.bandcamp.com/' },
      { text: 'Deaf Center', url: 'https://deafcenter.bandcamp.com/' },
      [{ text: 'Lee Ranaldo', url: 'https://www.leeranaldo.com/' }, { text: 'Manuel Mota', url: 'https://manuelmota.bandcamp.com/' }],
      { text: 'Nadja', url: 'https://nadja.bandcamp.com/' },
      { text: 'Aki Onda', url: 'https://akionda.net/' },
    ],
    imageAlt: 'Jerome Faria and Taylor Deupree performing at MADEIRADIG, Casa das Mudas, Calheta, 2011',
    images: [
      {
        src: '/images/live/madeiradig-2011-001.jpg',
        photographer: { name: 'Valentina Araújo' },
      },
      {
        src: '/images/live/madeiradig-2011-002.jpg',
        photographer: { name: 'Valentina Araújo' },
      },
      {
        src: '/images/live/madeiradig-2011-003.jpg',
        photographer: { name: 'Valentina Araújo' },
      },
      {
        src: '/images/live/madeiradig-2011-004.jpg',
        photographer: { name: 'Valentina Araújo' },
      },
      {
        src: '/images/live/madeiradig-2011-005.jpg',
        photographer: { name: 'Valentina Araújo' },
      },
      {
        src: '/images/live/madeiradig-2011-006.jpg',
        photographer: { name: 'Valentina Araújo' },
      },
    ],
  },
  {
    id: 'migractions-2011',
    title: 'Festival Migractions',
    date: '2011-05-23',
    venue: { name: 'Théâtre de L\'Opprimé', url: 'https://www.theatredelopprime.com/', city: 'Paris', country: 'France' },
    setup: { kind: 'duo', with: { text: 'Hugo Olim', url: 'https://vimeo.com/hugoolim', suffix: '(visuals)' } },
    imageAlt: 'Jerome Faria and Hugo Olim performing at Festival Migractions, Théâtre de L\'Opprimé, Paris, 2011',
    images: [
      {
        src: '/images/live/migractions-2011-001.jpg',
        photographer: { name: 'Sue-Elie Andrade-Dé', url: 'https://cargocollective.com/sueelieandradede' },
      },
      {
        src: '/images/live/migractions-2011-002.jpg',
        photographer: { name: 'Sue-Elie Andrade-Dé', url: 'https://cargocollective.com/sueelieandradede' },
      },
    ],
  },
  {
    id: 'olhares-de-outono-2010',
    date: '2010-11-27',
    title: 'Olhares de Outono',
    venue: { name: 'Passos Manuel', url: 'https://passosmanuel.net/', city: 'Porto', country: 'Portugal' },
    setup: { kind: 'solo' },
    format: { kind: 'talk' },
    bill: [
      { text: 'Oval', url: 'https://oval.bandcamp.com/' },
      { text: 'Simon Fisher Turner', url: 'https://simonfisherturner.bandcamp.com/' },
      { text: 'Paul Farrington' },
      { text: 'André Gonçalves' },
    ],
    imageAlt: 'Jerome Faria performing at Olhares de Outono, Passos Manuel, Porto, 2010',
    images: [
      {
        src: '/images/live/olhares-de-outono-2010-001.jpg',
        photographer: { name: 'Olhares de Outono' },
      },
      {
        src: '/images/live/olhares-de-outono-2010-002.jpg',
        photographer: { name: 'Olhares de Outono' },
      },
      {
        src: '/images/live/olhares-de-outono-2010-003.jpg',
        photographer: { name: 'Olhares de Outono' },
      },
      {
        src: '/images/live/olhares-de-outono-2010-004.jpg',
        photographer: { name: 'Olhares de Outono' },
      },
      {
        src: '/images/live/olhares-de-outono-2010-005.jpg',
        photographer: { name: 'Olhares de Outono' },
      },
      {
        src: '/images/live/olhares-de-outono-2010-006.jpg',
        photographer: { name: 'Olhares de Outono' },
      },
      {
        src: '/images/live/olhares-de-outono-2010-007.jpg',
        photographer: { name: 'Olhares de Outono' },
      },
    ],
  },
  {
    id: 'madeiradig-2009',
    date: '2009-12-04',
    title: 'MADEIRADIG',
    titleUrl: 'https://digitalinberlin.eu/',
    venue: { name: 'Casa das Mudas', url: 'https://museus.madeira.gov.pt/DetalhesMuseu?museumId=1', city: 'Calheta', country: 'Portugal' },
    setup: { kind: 'duo', with: { text: 'Hugo Olim', url: 'https://vimeo.com/hugoolim', suffix: '(visuals)' } },
    bill: [
      { text: 'Alva Noto', url: 'https://www.alvanoto.com/' },
      { text: 'Murcof', url: 'https://murcof.com/' },
      { text: 'Felix Kubin', url: 'https://felixkubin.com/' },
      { text: 'Christ.', url: 'https://christmusic.bandcamp.com/' },
      [{ text: 'Zavoloka', url: 'https://zavoloka.com/' }, { text: 'Laetitia Morais', url: 'https://laetitiamorais.com/' }],
      { text: 'Gigantiq', url: 'https://gigantiq.bandcamp.com/' },
      { text: 'Jade', url: 'http://www.jade-enterprises.at/' },
    ],
    imageAlt: 'Jerome Faria and Hugo Olim performing at MADEIRADIG, Casa das Mudas, Calheta, 2009',
    images: [
      {
        src: '/images/live/madeiradig-2009-001.jpg',
        photographer: { name: 'Miguel Apolinário', url: 'https://www.instagram.com/miguel_apolinario777/' },
      },
      {
        src: '/images/live/madeiradig-2009-002.jpg',
        photographer: { name: 'Miguel Apolinário', url: 'https://www.instagram.com/miguel_apolinario777/' },
      },
      {
        src: '/images/live/madeiradig-2009-003.jpg',
        photographer: { name: 'Miguel Apolinário', url: 'https://www.instagram.com/miguel_apolinario777/' },
      },
      {
        src: '/images/live/madeiradig-2009-004.jpg',
        photographer: { name: 'Miguel Apolinário', url: 'https://www.instagram.com/miguel_apolinario777/' },
      },
      {
        src: '/images/live/madeiradig-2009-005.jpg',
        photographer: { name: 'Miguel Apolinário', url: 'https://www.instagram.com/miguel_apolinario777/' },
      },
      {
        src: '/images/live/madeiradig-2009-006.jpg',
        photographer: { name: 'Miguel Apolinário', url: 'https://www.instagram.com/miguel_apolinario777/' },
      },
    ],
    videos: [
      {
        url: 'https://www.youtube-nocookie.com/embed/csZramO6QDM',
        platform: 'youtube',
        title: 'Jerome Faria and Hugo Olim at MADEIRADIG 2009',
        author: { name: 'Vítor Joaquim', url: 'https://www.youtube.com/@vjoaquim' },
      },
      {
        url: 'https://player.vimeo.com/video/8088317',
        platform: 'vimeo',
        title: 'Jerome Faria and Hugo Olim at MADEIRADIG 2009',
        author: { name: 'Hugo Olim', url: 'https://vimeo.com/hugoolim' },
      },
    ],
  },
  {
    id: 'eme-olhares-2009',
    title: 'EME.LL / Olhares de Outono',
    date: '2009-11-21',
    venue: { name: 'Mosteiro São Bento da Vitória', url: 'https://www.tnsj.pt/en/edificios/mosteiro-de-sao-bento-da-vitoria/', city: 'Porto', country: 'Portugal' },
    setup: {
      kind: 'ensemble',
      name: 'Resampling White Noise — 16-performer laptop meeting',
      members: [
        { text: 'Scanner', url: 'https://scannerdot.bandcamp.com/' },
        { text: '@c', url: 'https://at-c.org/' },
        { text: 'Vítor Joaquim', url: 'https://www.vitorjoaquim.pt/' },
        { text: 'Carlos Santos', url: 'https://carlossantos.bandcamp.com/' },
        { text: 'Miguel Carvalhais', url: 'https://www.carvalhais.org/' },
        { text: 'Pedro Tudela', url: 'http://pedrotudela.org/' },
        { text: 'Pedro Almeida' },
        { text: 'João Ricardo', url: 'https://opcabpol.bandcamp.com/' },
        { text: 'Ivan Franco', url: 'https://ivanfranco.wordpress.com/' },
        { text: 'Nuno Moita', url: 'https://nunomoita.bandcamp.com/' },
        { text: 'André Gonçalves', url: 'https://www.andregoncalves.info/' },
        { text: 'The Beautiful Schizophonic', url: 'https://cronica.bandcamp.com/album/musicamorosa' },
        { text: 'Rui Costa' },
        { text: 'André Sier', url: 'https://andre-sier.com/' },
        { text: 'Alba Corral', url: 'https://blog.albagcorral.com/' },
        { text: 'Laetitia Morais', url: 'https://laetitiamorais.com/' },
        { text: 'Hugo Olim', url: 'https://vimeo.com/hugoolim' },
      ],
    },
    imageAlt: 'Resampling White Noise laptop meeting at EME.LL / Olhares de Outono, Mosteiro São Bento da Vitória, Porto, 2009',
    images: [
      {
        src: '/images/live/eme-olhares-2009-001.jpg',
        photographer: { name: 'Vítor Joaquim', url: 'https://www.vitorjoaquim.pt/' },
      },
      {
        src: '/images/live/eme-olhares-2009-002.jpg',
        photographer: { name: 'Vítor Joaquim', url: 'https://www.vitorjoaquim.pt/' },
      },
      {
        src: '/images/live/eme-olhares-2009-003.jpg',
        photographer: { name: 'Vítor Joaquim', url: 'https://www.vitorjoaquim.pt/' },
      },
      {
        src: '/images/live/eme-olhares-2009-004.jpg',
        photographer: { name: 'Vítor Joaquim', url: 'https://www.vitorjoaquim.pt/' },
      },
      {
        src: '/images/live/eme-olhares-2009-005.jpg',
        photographer: { name: 'Vítor Joaquim', url: 'https://www.vitorjoaquim.pt/' },
      },
    ],
  },
  {
    id: 'eme-madeira-2008',
    date: '2008-10-04',
    title: 'EME — Extensão Madeira',
    venue: { name: 'Casa das Mudas', url: 'https://museus.madeira.gov.pt/DetalhesMuseu?museumId=1', city: 'Calheta', country: 'Portugal' },
    setup: { kind: 'solo' },
    bill: [
      { text: 'Hauschka', url: 'https://hauschka.bandcamp.com/' },
      { text: 'The Sight Below', url: 'https://thesightbelow.bandcamp.com/' },
    ],
  },
  {
    id: 'eme-2008',
    title: 'EME',
    date: '2008-10-01',
    venue: { name: 'Teatro Ibérico', url: 'https://teatroiberico.org/', city: 'Lisbon', country: 'Portugal' },
    setup: { kind: 'solo' },
    bill: [
      { text: 'The Sight Below', url: 'https://thesightbelow.bandcamp.com/' },
      { text: 'Greg Haines', url: 'https://greghaines.bandcamp.com/' },
      { text: 'Hauschka', url: 'https://hauschka.bandcamp.com/' },
      { text: 'Frank Bretschneider', url: 'https://frankbretschneider.bandcamp.com/' },
      { text: 'Sanso-Xtro', url: 'https://soundcloud.com/sanso-xtro' },
      { text: 'Anna Troisi', url: 'https://annatroisi.org/' },
      { text: 'Tina Frank', url: 'https://www.tinafrank.net/' },
      { text: 'Carsten Goertz', url: 'https://carstengoertz.cc/' },
      { text: 'André Sier', url: 'https://andre-sier.com/' },
      { text: 'André Gonçalves', url: 'https://www.andregoncalves.info/' },
      { text: 'Garcia', url: 'https://margaridagarcia.bandcamp.com/' },
      { text: 'Machas' },
      [{ text: 'Maranha', url: 'https://davidmaranha.bandcamp.com/' }, { text: 'Mota', url: 'https://manuelmota.bandcamp.com/' }],
      { text: 'Safe & Sound' },
      { text: 'The Beautiful Schizophonic', url: 'https://cronica.bandcamp.com/album/musicamorosa' },
    ],
    imageAlt: 'Jerome Faria performing at EME Festival, Teatro Ibérico, Lisbon, 2008',
    images: [
      {
        src: '/images/live/eme-2008-001.jpg',
        photographer: { name: 'EME Festival', url: 'https://www.emefestival.org/' },
      },
      {
        src: '/images/live/eme-2008-002.jpg',
        photographer: { name: 'EME Festival', url: 'https://www.emefestival.org/' },
      },
      {
        src: '/images/live/eme-2008-003.jpg',
        photographer: { name: 'EME Festival', url: 'https://www.emefestival.org/' },
      },
      {
        src: '/images/live/eme-2008-004.jpg',
        photographer: { name: 'EME Festival', url: 'https://www.emefestival.org/' },
      },
      {
        src: '/images/live/eme-2008-005.jpg',
        photographer: { name: 'EME Festival', url: 'https://www.emefestival.org/' },
      },
      {
        src: '/images/live/eme-2008-006.jpg',
        photographer: { name: 'EME Festival', url: 'https://www.emefestival.org/' },
      },
      {
        src: '/images/live/eme-2008-007.jpg',
        photographer: { name: 'EME Festival', url: 'https://www.emefestival.org/' },
      },
      {
        src: '/images/live/eme-2008-008.jpg',
        photographer: { name: 'EME Festival', url: 'https://www.emefestival.org/' },
      },
    ],
    videos: [
      {
        url: 'https://www.youtube-nocookie.com/embed/d_0IXOpiZTE',
        platform: 'youtube',
        title: 'Jerome Faria at EME Festival 2008, Lisbon',
        author: { name: 'Vítor Joaquim', url: 'https://www.youtube.com/@vjoaquim' },
      },
    ],
  },
  {
    id: 'storung-2008',
    date: '2008-09-25',
    title: 'Störung',
    titleUrl: 'https://ra.co/promoters/4519',
    venue: { name: 'La Farinera del Clot', url: 'https://farinera.org/', city: 'Barcelona', country: 'Spain' },
    setup: { kind: 'solo' },
    bill: [
      { text: 'Kim Cascone', url: 'https://kimcascone.bandcamp.com/' },
      { text: 'Francisco López', url: 'https://www.franciscolopez.net/' },
      { text: 'Philippe Petit', url: 'https://philippepetit.bandcamp.com/' },
      { text: 'Ritornell', url: 'https://ritornell.bandcamp.com/' },
      { text: 'Sébastien Roux' },
      { text: 'Tonne' },
    ],
    imageAlt: 'Jerome Faria performing at Störung Festival, La Farinera del Clot, Barcelona, 2008',
    images: [
      {
        src: '/images/live/storung-2008-001.jpg',
        photographer: { name: 'Störung Festival', url: 'https://storung.com/' },
      },
      {
        src: '/images/live/storung-2008-002.jpg',
        photographer: { name: 'Störung Festival', url: 'https://storung.com/' },
      },
      {
        src: '/images/live/storung-2008-003.jpg',
        photographer: { name: 'Störung Festival', url: 'https://storung.com/' },
      },
    ],
  },
  {
    id: 'stfu-porto',
    date: '2007-03-22',
    title: 'STFU Porto',
    venue: { name: 'Fábrica do Som', url: 'https://fabricadesom.org/', city: 'Porto', country: 'Portugal' },
    setup: { kind: 'solo' },
    bill: [
      { text: 'Svarte Greiner', url: 'https://svartegreiner.bandcamp.com/' },
      { text: 'Pygar (<a href="https://vimeo.com/hugoolim">Hugo Olim</a> & <a href="https://opcabpol.bandcamp.com/">João Ricardo</a>)' },
      { text: 'e:4c' },
      { text: 'CKZ' },
      { text: 'DeciBeats' },
      { text: 'Aenedra' },
      { text: 'Unknown Forces Of Everyday Life' },
    ],
    imageAlt: 'Jerome Faria performing at STFU Porto, Fábrica do Som, Porto, 2007',
    images: [
      {
        src: '/images/live/stfu-porto-001.jpg',
        photographer: { name: 'STFU Porto' },
      },
      {
        src: '/images/live/stfu-porto-002.jpg',
        photographer: { name: 'STFU Porto' },
      },
      {
        src: '/images/live/stfu-porto-003.jpg',
        photographer: { name: 'STFU Porto' },
      },
    ],
  },
  {
    id: 'madeiradig-2007',
    date: '2007-12-08',
    title: 'MADEIRADIG',
    titleUrl: 'https://digitalinberlin.eu/',
    venue: { name: 'Casa das Mudas', url: 'https://museus.madeira.gov.pt/DetalhesMuseu?museumId=1', city: 'Calheta', country: 'Portugal' },
    setup: { kind: 'solo' },
    note: 'Performed as NNY.',
    bill: [
      { text: 'Alog', url: 'https://alogmusic.bandcamp.com/' },
      [{ text: 'Vítor Joaquim', url: 'https://www.vitorjoaquim.pt/' }, { text: 'Laetitia Morais', url: 'https://laetitiamorais.com/' }],
      { text: 'Vladislav Delay', url: 'https://vladislavdelay.bandcamp.com/' },
      { text: 'Ran Slavin', url: 'https://ranslavin.com/' },
    ],
    imageAlt: 'Jerome Faria performing at MADEIRADIG, Casa das Mudas, Calheta, 2007',
    images: [
      {
        src: '/images/live/madeiradig-2007-001.jpg',
        photographer: { name: 'Marta León', url: 'https://leonmarta.wordpress.com/' },
      },
      {
        src: '/images/live/madeiradig-2007-002.jpg',
        photographer: { name: 'Marta León', url: 'https://leonmarta.wordpress.com/' },
      },
      {
        src: '/images/live/madeiradig-2007-003.jpg',
        photographer: { name: 'Marta León', url: 'https://leonmarta.wordpress.com/' },
      },
      {
        src: '/images/live/madeiradig-2007-004.jpg',
        photographer: { name: 'Marta León', url: 'https://leonmarta.wordpress.com/' },
      },
      {
        src: '/images/live/madeiradig-2007-005.jpg',
        photographer: { name: 'Marta León', url: 'https://leonmarta.wordpress.com/' },
      },
      {
        src: '/images/live/madeiradig-2007-006.jpg',
        photographer: { name: 'Marta León', url: 'https://leonmarta.wordpress.com/' },
      },
      {
        src: '/images/live/madeiradig-2007-007.jpg',
        photographer: { name: 'Marta León', url: 'https://leonmarta.wordpress.com/' },
      },
      {
        src: '/images/live/madeiradig-2007-008.jpg',
        photographer: { name: 'Marta León', url: 'https://leonmarta.wordpress.com/' },
      },
      {
        src: '/images/live/madeiradig-2007-009.jpg',
        photographer: { name: 'Marta León', url: 'https://leonmarta.wordpress.com/' },
      },
      {
        src: '/images/live/madeiradig-2007-010.jpg',
        photographer: { name: 'Marta León', url: 'https://leonmarta.wordpress.com/' },
      },
    ],
  },
  {
    id: 'madeiradig-2006',
    title: 'MADEIRADIG',
    titleUrl: 'https://digitalinberlin.eu/',
    date: '2006-12-07',
    venue: { name: 'RDP Auditorium', url: 'https://madeira.rtp.pt/', city: 'Funchal', country: 'Portugal' },
    setup: { kind: 'solo' },
    note: 'Performed as NNY.',
    bill: [
      [{ text: 'Phonophani', url: 'https://phonophani.bandcamp.com/' }, { text: 'Marius Watz', url: 'https://mariuswatz.com/' }],
      { text: 'Frank Bretschneider', url: 'https://frankbretschneider.bandcamp.com/' },
    ],
  },
  {
    id: 'madeiradig-2005',
    date: '2005-12-07',
    title: 'MADEIRADIG',
    titleUrl: 'https://digitalinberlin.eu/',
    venue: { name: 'RDP Auditorium', url: 'https://madeira.rtp.pt/', city: 'Funchal', country: 'Portugal' },
    setup: { kind: 'duo', with: { text: 'Hugo Olim', url: 'https://vimeo.com/hugoolim', suffix: '(visuals)' } },
    note: 'Performed as NNY.',
    bill: [
      { text: 'Fennesz', url: 'https://www.fennesz.com/' },
      { text: 'Florian Hecker', url: 'https://florianhecker.blogspot.com/' },
      [{ text: '@c', url: 'https://at-c.org/' }, { text: 'Lia', url: 'https://liaworks.com/' }],
    ],
    imageAlt: 'Jerome Faria and Hugo Olim performing at MADEIRADIG, RDP Auditorium, Funchal, 2005',
    images: [
      {
        src: '/images/live/madeiradig-2005-001.jpg',
        photographer: { name: 'Louie de Bettencourt' },
      },
      {
        src: '/images/live/madeiradig-2005-002.jpg',
        photographer: { name: 'Louie de Bettencourt' },
      },
      {
        src: '/images/live/madeiradig-2005-003.jpg',
        photographer: { name: 'Louie de Bettencourt' },
      },
      {
        src: '/images/live/madeiradig-2005-004.jpg',
        photographer: { name: 'Louie de Bettencourt' },
      },
      {
        src: '/images/live/madeiradig-2005-005.jpg',
        photographer: { name: 'Louie de Bettencourt' },
      },
      {
        src: '/images/live/madeiradig-2005-006.jpg',
        photographer: { name: 'Louie de Bettencourt' },
      },
      {
        src: '/images/live/madeiradig-2005-007.jpg',
        photographer: { name: 'Louie de Bettencourt' },
      },
      {
        src: '/images/live/madeiradig-2005-008.jpg',
        photographer: { name: 'Louie de Bettencourt' },
      },
      {
        src: '/images/live/madeiradig-2005-009.jpg',
        photographer: { name: 'Louie de Bettencourt' },
      },
      {
        src: '/images/live/madeiradig-2005-010.jpg',
        photographer: { name: 'Louie de Bettencourt' },
      },
    ],
  },
];

const groupEventsByYear = (events: LiveEvent[]): LiveData => {
  const byYear: Record<string, LiveYearSection> = {};

  for (const event of events) {
    const year = event.date.slice(0, 4);
    const section = byYear[year] ?? { title: year, id: year, items: [] };
    section.items.push(event);
    byYear[year] = section;
  }

  return Object.fromEntries(
    Object.entries(byYear).map(([year, section]) => [
      year,
      { ...section, items: [...section.items].sort((a, b) => b.date.localeCompare(a.date)) },
    ]),
  );
};

export const sortedLiveData: LiveData = groupEventsByYear(liveEvents);

export const liveYears: string[] = Object.keys(sortedLiveData).sort((a, b) => b.localeCompare(a));
