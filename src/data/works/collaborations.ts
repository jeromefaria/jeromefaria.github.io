import type { WorksSection } from '@/types/works';

export const collaborations: WorksSection = {
  title: { en: 'Collaborations', pt: 'Colaborações' },
  id: 'collaborations',
  items: [
    {
      id: 'overlapse-xiii',
      title: 'Overlapse XIII',
      bandcampId: '2661997682',
      coverImage: '/images/overlapse-xiii.jpg',
      bandcampUrl: 'https://jeromefaria.bandcamp.com/album/overlapse-xiii',
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
          { role: 'photography', of: '[[Pedro Jafuno]], [[Sue-Elie Andrade-Dé]], and Joana Marote' },
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
};
