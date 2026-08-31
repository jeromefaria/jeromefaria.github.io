import type { EngineeringRole, Release, WorksData } from '@/types/works';

export const worksData: WorksData = {
  solo: {
    title: 'Solo',
    id: 'solo',
    items: [
      {
        id: 'contraplacado',
        title: 'Contraplacado',
        bandcampId: '219697804',
        coverImage: '/images/contraplacado.jpg',
        bandcampUrl: 'https://music.jeromefaria.com/album/contraplacado',
        soundcloudUrl: 'https://soundcloud.com/jeromefaria/sets/contraplacado',
        meta: {
          kind: 'music',
          mediums: ['Digital'],
          editions: [{ label: { text: 'BRØQN' }, catalog: 'BRQN009' }],
          year: 2026,
        },
        tracklist: [
          { title: 'Contraplacado (Se Deus nos der vida e saúde)' },
        ],
        credits: {
          style: 'by',
          clauses: [
            { role: 'music', of: 'Jerome Faria', tail: ', reinterpreting "Contraplacado" by [[Aires]]' },
            { role: 'photography', of: 'NASA, ESA, CSA, STScI' },
          ],
        },
        contributors: [
          { name: 'Aires', url: 'https://aires.bandcamp.com/' },
        ],
      },
      {
        id: 'en-veille',
        title: 'En Veille',
        bandcampId: '310471498',
        coverImage: '/images/en-veille.jpg',
        bandcampUrl: 'https://music.jeromefaria.com/album/en-veille',
        soundcloudUrl: 'https://soundcloud.com/jeromefaria/sets/en-veille',
        meta: {
          kind: 'music',
          mediums: ['Digital'],
          editions: [{ label: { text: 'BRØQN' }, catalog: 'BRQN008' }],
          year: 2026,
        },
        tracklist: [
          { title: 'En Veille' },
        ],
        credits: {
          style: 'by',
          clauses: [
            { role: 'music', of: 'Jerome Faria' },
            { role: 'photography', of: 'Else Siegel' },
          ],
          note: 'Pour Éliane Radigue, 1932–2026',
        },
      },
      {
        id: '2504',
        title: '2504',
        bandcampId: '1275977827',
        coverImage: '/images/2504.jpg',
        bandcampUrl: 'https://music.jeromefaria.com/album/2504',
        soundcloudUrl: 'https://soundcloud.com/jeromefaria/sets/april-25',
        meta: {
          kind: 'music',
          mediums: ['Digital'],
          editions: [{ label: { text: 'BRØQN' }, catalog: 'BRQN006' }],
          year: 2024,
        },
        tracklist: [
          { title: 'Prólogo: Estado Novo', start: 0 },
          { title: 'Fado: Estados Socialistas', start: 212 },
          { title: 'Fátima: Estados Ditos Comunistas', start: 572 },
          { title: 'Futebol: Estados Capitalistas', start: 932 },
          { title: 'Epílogo: Estado a Que Chegamos', start: 1292 },
        ],
        credits: {
          style: 'by',
          clauses: [{ role: 'music', of: 'Jerome Faria' }],
        },
      },
      {
        id: 'caligari-album',
        title: 'Music Written & Performed for The Cabinet of Dr. Caligari',
        bandcampId: '2395712384',
        coverImage: '/images/caligari.jpg',
        bandcampUrl: 'https://music.jeromefaria.com/album/music-written-performed-for-the-cabinet-of-dr-caligari',
        soundcloudUrl: 'https://soundcloud.com/jeromefaria/sets/music-written-performed-for-the-cabinet-of-dr-caligari',
        meta: {
          kind: 'music',
          mediums: ['Digital'],
          editions: [{ label: { text: 'BRØQN' }, catalog: 'BRQN005' }],
          year: 2023,
        },
        tracklist: [
          { title: 'Spirits Surround Us On Every Side' },
          { title: 'Awaken For A Moment From Your Dark Night' },
          { title: 'How Long Will I Live?' },
          { title: "It Couldn't Have Been Cesare..." },
          { title: 'We Who Are Of Noble Blood May Not Follow The Wishes Of Our Hearts' },
        ],
        credits: {
          style: 'by',
          clauses: [{ role: 'music', of: 'Jerome Faria' }],
          note: 'Cover image from the film',
        },
      },
      {
        id: 'overlapse',
        title: 'Overlapse',
        bandcampId: '1643026936',
        coverImage: '/images/overlapse.jpg',
        bandcampUrl: 'https://music.jeromefaria.com/album/overlapse',
        soundcloudUrl: 'https://soundcloud.com/jeromefaria/sets/overlapse',
        meta: {
          kind: 'music',
          mediums: ['Digital'],
          editions: [{ label: { text: 'BRØQN' }, catalog: 'BRQN002' }, { label: { text: 'Enough Records' }, catalog: 'ENRMP296' }],
          year: 2012,
        },
        tracklist: [
          { title: 'Attack (Prelude)' },
          { title: 'Sustain I' },
          { title: 'Sustain II' },
          { title: 'Decay I' },
          { title: 'Decay II' },
          { title: 'Decay III' },
          { title: 'Release (Conclusion)' },
        ],
        credits: {
          style: 'by',
          clauses: [
            { role: 'musicAndArtwork', of: 'Jerome Faria' },
            { role: 'photography', of: 'Joana Marote' },
          ],
        },
      },
      {
        id: '1714',
        title: '17:14',
        bandcampId: '2845412685',
        coverImage: '/images/1714.jpg',
        bandcampUrl: 'https://music.jeromefaria.com/album/17-14',
        soundcloudUrl: 'https://soundcloud.com/jeromefaria/sets/seventeen-fourteen',
        meta: {
          kind: 'music',
          mediums: ['Digital'],
          editions: [{ label: { text: 'BRØQN' }, catalog: 'BRQN001' }],
          year: 2010,
        },
        tracklist: [
          { title: '8:58' },
          { title: '2:58' },
          { title: '5:18' },
        ],
        credits: {
          style: 'by',
          clauses: [{ role: 'musicAndArtwork', of: 'Jerome Faria' }],
        },
      },
    ],
  },
  nny: {
    title: 'NNY (2004–2009)',
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
  },
  collaborations: {
    title: 'Collaborations',
    id: 'collaborations',
    items: [
      {
        id: 'overlapse-xiii',
        title: 'Overlapse XIII',
        bandcampId: '2661997682',
        coverImage: '/images/overlapse-xiii.jpg',
        bandcampUrl: 'https://music.jeromefaria.com/album/overlapse-xiii',
        soundcloudUrl: 'https://soundcloud.com/jeromefaria/sets/overlapse-xiii',
        engineering: ['mastering'],
        meta: {
          kind: 'music',
          mediums: ['Digital', 'Cassette'],
          editions: [{ label: { text: 'BRØQN' }, catalog: 'BRQN007' }],
          year: 2025,
        },
        tracklist: [
          { title: 'Attack (Prelude)', artist: { name: 'CAVERNANCIA', url: 'https://cavernancia.bandcamp.com/' } },
          { title: 'Sustain II (D00MRemix)', artist: { name: 'Tren Go! Sound System', url: 'https://trengosoundsystem.bandcamp.com/' } },
          { title: 'Overlapse Supercut', artist: { name: 'Aires', url: 'https://aires.bandcamp.com/' } },
          { title: 'Release', artist: { name: 'Fábio Fernandes' } },
          { title: 'Decay III (Sound Kintsugi)', artist: { name: 'João de Nóbrega Pupo', url: 'https://www.instagram.com/jppupo/' } },
          { title: 'Declínio', artist: { name: 'João Vairinhos', url: 'https://joaovairinhos.bandcamp.com/' } },
          { title: 'Costa Norte', artist: { name: 'sol' } },
          { title: 'Release (Conclusion)', artist: { name: 'W. R. Pyo', url: 'https://wrpyo.bandcamp.com/' } },
        ],
        credits: {
          style: 'by',
          clauses: [
            { role: 'artwork', of: 'Jerome Faria' },
            { role: 'photography', of: '[[Pedro Jafuno]], [[Sue-Elie Andrade-Dé]], Joana Marote' },
          ],
        },
        contributors: [
          { name: 'Pedro Jafuno', url: 'https://www.instagram.com/jafuno/' },
          { name: 'Sue-Elie Andrade-Dé', url: 'https://cargocollective.com/sueelieandradede' },
        ],
      },
      {
        id: 'altar',
        title: 'ALTAR',
        bandcampId: '2165800616',
        coverImage: '/images/altar.jpg',
        bandcampUrl: 'https://casaamarela.bandcamp.com/album/altar',
        meta: {
          kind: 'music',
          mediums: ['Digital', 'Cassette'],
          editions: [{ label: { text: 'Colectivo Casa Amarela', url: 'https://casaamarela.bandcamp.com/' }, catalog: 'CCA#035' }],
          year: 2024,
        },
        tracklist: [
          { title: 'A' },
          { title: 'L' },
          { title: 'T' },
          { title: 'A' },
          { title: 'R' },
        ],
        credits: {
          style: 'by',
          clauses: [
            { role: 'music', of: 'Pedro Roque and Jerome Faria' },
            { role: 'artwork', of: '[[Mafalda Melim]]' },
          ],
        },
        contributors: [
          { name: 'Mafalda Melim', url: 'https://www.instagram.com/mafaldappm/' },
        ],
        videos: [
          {
            url: 'https://www.youtube-nocookie.com/embed/3b3pM8URdVc',
            platform: 'youtube',
            title: 'NOx - ALTAR',
            author: { name: 'NOx', url: 'https://www.youtube.com/@noxexposure' },
          },
        ],
      },
      {
        id: 'depolarized',
        title: 'Depolarized',
        coverImage: '/images/depolarized.jpg',
        externalUrl: 'https://archive.org/details/brqn-003-jerome-faria-nelson-p.-ferreira-01-depolarized',
        meta: {
          kind: 'music',
          mediums: ['Digital'],
          editions: [{ label: { text: 'BRØQN' }, catalog: 'BRQN003' }],
          year: 2012,
        },
        tracklist: [
          { title: 'Depolarized' },
        ],
        credits: {
          style: 'by',
          clauses: [{ role: 'musicAndArtwork', of: 'Jerome Faria and Nelson P. Ferreira' }],
        },
      },
    ],
  },
  film: {
    title: 'Scores',
    id: 'film',
    items: [
      {
        id: 'aragao',
        title: 'ARAGÃO',
        coverImage: '/images/aragao.jpg',
        meta: {
          kind: 'commission',
          work: 'Theatre',
          venue: { text: 'Teatro Municipal Baltazar Dias', url: 'https://teatrobaltazardias.funchal.pt/' },
          year: 2021,
        },
        description: 'Theatre production celebrating the centenary of <a href="https://pt.wikipedia.org/wiki/Ant%C3%B3nio_Arag%C3%A3o">António Aragão</a>, a founder of Experimental Poetry in Portugal. Conceived as a performative-sonic-visual event. Faria provided both original music and live interpretation—embedding himself in a multidisciplinary creative team rather than delivering a score from a distance.',
        credits: {
          style: 'colon',
          clauses: [
            { role: 'direction', of: 'Sara Gonçalves' },
            { role: 'text', of: '[[Rui Zink]]' },
            { role: 'setDesign', of: '[[José Manuel Castanheira]]' },
            { role: 'video', of: 'Filipe Ferraz' },
            { role: 'musicAndLiveInterpretation', of: 'Jerome Faria' },
          ],
        },
        contributors: [
          { name: 'Rui Zink', url: 'https://pt.wikipedia.org/wiki/Rui_Zink' },
          { name: 'José Manuel Castanheira', url: 'https://pt.wikipedia.org/wiki/Jos%C3%A9_Manuel_Castanheira' },
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
        id: 'invisible-other',
        title: 'Invisible Other',
        coverImage: '/images/invisible-other.jpg',
        meta: {
          kind: 'commission',
          work: 'Film',
          director: { text: 'Margarida Paiva', url: 'https://margaridapaiva.net/' },
          year: 2016,
        },
        description: 'Original score for film by Portuguese-Norwegian visual artist Margarida Paiva. The film depicts a park as a closed world where anonymous characters drift past one another, bound only by gestures and glances.',
        credits: {
          style: 'colon',
          clauses: [
            { role: 'producer', of: 'Rune Sandnes' },
            { role: 'cinematography', of: '[[Diogo Castro]]' },
            { role: 'music', of: 'Jerome Faria' },
            { role: 'soundDesign', of: '[[Duarte Ferreira]]' },
            { role: 'soundEditor', of: '[[Pedro Anacleto]]' },
            { role: 'editing', of: 'Margarida Paiva' },
            { role: 'cast', of: '[[Susana Chiocca]], Alexandre Osório, Helena Carneiro, [[João Pamplona]], [[Susana Madeira]], Mariana L. Ferreira' },
            { role: 'shot', of: '[[Jardim Botânico do Porto]]', connector: 'at' },
          ],
        },
        contributors: [
          { name: 'Diogo Castro', url: 'https://www.instagram.com/diogocastrofilm/' },
          { name: 'Duarte Ferreira', url: 'https://www.linkedin.com/in/dvarte/' },
          { name: 'Pedro Anacleto', url: 'https://www.instagram.com/ochocobogordo/' },
          { name: 'Susana Chiocca', url: 'https://chiocca.wixsite.com/susanachiocca' },
          { name: 'João Pamplona', url: 'https://agenteanorte.com/en/atores-exclusivos/joao-pamplona/' },
          { name: 'Susana Madeira', url: 'https://agenteanorte.com/en/atores-exclusivos/susana-madeira/' },
          { name: 'Jardim Botânico do Porto', url: 'https://mhnc.up.pt/pt/jardim-botanico-da-universidade-do-porto/' },
        ],
      },
      {
        id: 'caligari',
        title: 'The Cabinet of Dr. Caligari',
        coverImage: '/images/caligari-live.jpg',
        meta: {
          kind: 'commission',
          work: 'Live Score',
          year: 2013,
        },
        description: 'Live score for <a href="https://en.wikipedia.org/wiki/Robert_Wiene">Robert Wiene</a>\'s 1920 expressionist silent film. Working against Wiene\'s angular expressionist nightmare, the score creates a dialogue spanning a century of sonic possibility—honouring the film\'s unease while exploring territories the original could never have envisioned.',
        credits: {
          style: 'by',
          clauses: [
            { role: 'music', of: 'Jerome Faria' },
            { role: 'performed', of: 'Jerome Faria and [[Nuno Filipe]]' },
          ],
        },
        contributors: [
          { name: 'Nuno Filipe', url: 'https://nunoandtheend.bandcamp.com/' },
        ],
      },
      {
        id: 'hyphema',
        title: 'Hyphema',
        coverImage: '/images/hyphema.jpg',
        meta: {
          kind: 'commission',
          work: 'DVD',
          publisher: { label: { text: 'Pixelnerve' }, catalog: 'PXN001' },
          year: 2008,
        },
        description: 'A collaborative effort between sound artist Jerome Faria and programmer <a href="https://pixelnerve.com/">Victor Martins</a>, documenting experiments in audiovisual composition. The project was presented both as a live performance and as this DVD release.',
        tracklist: [
          { title: '0x00' },
          { title: '0x01' },
          { title: '0x02' },
          { title: '0x03' },
          { title: '0x04' },
          { title: '0xFF' },
        ],
        credits: {
          style: 'by',
          clauses: [
            { role: 'music', of: 'Jerome Faria' },
            { role: 'visuals', of: '[[Victor Martins]]' },
            { role: 'artwork', of: 'Frederico Cunha' },
          ],
        },
        contributors: [
          { name: 'Victor Martins', url: 'https://pixelnerve.com/' },
        ],
      },
    ],
  },
  compilations: {
    title: 'Compilations',
    id: 'compilations',
    items: [
      {
        id: 'comp-marrow',
        title: 'Marrow',
        meta: {
          kind: 'compilation',
          compilation: { text: 'Migration Sounds', url: 'https://citiesandmemory.bandcamp.com/album/migration-sounds' },
          mediums: ['MP3'],
          editions: [{ label: { text: 'Cities and Memory', url: 'https://citiesandmemory.com/' } }],
          year: 2024,
        },
      },
      {
        id: 'comp-100421',
        title: '100421',
        meta: {
          kind: 'compilation',
          compilation: { text: 'Transmissions From The Heart Of Darkness, Part V: Elsewhere', url: 'https://descendresalacave.bandcamp.com/album/transmissions-from-the-heart-of-darkness-part-v-elsewhere' },
          mediums: ['MP3'],
          editions: [{ label: { text: 'Des Cendres À La Cave' } }],
          year: 2013,
        },
      },
      {
        id: 'comp-absence',
        title: 'Absence of Light',
        meta: {
          kind: 'compilation',
          compilation: { text: 'IRM Presents: Clashes', url: 'https://indierockmag.bandcamp.com/album/irm-presents-clashes' },
          mediums: ['MP3'],
          editions: [{ label: { text: 'Indie Rock Mag' } }],
          year: 2012,
        },
      },
      {
        id: 'comp-sustain',
        title: 'Sustain I',
        meta: {
          kind: 'compilation',
          compilation: { text: 'SEQUENCE4', url: 'https://futuresequence.bandcamp.com/album/sequence4' },
          mediums: ['MP3'],
          editions: [{ label: { text: 'Future Sequence' }, catalog: 'SEQ004' }],
          year: 2011,
        },
      },
      {
        id: 'comp-madeiradig11',
        title: 'Untitled #2',
        meta: {
          kind: 'compilation',
          compilation: { text: 'What Does It Sound Like When Volcanoes Start To Whisper', url: 'https://www.discogs.com/release/3345819-Michael-Rosen-What-Does-It-Sound-Like-When-Volcanoes-Start-To-Whisper-Edition-2011-Madeira-Island' },
          mediums: ['CD'],
          editions: [{ label: { text: 'Madeira Dig' }, catalog: 'MADEIRADIG2011' }],
          year: 2011,
        },
      },
      {
        id: 'comp-madeiradig09',
        title: 'Ethereal / Dew',
        meta: {
          kind: 'compilation',
          compilation: { text: 'What It Sounds Like When Flowers Start To Think', url: 'https://www.discogs.com/release/11528327-Various-What-It-Sounds-Like-When-Flowers-Start-To-Think-edition-09-madeira-island' },
          mediums: ['CD'],
          editions: [{ label: { text: 'Madeira Dig' }, catalog: 'MadeiraDig09' }],
          year: 2009,
        },
      },
      {
        id: 'comp-sand-dune',
        title: 'Sand Dune',
        meta: {
          kind: 'compilation',
          compilation: { text: 'Baconism' },
          mediums: ['CD', 'MP3'],
          editions: [{ label: { text: 'NIkO' }, catalog: 'NIKO005' }],
          year: 2008,
        },
      },
      {
        id: 'comp-crystal-space-thisco',
        title: 'Crystal Space',
        meta: {
          kind: 'compilation',
          compilation: { text: 'Thisagree & Shadow', url: 'https://thisco.bandcamp.com/album/thisagree-shadow' },
          mediums: ['CD'],
          editions: [{ label: { text: 'Thisco' }, catalog: 'THISK.43' }],
          year: 2008,
        },
      },
      {
        id: 'comp-datacross',
        title: '090407001 / 090407003',
        meta: {
          kind: 'compilation',
          compilation: { text: 'Datacross.1', url: 'https://archive.org/details/enrcmp07' },
          mediums: ['MP3'],
          editions: [{ label: { text: 'Enough Records', url: 'https://enoughrecords.scene.org/' }, catalog: 'ENRCMP07' }],
          year: 2007,
        },
      },
      {
        id: 'comp-cybernetics',
        title: 'Cybernetics',
        meta: {
          kind: 'compilation',
          compilation: { text: 'SOUNDResearch', url: 'https://archive.org/details/enrcmp05' },
          collaborators: ['Structura'],
          mediums: ['CD', 'MP3'],
          editions: [{ label: { text: 'Enough Records', url: 'https://enoughrecords.scene.org/' }, catalog: 'ENRCMP05' }],
          year: 2007,
        },
      },
      {
        id: 'comp-13',
        title: '13',
        meta: {
          kind: 'compilation',
          compilation: { text: 'Falésia', url: 'https://archive.org/details/enrcmp06' },
          mediums: ['CD', 'MP3'],
          editions: [{ label: { text: 'Enough Records', url: 'https://enoughrecords.scene.org/' }, catalog: 'ENRCMP06' }],
          year: 2007,
        },
      },
      {
        id: 'comp-twoism',
        title: 'Perpetual / Crowded Desert',
        meta: {
          kind: 'compilation',
          compilation: { text: 'One On Twoism', url: 'https://twoismrecords.bandcamp.com/album/one-on-twoism-volume-1' },
          mediums: ['MP3'],
          editions: [{ label: { text: 'Twoism Records', url: 'https://twoismrecords.bandcamp.com/' }, catalog: 'OOT001' }],
          year: 2007,
        },
      },
      {
        id: 'comp-332',
        title: '332 Variation (NNY mix)',
        meta: {
          kind: 'compilation',
          compilation: { text: 'Friends Reinterpretations Of Unreleased 332 Variations Volume 4', url: 'https://archive.org/details/mimi065' },
          mediums: ['MP3'],
          editions: [{ label: { text: 'MiMi Records', url: 'https://archive.org/details/mimi-records' }, catalog: 'MI065' }],
          year: 2006,
        },
      },
      {
        id: 'comp-crystal-space-mimi',
        title: 'Crystal Space',
        meta: {
          kind: 'compilation',
          compilation: { text: 'Saudade: V/A from the Atlantic Coast', url: 'https://archive.org/details/mimi050' },
          mediums: ['MP3'],
          editions: [{ label: { text: 'MiMi Records', url: 'https://archive.org/details/mimi-records' }, catalog: 'MI050' }],
          year: 2006,
        },
      },
      {
        id: 'comp-valid-specimen',
        title: 'Valid Specimen',
        meta: {
          kind: 'compilation',
          compilation: { text: 'Dark Vault', url: 'https://archive.org/details/enrcmp03' },
          mediums: ['MP3'],
          editions: [{ label: { text: 'Enough Records', url: 'https://enoughrecords.scene.org/' }, catalog: 'ENRCMP03' }],
          year: 2004,
        },
      },
    ],
  },
  publications: {
    title: 'Publications',
    id: 'publications',
    items: [
      {
        id: 'glitch',
        title: 'Glitch: Designing Imperfection',
        coverImage: '/images/glitch.jpg',
        externalUrl: 'https://www.amazon.com/Glitch-Designing-Imperfection-Iman-Moradi/dp/0979966663',
        meta: {
          kind: 'publication',
          publisher: { text: 'Mark Batty Publisher' },
          isbn: { value: '978-0-9799666-6-8', url: 'https://www.google.com/books/edition/_/3r65PAAACAAJ?hl=en' },
          year: 2009,
        },
        description: 'A curated collection of over 200 glitch images grabbed, composed and, in some cases, provoked by artists exploring digital aesthetics and imperfection. Jerome Faria contributed work alongside notable artists from the international glitch art community.',
        credits: {
          style: 'by',
          clauses: [
            { role: 'editingAndCuration', of: '[[Iman Moradi]] and [[Ant Scott]]' },
            { role: 'additionalCuration', of: '[[Joe Gilmore]] and [[Christopher Murphy]]' },
            { role: 'design', of: '[[Qubik]] / Fehler' },
          ],
          note: 'Contributing artists include [[JODI]], [[Kim Cascone]], [[Taylor Deupree]], [[Marius Watz]], [[Mario Klingemann]], [[Lia]], [[Dextro]], [[Jan Robert Leegte]], [[Curt Cloninger]], [[Michael Betancourt]], [[Billy Roisz]], [[Rainer Kohlberger]], [[Tina Frank]], [[Ralph Steinbrüchel]], [[Paul Prudence]], [[Scott Arford]], [[Alessandro Canova]], [[Miguel Carvalhais]], [[Nik Gaffney]], [[Iris Garrelfs]], [[Mathias Gmachl]], [[Jason Kahn]], [[LoVid]], [[Michael Norris]], [[O.K. Parking]], [[Norbert Pfaffenbichler]], [[Per Platou]], [[Andrea Polli]], and others',
        },
        contributors: [
          { name: 'Iman Moradi', url: 'https://organised.info/' },
          { name: 'Ant Scott', url: 'https://www.beflix.com/' },
          { name: 'Joe Gilmore', url: 'https://qubik.com/' },
          { name: 'Christopher Murphy', url: 'https://en.wikipedia.org/wiki/Christopher_Murphy_(designer)' },
          { name: 'Qubik', url: 'https://qubik.com/' },
          { name: 'JODI', url: 'https://jodi.org/' },
          { name: 'Kim Cascone', url: 'https://kimcascone.bandcamp.com/' },
          { name: 'Taylor Deupree', url: 'https://www.12k.com/artist/deupree-taylor/' },
          { name: 'Marius Watz', url: 'https://mariuswatz.com/' },
          { name: 'Mario Klingemann', url: 'https://quasimondo.com/' },
          { name: 'Lia', url: 'https://liaworks.com/' },
          { name: 'Dextro', url: 'https://cargocollective.com/dextroorg' },
          { name: 'Jan Robert Leegte', url: 'https://leegte.org/' },
          { name: 'Curt Cloninger', url: 'https://lab404.com/' },
          { name: 'Michael Betancourt', url: 'https://michaelbetancourt.com/' },
          { name: 'Billy Roisz', url: 'https://billyroisz.klingt.org/' },
          { name: 'Rainer Kohlberger', url: 'https://kohlberger.net/' },
          { name: 'Tina Frank', url: 'https://www.tinafrank.net/' },
          { name: 'Ralph Steinbrüchel', url: 'https://www.12k.com/artist/steinbruchel/' },
          { name: 'Paul Prudence', url: 'https://www.paulprudence.com/' },
          { name: 'Scott Arford', url: 'https://7hz.org/' },
          { name: 'Alessandro Canova', url: 'https://canova.bandcamp.com/' },
          { name: 'Miguel Carvalhais', url: 'https://www.carvalhais.org/' },
          { name: 'Nik Gaffney', url: 'https://resilients.net/people/nik/' },
          { name: 'Iris Garrelfs', url: 'https://irisgarrelfs.com/' },
          { name: 'Mathias Gmachl', url: 'https://mathiasgmachl.com/' },
          { name: 'Jason Kahn', url: 'https://jasonkahn.net/' },
          { name: 'LoVid', url: 'https://lovid.org/' },
          { name: 'Michael Norris', url: 'https://www.michaelnorris.info/' },
          { name: 'O.K. Parking', url: 'https://ok-parking.nl/' },
          { name: 'Norbert Pfaffenbichler', url: 'https://norbertpfaffenbichler.com/' },
          { name: 'Per Platou', url: 'https://perplatou.info/' },
          { name: 'Andrea Polli', url: 'https://andreapolli.com/' },
        ],
        images: [
          {
            src: '/images/publications/glitch-spread-01.jpg',
            alt: 'Glitch: Designing Imperfection book spread showing colourful digital artefacts and glitch patterns',
          },
          {
            src: '/images/publications/glitch-spread-02.jpg',
            alt: 'Glitch: Designing Imperfection book spread featuring brineiktro\'s Untitled work with screenshots',
          },
          {
            src: '/images/publications/glitch-spread-03.jpg',
            alt: 'Glitch: Designing Imperfection book spread showing Tim Fox and Steven H. Silberg\'s video still glitch works',
          },
          {
            src: '/images/publications/glitch-spread-04.jpg',
            alt: 'Glitch: Designing Imperfection book spread featuring Will Hurt and Michael Norris\' glitch photography',
          },
          {
            src: '/images/publications/glitch-spread-05.jpg',
            alt: 'Glitch: Designing Imperfection book spread showing colourful glitch pattern variations by brineiktro',
          },
          {
            src: '/images/publications/glitch-spread-06.jpg',
            alt: 'Glitch: Designing Imperfection book spread with cyan and brown glitch patterns',
          },
          {
            src: '/images/publications/glitch-spread-07.jpg',
            alt: 'Glitch: Designing Imperfection book spread displaying blue video glitch effects',
          },
          {
            src: '/images/publications/glitch-spread-08.jpg',
            alt: 'Glitch: Designing Imperfection book spread featuring screenshot glitch effects',
          },
        ],
      },
    ],
  },
  'mixing-and-mastering': {
    title: 'Mixing & Mastering',
    id: 'mixing-and-mastering',
    items: [
      {
        id: 'master-open',
        title: 'Open',
        externalUrl: 'https://casaamarela.bandcamp.com/album/open',
        meta: {
          kind: 'engineering',
          roles: ['mastering'],
          artist: { name: 'Hugo Calcio' },
          editions: [{ label: { text: 'Colectivo Casa Amarela', url: 'https://casaamarela.bandcamp.com/' }, catalog: 'CCA#016' }],
          year: 2021,
        },
      },
      {
        id: 'master-vessels',
        title: 'Vessels',
        externalUrl: 'https://archive.org/details/brqn-004-rui-p.-andrade-01-what-hath-god-wrought',
        meta: {
          kind: 'engineering',
          roles: ['mastering'],
          artist: { name: 'Rui P. Andrade', url: 'https://canadian-rifles.bandcamp.com/' },
          editions: [{ label: { text: 'BRØQN' }, catalog: 'BRQN004' }],
          year: 2012,
        },
      },
    ],
  },
};

const ownEngineeringCredits: Release[] = Object.values(worksData).flatMap(section =>
  section.items
    .filter((release): release is Release & { engineering: EngineeringRole[] } => Boolean(release.engineering?.length))
    .map(release => ({
      id: `engineering-${release.id}`,
      worksRef: release.id,
      title: release.title,
      meta: {
        kind: 'engineering' as const,
        roles: release.engineering,
        editions: 'editions' in release.meta ? release.meta.editions : [],
        year: release.meta.year,
      },
    })));

worksData['mixing-and-mastering']?.items.push(...ownEngineeringCredits);

// Every section lists newest first — a derived invariant, so entries can be authored in any order.
for (const section of Object.values(worksData)) {
  section.items.sort((first, second) => second.meta.year - first.meta.year);
}

export const worksSections: string[] = Object.keys(worksData);
