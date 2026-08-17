import type { LiveData, LiveEvent, LiveYearSection } from '@/types/live';

export const liveEvents: LiveEvent[] = [
  {
    id: 'tbc-2026-09-19',
    title: 'TBC',
    date: '2026-09-19',
    venue: { country: 'Portugal' },
    description: 'Solo performance.',
  },
  {
    id: 'tbc-2026-08-23',
    title: 'TBC',
    date: '2026-08-23',
    venue: { country: 'Portugal' },
    description: 'Solo performance.',
  },
  {
    id: 'showcase-casa-amarela',
    title: 'Showcase Casa Amarela',
    date: '2025-06-14',
    venue: { name: 'Cooperativa Mula', url: 'https://www.instagram.com/cooperativamula/', city: 'Barreiro', country: 'Portugal' },
    description: 'NOx (with <a href="https://cavernancia.bandcamp.com/">Pedro Roque</a>). With <a href="https://copodagua.bandcamp.com/">Copo d\'Água</a>, TiaAvô, Rebolation All-Stars.',
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
  },
  {
    id: 'fim-de-emissao-45',
    title: 'Fim de Emissão #45',
    date: '2025-01-17',
    venue: { name: 'Desterro', url: 'https://darc.pt', city: 'Lisbon', country: 'Portugal' },
    description: 'Solo performance. With Ai Feith, W.T.V.R.',
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
    description: 'Solo performance. With <a href="https://mosskissingmusic.bandcamp.com/">Moss Kissing</a>, Rui Wentacid (DJ set).',
  },
  {
    id: 'cca-no-desterro',
    title: 'CCA no Desterro',
    date: '2024-05-02',
    venue: { name: 'Desterro', url: 'https://darc.pt', city: 'Lisbon', country: 'Portugal' },
    description: 'NOx (with <a href="https://cavernancia.bandcamp.com/">Pedro Roque</a>). With <a href="https://copodagua.bandcamp.com/">Copo d\'Água</a>, <a href="https://soundcloud.com/djprivilegio">DJ Privilégio</a>, <a href="https://casaamarela.bandcamp.com/album/shimano">Gallo\'84</a>.',
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
    description: 'With <a href="https://www.instagram.com/amess.music/">Amess</a>.',
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
    description: 'With <a href="https://www.instagram.com/amess.music/">Amess</a>.',
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
    title: '<a href="/works#aragao">Aragão</a>',
    date: '2021-10-23',
    venue: { name: 'Centro Cultural do Cartaxo', url: 'https://www.cm-cartaxo.pt/servicos-municipais/cultura/equipamentos-culturais/item/49-centro-cultural-municipio-do-cartaxo', city: 'Cartaxo', country: 'Portugal' },
    description: 'Theatre production. Live music & interpretation.',
  },
  {
    id: 'nariz-entupido',
    title: 'Nariz Entupido',
    date: '2021-10-22',
    venue: { name: 'SMUP', url: 'https://www.smup.pt/', city: 'Parede', country: 'Portugal' },
    description: 'Duo with <a href="https://cavernancia.bandcamp.com/">CAVERNANCIA</a>. <a href="https://thisco.bandcamp.com/">THISCO</a> / SPH anniversary celebration.',
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
  },
  {
    id: 'aragao-funchal',
    title: '<a href="/works#aragao">Aragão</a>',
    date: '2021-09-22',
    venue: { name: 'Teatro Municipal Baltazar Dias', url: 'https://www.teatromunicipal.pt/', city: 'Funchal', country: 'Portugal' },
    description: 'Theatre production. Live music & interpretation.',
    imageAlt: 'Aragão theatre production at Teatro Municipal Baltazar Dias, Funchal, 2021',
    images: [
      {
        src: '/images/live/aragao-funchal-001.jpg',
        photographer: { name: 'Mário André Pereira' },
      },
    ],
  },
  {
    id: 'reviralho',
    title: 'Reviralho',
    date: '2021-08-20',
    venue: { name: 'Cais do Carvão', city: 'Funchal', country: 'Portugal' },
    description: 'With <a href="https://www.instagram.com/amess.music/">Amess</a>.',
  },
  {
    id: 'heineken-series',
    title: 'Heineken Series',
    date: '2015-09-18',
    venue: { name: 'Musicbox', url: 'https://www.musicboxlisboa.com/', city: 'Lisbon', country: 'Portugal' },
    description: 'With <a href="https://www.mmlxii.com/">William Basinski</a>, <a href="https://zigurartists.bandcamp.com/album/forgetting-is-a-liability">Mr. Herbert Quain</a>, <a href="https://www.viberate.com/artist/cruz-767/">Cruz</a>.',
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
    title: '<a href="https://www.visitfunchal.pt/pt/todos-os-eventos/280-fica-na-cidade.html">Fica na Cidade</a>',
    date: '2015-06-05',
    venue: { name: 'Praça de Colombo', city: 'Funchal', country: 'Portugal' },
    description: 'With <a href="https://trengosoundsystem.bandcamp.com/">Tren Go! Sound System</a>.',
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
    description: 'Solo performance. Festival about creativity, technology and science. With <a href="https://massimobanzi.com/">Massimo Banzi</a> (Arduino), <a href="https://davidrowan.com/">David Rowan</a> (Wired UK), Gian Giudice (CERN).',
  },
  {
    id: 'caligari-live-3',
    title: '<a href="https://www.pontadosol.com/l-concerts">Concertos L</a>: The Cabinet of Dr. Caligari',
    date: '2013-10-26',
    venue: { name: 'Estalagem da Ponta do Sol', url: 'https://www.pontadosol.com/', city: 'Ponta do Sol', country: 'Portugal' },
    description: 'Live score for Robert Wiene\'s 1920 expressionist silent film. With <a href="https://nunoandtheend.bandcamp.com/">Nuno Filipe</a>.',
  },
  {
    id: 'caligari-live-2',
    title: 'The Cabinet of Dr. Caligari',
    date: '2013-09-13',
    venue: { name: 'Scat Music Club', city: 'Funchal', country: 'Portugal' },
    description: 'Live score for Robert Wiene\'s 1920 expressionist silent film. With <a href="https://nunoandtheend.bandcamp.com/">Nuno Filipe</a>.',
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
    description: 'Premiere of live score for Robert Wiene\'s 1920 expressionist silent film. With <a href="https://nunoandtheend.bandcamp.com/">Nuno Filipe</a>.',
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
    description: 'Improvisation collective. Electronics, piano (<a href="https://nunoandtheend.bandcamp.com/">Nuno Filipe</a>), percussion (<a href="https://madeirajazzcollective.bandcamp.com/">Jorge Maggiore</a>) and visuals (Filipe Ferraz).',
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
    title: '<a href="https://digitalinberlin.eu/">MADEIRADIG</a>',
    date: '2011-12-02',
    venue: { name: 'Casa das Mudas', url: 'https://museus.madeira.gov.pt/DetalhesMuseu?museumId=1', city: 'Calheta', country: 'Portugal' },
    description: 'Duo with <a href="https://12k.com/">Taylor Deupree</a>. With <a href="https://sunblind.net/">Tim Hecker</a>, <a href="https://pointnever.com/">Oneohtrix Point Never</a>, <a href="https://ktl10.bandcamp.com/">KTL</a>, <a href="https://deafcenter.bandcamp.com/">Deaf Center</a>, <a href="https://www.leeranaldo.com/">Lee Ranaldo</a> & Manuel Mota, <a href="https://nadja.bandcamp.com/">Nadja</a>, <a href="https://akionda.net/">Aki Onda</a>.',
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
    description: 'Duo with <a href="https://vimeo.com/hugoolim">Hugo Olim</a>.',
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
    description: 'Artist talk and performance. With <a href="https://oval.bandcamp.com/">Oval</a>, <a href="https://simonfisherturner.bandcamp.com/">Simon Fisher Turner</a>, Paul Farrington, André Gonçalves.',
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
    title: '<a href="https://digitalinberlin.eu/">MADEIRADIG</a>',
    venue: { name: 'Casa das Mudas', url: 'https://museus.madeira.gov.pt/DetalhesMuseu?museumId=1', city: 'Calheta', country: 'Portugal' },
    description: 'Duo with <a href="https://vimeo.com/hugoolim">Hugo Olim</a>. With <a href="https://www.alvanoto.com/">Alva Noto</a>, <a href="https://murcof.com/">Murcof</a>, <a href="https://felixkubin.bandcamp.com/">Felix Kubin</a>, <a href="https://www.discogs.com/artist/31633-Christ">Christ.</a>, <a href="https://zavoloka.com/">Zavoloka</a> & <a href="https://laetitiamorais.com/">Laetitia Morais</a>, <a href="https://gigantiq.bandcamp.com/">Gigantiq</a>, <a href="http://www.jade-enterprises.at/">Jade</a>.',
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
        author: { name: 'Vitor Joaquim', url: 'https://www.youtube.com/@vjoaquim' },
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
    description: 'Resampling White Noise — 16-performer laptop meeting. With <a href="https://scannerdot.bandcamp.com/">Scanner</a>, <a href="https://at-c.org/">@c</a>, <a href="https://www.vitorjoaquim.pt/">Vitor Joaquim</a>, <a href="https://carlossantos.bandcamp.com/">Carlos Santos</a>, <a href="https://www.carvalhais.org/">Miguel Carvalhais</a>, <a href="http://pedrotudela.org/">Pedro Tudela</a>, Pedro Almeida, <a href="https://opcabpol.bandcamp.com/">João Ricardo</a>, <a href="https://ivanfranco.wordpress.com/">Ivan Franco</a>, <a href="https://nunomoita.bandcamp.com/">Nuno Moita</a>, <a href="https://www.andregoncalves.info/">André Gonçalves</a>, <a href="https://cronica.bandcamp.com/album/musicamorosa">The Beautiful Schizophonic</a>, Rui Costa, <a href="https://andre-sier.com/">André Sier</a>, <a href="https://blog.albagcorral.com/">Alba Corral</a>, <a href="https://laetitiamorais.com/">Laetitia Morais</a>, <a href="https://vimeo.com/hugoolim">Hugo Olim</a>.',
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
    description: 'With <a href="https://hauschka.bandcamp.com/">Hauschka</a>, <a href="https://thesightbelow.bandcamp.com/">The Sight Below</a>.',
  },
  {
    id: 'eme-2008',
    title: 'EME',
    date: '2008-10-01',
    venue: { name: 'Teatro Ibérico', url: 'https://teatroiberico.org/', city: 'Lisbon', country: 'Portugal' },
    description: 'With <a href="https://thesightbelow.bandcamp.com/">The Sight Below</a>, <a href="https://greghaines.bandcamp.com/">Greg Haines</a>, <a href="https://hauschka.bandcamp.com/">Hauschka</a>, <a href="https://frankbretschneider.bandcamp.com/">Frank Bretschneider</a>, <a href="https://soundcloud.com/sanso-xtro">Sanso-Xtro</a>, <a href="https://annatroisi.org/">Anna Troisi</a>, <a href="https://www.tinafrank.net/">Tina Frank</a>, <a href="https://carstengoertz.cc/">Carsten Goertz</a>, <a href="https://andre-sier.com/">André Sier</a>, <a href="https://www.andregoncalves.info/">André Gonçalves</a>, <a href="https://margaridagarcia.bandcamp.com/">Garcia</a>, Machas, <a href="https://davidmaranha.bandcamp.com/">Maranha</a> e <a href="https://manuelmota.bandcamp.com/">Mota</a>, Safe & Sound, <a href="https://cronica.bandcamp.com/album/musicamorosa">The Beautiful Schizophonic</a>.',
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
        author: { name: 'Vitor Joaquim', url: 'https://www.youtube.com/@vjoaquim' },
      },
    ],
  },
  {
    id: 'storung-2008',
    date: '2008-09-25',
    title: '<a href="https://ra.co/promoters/4519">Störung</a>',
    venue: { name: 'La Farinera del Clot', url: 'https://farinera.org/', city: 'Barcelona', country: 'Spain' },
    description: 'With <a href="https://kimcascone.bandcamp.com/">Kim Cascone</a>, <a href="https://www.franciscolopez.net/">Francisco López</a>, <a href="https://philippepetit.bandcamp.com/">Philippe Petit</a>, <a href="https://ritornell.bandcamp.com/">Ritornell</a>, Sébastien Roux, Tonne.',
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
    description: 'With <a href="https://svartegreiner.bandcamp.com/">Svarte Greiner</a>, Pygar (<a href="https://vimeo.com/hugoolim">Hugo Olim</a> & <a href="https://opcabpol.bandcamp.com/">João Ricardo</a>), e:4c, CKZ, DeciBeats, Aenedra, Unknown Forces Of Everyday Life.',
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
    title: '<a href="https://digitalinberlin.eu/">MADEIRADIG</a>',
    venue: { name: 'Casa das Mudas', url: 'https://museus.madeira.gov.pt/DetalhesMuseu?museumId=1', city: 'Calheta', country: 'Portugal' },
    description: 'With <a href="https://alogmusic.bandcamp.com/">Alog</a>, <a href="https://vladislavdelay.bandcamp.com/">Vladislav Delay</a>, <a href="https://ranslavin.com/">Ran Slavin</a>.',
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
    title: '<a href="https://digitalinberlin.eu/">MADEIRADIG</a>',
    date: '2006-12-07',
    venue: { name: 'RDP Auditorium', url: 'https://madeira.rtp.pt/', city: 'Funchal', country: 'Portugal' },
    description: 'With <a href="https://phonophani.bandcamp.com/">Phonophani</a> & <a href="https://mariuswatz.com/">Marius Watz</a>, <a href="https://frankbretschneider.bandcamp.com/">Frank Bretschneider</a>.',
  },
  {
    id: 'madeiradig-2005',
    date: '2005-12-07',
    title: '<a href="https://digitalinberlin.eu/">MADEIRADIG</a>',
    venue: { name: 'RDP Auditorium', url: 'https://madeira.rtp.pt/', city: 'Funchal', country: 'Portugal' },
    description: 'Duo with <a href="https://vimeo.com/hugoolim">Hugo Olim</a>. With <a href="https://www.fennesz.com/">Fennesz</a>, <a href="https://florianhecker.blogspot.com/">Florian Hecker</a>, <a href="https://at-c.org/">@c</a> & <a href="https://liaworks.com/">Lia</a>.',
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
      { ...section, items: [...section.items].sort((a, b) => (b.date ?? '').localeCompare(a.date ?? '')) },
    ]),
  );
};

export const sortedLiveData: LiveData = groupEventsByYear(liveEvents);

// Newest year first — the object's own keys enumerate ascending, so sort here.
export const liveYears: string[] = Object.keys(sortedLiveData).sort((a, b) => b.localeCompare(a));
