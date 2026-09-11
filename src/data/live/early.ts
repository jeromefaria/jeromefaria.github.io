import type { LiveEvent } from '@/types/live';

export const earlyEvents: LiveEvent[] = [
  {
    id: 'madeiradig-2011',
    eventType: ['festival'],
    title: 'MADEIRADIG',
    titleUrl: 'https://digitalinberlin.eu/',
    date: '2011-12-02',
    venue: { name: 'Casa das Mudas', city: 'Calheta', country: 'Portugal' },
    setup: { kind: 'duo', with: { text: 'Taylor Deupree', url: 'https://12k.com/' } },
    bill: [
      { text: 'Tim Hecker', url: 'https://sunblind.net/' },
      { text: 'Oneohtrix Point Never', url: 'https://pointnever.com/' },
      { text: 'KTL', url: 'https://ktl10.bandcamp.com/' },
      { text: 'Deaf Center', url: 'https://deafcenter.bandcamp.com/' },
      [{ text: 'Lee Ranaldo', url: 'https://www.leeranaldo.com/' }, { text: 'Manuel Mota' }],
      { text: 'Nadja', url: 'https://nadja.bandcamp.com/' },
      { text: 'Aki Onda', url: 'https://akionda.net/' },
    ],
    credit: {
      en: 'Presented by [[APCA]] and [[Digital in Berlin]].',
      pt: 'Apresentado pela [[APCA]] e pela [[Digital in Berlin]].',
    },
    imageAlt: { en: 'Jerome Faria and Taylor Deupree performing at MADEIRADIG, Casa das Mudas, Calheta, 2011', pt: 'Jerome Faria e Taylor Deupree a actuar no MADEIRADIG, Casa das Mudas, Calheta, 2011' },
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
        cover: true,
        thumb: { position: '38% center', scale: 1.15, rotate: 1 },
        photographer: { name: 'Valentina Araújo' },
      },
      {
        src: '/images/live/madeiradig-2011-006.jpg',
        photographer: { name: 'Valentina Araújo' },
      },
    ],
    videos: [
      {
        url: 'https://www.youtube-nocookie.com/embed/ymAcKVDmAqg',
        platform: 'youtube',
        title: { en: 'MADEIRADIG 2011 festival lineup spot', pt: 'Vídeo promocional do MADEIRADIG 2011, com o alinhamento do festival' },
        author: { name: 'Die4filmsMadeira', url: 'https://www.youtube.com/@Die4filmsMadeira' },
      },
    ],
  },
  {
    id: 'migractions-2011',
    eventType: ['festival'],
    title: 'Festival Migractions',
    date: '2011-05-23',
    venue: { name: 'Théâtre de L\'Opprimé', url: 'https://www.theatredelopprime.com/', city: 'Paris', country: 'France' },
    setup: { kind: 'duo', with: { text: 'Hugo Olim', suffix: { en: '(visuals)', pt: '(visuais)' } } },
    imageAlt: { en: 'Jerome Faria and Hugo Olim performing at Festival Migractions, Théâtre de L\'Opprimé, Paris, 2011', pt: 'Jerome Faria e Hugo Olim a actuar no Festival Migractions, Théâtre de L\'Opprimé, Paris, 2011' },
    images: [
      {
        src: '/images/live/migractions-2011-001.jpg',
        photographer: { name: 'Sue-Elie Andrade-Dé' },
        thumb: { scale: 1.5 },
      },
      {
        src: '/images/live/migractions-2011-002.jpg',
        photographer: { name: 'Sue-Elie Andrade-Dé' },
      },
    ],
  },
  {
    id: 'olhares-de-outono-2010',
    eventType: ['festival'],
    language: 'pt-PT',
    date: '2010-11-26',
    title: 'Olhares de Outono',
    venue: { name: 'Passos Manuel', url: 'https://passosmanuel.net/', city: 'Porto', country: 'Portugal' },
    setup: { kind: 'solo' },
    format: { kind: 'talk' },
    bill: [
      { text: 'Oval', url: 'https://oval.bandcamp.com/' },
      { text: 'Simon Fisher Turner', url: 'https://simonfisherturner.bandcamp.com/' },
      { text: 'Paul Farrington', url: 'https://www.paul-farrington-design.com/' },
      { text: 'André Gonçalves' },
    ],
    credit: {
      en: 'Presented by [[Universidade Católica do Porto]].',
      pt: 'Apresentado pela [[Universidade Católica do Porto]].',
    },
    imageAlt: { en: 'Jerome Faria performing at Olhares de Outono, Passos Manuel, Porto, 2010', pt: 'Jerome Faria a actuar no Olhares de Outono, Passos Manuel, Porto, 2010' },
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
        cardThumb: { position: 'center 97%' },
        cover: true,
        photographer: { name: 'Olhares de Outono' },
      },
    ],
  },
  {
    id: 'madeiradig-2009',
    eventType: ['festival'],
    date: '2009-12-04',
    title: 'MADEIRADIG',
    titleUrl: 'https://digitalinberlin.eu/',
    venue: { name: 'Casa das Mudas', city: 'Calheta', country: 'Portugal' },
    setup: { kind: 'duo', with: { text: 'Hugo Olim', suffix: { en: '(visuals)', pt: '(visuais)' } } },
    bill: [
      { text: 'Alva Noto', url: 'https://www.alvanoto.com/' },
      { text: 'Murcof', url: 'https://murcof.com/' },
      { text: 'Felix Kubin', url: 'https://felixkubin.com/' },
      { text: 'Christ.', url: 'https://christmusic.bandcamp.com/' },
      [{ text: 'Zavoloka', url: 'https://zavoloka.com/' }, { text: 'Laetitia Morais' }],
      { text: 'Gigantiq', url: 'https://gigantiq.bandcamp.com/' },
      { text: 'Jade', url: 'http://www.jade-enterprises.at/' },
    ],
    credit: {
      en: 'Presented by [[APCA]] and [[Digital in Berlin]].',
      pt: 'Apresentado pela [[APCA]] e pela [[Digital in Berlin]].',
    },
    imageAlt: { en: 'Jerome Faria and Hugo Olim performing at MADEIRADIG, Casa das Mudas, Calheta, 2009', pt: 'Jerome Faria e Hugo Olim a actuar no MADEIRADIG, Casa das Mudas, Calheta, 2009' },
    images: [
      {
        src: '/images/live/madeiradig-2009-001.jpg',
        photographer: { name: 'Miguel Apolinário' },
      },
      {
        src: '/images/live/madeiradig-2009-002.jpg',
        cardThumb: { scale: 1.35, translateX: '8%' },
        cover: true,
        thumb: { position: '15% center' },
        photographer: { name: 'Miguel Apolinário' },
      },
      {
        src: '/images/live/madeiradig-2009-003.jpg',
        photographer: { name: 'Miguel Apolinário' },
      },
      {
        src: '/images/live/madeiradig-2009-004.jpg',
        photographer: { name: 'Miguel Apolinário' },
      },
      {
        src: '/images/live/madeiradig-2009-005.jpg',
        photographer: { name: 'Miguel Apolinário' },
      },
      {
        src: '/images/live/madeiradig-2009-006.jpg',
        photographer: { name: 'Miguel Apolinário' },
      },
    ],
    videos: [
      {
        url: 'https://www.youtube-nocookie.com/embed/csZramO6QDM',
        platform: 'youtube',
        title: { en: 'Jerome Faria and Hugo Olim at MADEIRADIG 2009', pt: 'Jerome Faria e Hugo Olim no MADEIRADIG 2009' },
        author: { name: 'Vítor Joaquim', url: 'https://www.youtube.com/@vjoaquim' },
      },
      {
        url: 'https://player.vimeo.com/video/8088317',
        platform: 'vimeo',
        title: { en: 'Jerome Faria and Hugo Olim at MADEIRADIG 2009', pt: 'Jerome Faria e Hugo Olim no MADEIRADIG 2009' },
        author: { name: 'Hugo Olim', url: 'https://vimeo.com/hugoolim' },
      },
    ],
  },
  {
    id: 'eme-olhares-2009',
    eventType: ['festival'],
    title: 'EME.LL / Olhares de Outono',
    titleUrl: 'https://www.vitorjoaquim.pt/vj.concerts_2009_21.22%20November.htm',
    date: '2009-11-21',
    venue: { name: 'Mosteiro São Bento da Vitória', url: 'https://www.tnsj.pt/en/edificios/mosteiro-de-sao-bento-da-vitoria/', city: 'Porto', country: 'Portugal' },
    setup: {
      kind: 'ensemble',
      name: { en: 'Resampling White Noise — 16-performer laptop meeting', pt: 'Resampling White Noise — encontro de laptops com 16 intérpretes' },
      members: [
        { text: 'Scanner', url: 'https://scannerdot.bandcamp.com/' },
        { text: '@c' },
        { text: 'Vítor Joaquim' },
        { text: 'Carlos Santos', url: 'https://carlossantos.bandcamp.com/' },
        { text: 'Miguel Carvalhais', url: 'https://www.carvalhais.org/' },
        { text: 'Pedro Tudela', url: 'http://pedrotudela.org/' },
        { text: 'Pedro Almeida' },
        { text: 'João Ricardo', url: 'https://opcabpol.bandcamp.com/' },
        { text: 'Ivan Franco', url: 'https://ivanfranco.wordpress.com/' },
        { text: 'Nuno Moita', url: 'https://nunomoita.bandcamp.com/' },
        { text: 'André Gonçalves' },
        { text: 'The Beautiful Schizophonic' },
        { text: 'Rui Costa' },
        { text: 'André Sier' },
        { text: 'Alba Corral', url: 'https://blog.albagcorral.com/' },
        { text: 'Laetitia Morais' },
        { text: 'Hugo Olim' },
      ],
    },
    credit: {
      en: 'Presented by [[Universidade Católica do Porto]].',
      pt: 'Apresentado pela [[Universidade Católica do Porto]].',
    },
    imageAlt: { en: 'Resampling White Noise laptop meeting at EME.LL / Olhares de Outono, Mosteiro São Bento da Vitória, Porto, 2009', pt: 'Encontro de laptops Resampling White Noise no EME.LL / Olhares de Outono, Mosteiro São Bento da Vitória, Porto, 2009' },
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
        cover: true,
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
    eventType: ['festival'],
    date: '2008-10-04',
    title: 'EME — Extensão Madeira',
    venue: { name: 'Casa das Mudas', city: 'Calheta', country: 'Portugal' },
    setup: { kind: 'solo' },
    bill: [
      { text: 'Hauschka' },
      { text: 'The Sight Below' },
    ],
    posters: [
      {
        src: '/images/live/eme-madeira-2008-poster-001.jpg',
        cardThumb: { position: 'center 52%' },
        alt: { en: 'EME 08 — Encontros de Música Experimental poster at Centro das Artes Casa das Mudas, Calheta — Hauschka (Germany), The Sight Below (USA), and NNY / Jerome Faria (Portugal), 4 October 2008', pt: 'Cartaz do EME 08 — Encontros de Música Experimental no Centro das Artes Casa das Mudas, Calheta — Hauschka (Alemanha), The Sight Below (E.U.A.) e NNY / Jerome Faria (Portugal), 4 de Outubro de 2008' },
      },
    ],
  },
  {
    id: 'eme-2008',
    eventType: ['festival'],
    title: 'EME',
    titleUrl: 'https://www.emefestival.org/EME_web_press.html',
    date: '2008-10-01',
    venue: { name: 'Teatro Ibérico', url: 'https://teatroiberico.org/', city: 'Lisbon', country: 'Portugal' },
    setup: { kind: 'solo' },
    bill: [
      { text: 'The Sight Below' },
      { text: 'Greg Haines', url: 'https://greghaines.bandcamp.com/' },
      { text: 'Hauschka' },
      { text: 'Frank Bretschneider' },
      { text: 'Sanso-Xtro', url: 'https://soundcloud.com/sanso-xtro' },
      { text: 'Anna Troisi', url: 'https://annatroisi.org/' },
      { text: 'Tina Frank' },
      { text: 'Carsten Goertz', url: 'https://carstengoertz.cc/' },
      { text: 'André Sier' },
      { text: 'André Gonçalves' },
      { text: 'Garcia', url: 'https://margaridagarcia.bandcamp.com/' },
      { text: 'Machas' },
      [{ text: 'Maranha', url: 'https://davidmaranha.bandcamp.com/' }, { text: 'Mota', url: 'https://manuelmota.bandcamp.com/' }],
      { text: 'Safe & Sound' },
      { text: 'The Beautiful Schizophonic' },
    ],
    imageAlt: { en: 'Jerome Faria performing at EME Festival, Teatro Ibérico, Lisbon, 2008', pt: 'Jerome Faria a actuar no EME Festival, Teatro Ibérico, Lisboa, 2008' },
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
        cardThumb: { position: 'center 97%' },
        cover: true,
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
        title: { en: 'Jerome Faria at EME Festival 2008, Lisbon', pt: 'Jerome Faria no EME Festival 2008, Lisboa' },
        author: { name: 'Vítor Joaquim', url: 'https://www.youtube.com/@vjoaquim' },
      },
    ],
  },
  {
    id: 'storung-2008',
    eventType: ['festival'],
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
      { text: 'Tonne', url: 'https://www.paul-farrington-design.com/' },
    ],
    imageAlt: { en: 'Jerome Faria performing at Störung Festival, La Farinera del Clot, Barcelona, 2008', pt: 'Jerome Faria a actuar no Störung Festival, La Farinera del Clot, Barcelona, 2008' },
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
        cover: true,
        photographer: { name: 'Störung Festival', url: 'https://storung.com/' },
      },
    ],
  },
  {
    id: 'stfu-porto',
    eventType: ['series'],
    date: '2007-03-22',
    title: 'STFU Porto',
    venue: { name: 'Fábrica do Som', url: 'https://fabricadesom.org/', city: 'Porto', country: 'Portugal' },
    setup: { kind: 'solo' },
    bill: [
      { text: 'Svarte Greiner', url: 'https://svartegreiner.bandcamp.com/' },
      { text: 'Pygar ([[Hugo Olim]] & [[João Ricardo]])' },
      { text: 'e:4c' },
      { text: 'CKZ' },
      { text: 'DeciBeats' },
      { text: 'Aenedra', url: 'https://freemusicarchive.org/music/Aenedra/' },
      { text: 'Unknown Forces Of Everyday Life' },
    ],
    imageAlt: { en: 'Jerome Faria performing at STFU Porto, Fábrica do Som, Porto, 2007', pt: 'Jerome Faria a actuar no STFU Porto, Fábrica do Som, Porto, 2007' },
    images: [
      {
        src: '/images/live/stfu-porto-001.jpg',
        photographer: { name: 'STFU Porto' },
      },
      {
        src: '/images/live/stfu-porto-002.jpg',
        cover: true,
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
    eventType: ['festival'],
    date: '2007-12-08',
    title: 'MADEIRADIG',
    titleUrl: 'https://digitalinberlin.eu/',
    venue: { name: 'Casa das Mudas', city: 'Calheta', country: 'Portugal' },
    setup: { kind: 'solo' },
    performedAs: 'NNY',
    bill: [
      { text: 'Alog', url: 'https://alogmusic.bandcamp.com/' },
      [{ text: 'Vítor Joaquim' }, { text: 'Laetitia Morais' }],
      { text: 'Vladislav Delay', url: 'https://vladislavdelay.bandcamp.com/' },
      { text: 'Ran Slavin', url: 'https://ranslavin.com/' },
    ],
    credit: {
      en: 'Presented by [[APCA]] and [[Digital in Berlin]].',
      pt: 'Apresentado pela [[APCA]] e pela [[Digital in Berlin]].',
    },
    imageAlt: { en: 'Jerome Faria performing at MADEIRADIG, Casa das Mudas, Calheta, 2007', pt: 'Jerome Faria a actuar no MADEIRADIG, Casa das Mudas, Calheta, 2007' },
    images: [
      {
        src: '/images/live/madeiradig-2007-001.jpg',
        photographer: { name: 'Marta León' },
      },
      {
        src: '/images/live/madeiradig-2007-002.jpg',
        photographer: { name: 'Marta León' },
      },
      {
        src: '/images/live/madeiradig-2007-003.jpg',
        photographer: { name: 'Marta León' },
      },
      {
        src: '/images/live/madeiradig-2007-004.jpg',
        photographer: { name: 'Marta León' },
      },
      {
        src: '/images/live/madeiradig-2007-005.jpg',
        photographer: { name: 'Marta León' },
      },
      {
        src: '/images/live/madeiradig-2007-006.jpg',
        photographer: { name: 'Marta León' },
      },
      {
        src: '/images/live/madeiradig-2007-007.jpg',
        photographer: { name: 'Marta León' },
      },
      {
        src: '/images/live/madeiradig-2007-008.jpg',
        photographer: { name: 'Marta León' },
      },
      {
        src: '/images/live/madeiradig-2007-009.jpg',
        photographer: { name: 'Marta León' },
      },
      {
        src: '/images/live/madeiradig-2007-010.jpg',
        cover: true,
        photographer: { name: 'Marta León' },
      },
    ],
  },
  {
    id: 'madeiradig-2006',
    eventType: ['festival'],
    title: 'MADEIRADIG',
    titleUrl: 'https://digitalinberlin.eu/',
    date: '2006-12-07',
    venue: { name: 'RDP Auditorium', city: 'Funchal', country: 'Portugal' },
    setup: { kind: 'solo' },
    performedAs: 'NNY',
    bill: [
      [{ text: 'Emi Maeda', url: 'https://lampo.org/archive/emi-maeda-2-2004/' }, { text: 'Lia' }],
      [{ text: 'Phonophani', url: 'https://phonophani.bandcamp.com/' }, { text: 'Marius Watz', url: 'https://mariuswatz.com/' }],
      { text: 'Frank Bretschneider' },
    ],
    credit: {
      en: 'Presented by [[APCA]].',
      pt: 'Apresentado pela [[APCA]].',
    },
  },
  {
    id: 'madeiradig-2005',
    eventType: ['festival'],
    date: '2005-12-07',
    title: 'MADEIRADIG',
    titleUrl: 'https://digitalinberlin.eu/',
    venue: { name: 'RDP Auditorium', city: 'Funchal', country: 'Portugal' },
    setup: { kind: 'duo', with: { text: 'Hugo Olim', suffix: { en: '(visuals)', pt: '(visuais)' } } },
    performedAs: 'NNY',
    bill: [
      { text: 'Fennesz', url: 'https://www.fennesz.com/' },
      [{ text: 'Florian Hecker', url: 'https://florianhecker.blogspot.com/' }, { text: 'Tina Frank' }],
      [{ text: '@c' }, { text: 'Lia' }],
      { text: 'Musiclab' },
      { text: 'Pygar', url: 'https://hugoolim.com/pygar/' },
      { text: 'LB^LC', url: 'https://www.discogs.com/artist/385554-LBLC' },
      [{ text: 'Ruinman' }, { text: 'Redo' }],
    ],
    credit: {
      en: 'Presented by [[APCA]].',
      pt: 'Apresentado pela [[APCA]].',
    },
    imageAlt: { en: 'Jerome Faria and Hugo Olim performing at MADEIRADIG, RDP Auditorium, Funchal, 2005', pt: 'Jerome Faria e Hugo Olim a actuar no MADEIRADIG, Auditório da RDP, Funchal, 2005' },
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
