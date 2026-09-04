import type { WorksSection } from '@/types/works';

export const publications: WorksSection = {
  title: { en: 'Publications', pt: 'Publicações' },
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
      description: {
        en: 'A curated collection of over 200 glitch images grabbed, composed and, in some cases, provoked by artists exploring digital aesthetics and imperfection.',
        pt: 'Uma colectânea de mais de 200 imagens glitch captadas, compostas e, nalguns casos, provocadas por artistas que exploram a estética digital e a imperfeição.',
      },
      credits: {
        style: 'by',
        clauses: [
          { role: 'editingAndCuration', of: '[[Iman Moradi]] and [[Ant Scott]]' },
          { role: 'additionalCuration', of: '[[Joe Gilmore]] and [[Christopher Murphy]]' },
          { role: 'design', of: '[[Qubik]] / Fehler' },
        ],
        note: { en: 'Contributing artists include [[JODI]], [[Kim Cascone]], [[Taylor Deupree]], [[Marius Watz]], [[Mario Klingemann]], [[Lia]], [[Dextro]], [[Jan Robert Leegte]], [[Curt Cloninger]], [[Michael Betancourt]], [[Billy Roisz]], [[Rainer Kohlberger]], [[Tina Frank]], [[Ralph Steinbrüchel]], [[Paul Prudence]], [[Scott Arford]], [[Alessandro Canova]], [[Miguel Carvalhais]], [[Nik Gaffney]], [[Iris Garrelfs]], [[Mathias Gmachl]], [[Jason Kahn]], [[LoVid]], [[Michael Norris]], [[O.K. Parking]], [[Norbert Pfaffenbichler]], [[Per Platou]], [[Andrea Polli]], and others', pt: 'Entre os artistas participantes contam-se [[JODI]], [[Kim Cascone]], [[Taylor Deupree]], [[Marius Watz]], [[Mario Klingemann]], [[Lia]], [[Dextro]], [[Jan Robert Leegte]], [[Curt Cloninger]], [[Michael Betancourt]], [[Billy Roisz]], [[Rainer Kohlberger]], [[Tina Frank]], [[Ralph Steinbrüchel]], [[Paul Prudence]], [[Scott Arford]], [[Alessandro Canova]], [[Miguel Carvalhais]], [[Nik Gaffney]], [[Iris Garrelfs]], [[Mathias Gmachl]], [[Jason Kahn]], [[LoVid]], [[Michael Norris]], [[O.K. Parking]], [[Norbert Pfaffenbichler]], [[Per Platou]], [[Andrea Polli]], entre outros' },
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
          alt: { en: 'Glitch: Designing Imperfection book spread showing colourful digital artefacts and glitch patterns', pt: 'Página dupla do livro Glitch: Designing Imperfection com artefactos digitais coloridos e padrões de glitch' },
        },
        {
          src: '/images/publications/glitch-spread-02.jpg',
          alt: { en: 'Glitch: Designing Imperfection book spread featuring brineiktro\'s Untitled work with screenshots', pt: 'Página dupla do livro Glitch: Designing Imperfection com a obra Untitled de brineiktro e capturas de ecrã' },
        },
        {
          src: '/images/publications/glitch-spread-03.jpg',
          alt: { en: 'Glitch: Designing Imperfection book spread showing Tim Fox and Steven H. Silberg\'s video still glitch works', pt: 'Página dupla do livro Glitch: Designing Imperfection com trabalhos de glitch sobre fotogramas de Tim Fox e Steven H. Silberg' },
        },
        {
          src: '/images/publications/glitch-spread-04.jpg',
          alt: { en: 'Glitch: Designing Imperfection book spread featuring Will Hurt and Michael Norris\' glitch photography', pt: 'Página dupla do livro Glitch: Designing Imperfection com fotografia de glitch de Will Hurt e Michael Norris' },
        },
        {
          src: '/images/publications/glitch-spread-05.jpg',
          alt: { en: 'Glitch: Designing Imperfection book spread showing colourful glitch pattern variations by brineiktro', pt: 'Página dupla do livro Glitch: Designing Imperfection com variações coloridas de padrões de glitch de brineiktro' },
        },
        {
          src: '/images/publications/glitch-spread-06.jpg',
          alt: { en: 'Glitch: Designing Imperfection book spread with cyan and brown glitch patterns', pt: 'Página dupla do livro Glitch: Designing Imperfection com padrões de glitch em ciano e castanho' },
        },
        {
          src: '/images/publications/glitch-spread-07.jpg',
          alt: { en: 'Glitch: Designing Imperfection book spread displaying blue video glitch effects', pt: 'Página dupla do livro Glitch: Designing Imperfection com efeitos de glitch de vídeo em azul' },
        },
        {
          src: '/images/publications/glitch-spread-08.jpg',
          alt: { en: 'Glitch: Designing Imperfection book spread featuring screenshot glitch effects', pt: 'Página dupla do livro Glitch: Designing Imperfection com efeitos de glitch de capturas de ecrã' },
        },
      ],
    },
  ],
};
