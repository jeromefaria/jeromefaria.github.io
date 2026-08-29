import { describe, expect, it } from 'vitest';

import { liveEvents, liveYears, sortedLiveData } from './live';

const IMAGE_ALT: Record<string, string> = {
  'showcase-casa-amarela': 'NOx performing at Showcase Casa Amarela, Cooperativa Mula, Barreiro, 2025',
  'fim-de-emissao-45': 'Jerome Faria performing at Fim de Emissão #45, Desterro, Lisbon, 2025',
  'cca-no-desterro': 'NOx performing at CCA no Desterro, Desterro, Lisbon, 2024',
  'amess-teatro-baltazar-dias': 'Jerome Faria performing with Amess at Teatro Municipal Baltazar Dias, Funchal, 2022',
  'amess-museu-franco': 'Jerome Faria performing with Amess at Museu Henrique e Francisco Franco, Funchal, 2022',
  'jejum-11': 'Jerome Faria performing at Jejum #11, Rua das Gaivotas 6, Lisbon, 2022',
  'nariz-entupido': 'Jerome Faria and CAVERNANCIA performing at Nariz Entupido, SMUP, Parede, 2021',
  'aragao-funchal': 'Aragão theatre production at Teatro Municipal Baltazar Dias, Funchal, 2021',
  'heineken-series': 'Jerome Faria performing at Heineken Series, Musicbox, Lisbon, 2015',
  'fica-na-cidade': 'Jerome Faria performing at Fica na Cidade, Praça de Colombo, Funchal, 2015',
  'caligari-live-2': 'Jerome Faria performing The Cabinet of Dr. Caligari at Scat Music Club, Funchal, 2013',
  'caligari-live': 'Jerome Faria performing at Cidades Eletrónicas: The Cabinet of Dr. Caligari, Casa das Mudas, Calheta, 2013',
  'madeiradig-2011': 'Jerome Faria and Taylor Deupree performing at MADEIRADIG, Casa das Mudas, Calheta, 2011',
  'migractions-2011': 'Jerome Faria and Hugo Olim performing at Festival Migractions, Théâtre de L\'Opprimé, Paris, 2011',
  'olhares-de-outono-2010': 'Jerome Faria performing at Olhares de Outono, Passos Manuel, Porto, 2010',
  'madeiradig-2009': 'Jerome Faria and Hugo Olim performing at MADEIRADIG, Casa das Mudas, Calheta, 2009',
  'eme-olhares-2009': 'Resampling White Noise laptop meeting at EME.LL / Olhares de Outono, Mosteiro São Bento da Vitória, Porto, 2009',
  'eme-2008': 'Jerome Faria performing at EME Festival, Teatro Ibérico, Lisbon, 2008',
  'storung-2008': 'Jerome Faria performing at Störung Festival, La Farinera del Clot, Barcelona, 2008',
  'stfu-porto': 'Jerome Faria performing at STFU Porto, Fábrica do Som, Porto, 2007',
  'madeiradig-2007': 'Jerome Faria performing at MADEIRADIG, Casa das Mudas, Calheta, 2007',
  'madeiradig-2005': 'Jerome Faria and Hugo Olim performing at MADEIRADIG, RDP Auditorium, Funchal, 2005',
};

const events = liveEvents;

describe('liveData image alts', () => {
  it('has an imageAlt snapshot for exactly the image-bearing events', () => {
    const withImages = events.filter(event => event.images?.length).map(event => event.id).sort();
    expect(withImages).toEqual(Object.keys(IMAGE_ALT).sort());
  });

  it('preserves each event-level image alt after hoisting', () => {
    for (const event of events) {
      if (event.images?.length) {
        expect(event.imageAlt, `id="${event.id}"`).toBe(IMAGE_ALT[event.id]);
      }
    }
  });
});

describe('liveData posters', () => {
  const POSTERS: Record<string, { src: string; alt: string; artist?: { name: string; url?: string } }[]> = {
    'aragao-funchal': [
      {
        src: '/images/live/aragao-funchal-poster-001.jpg',
        alt: 'Aragão poster — Teatro Municipal Baltazar Dias, Funchal, 22–25 September 2021; text by Rui Zink, staged by Sara Gonçalves',
      },
      {
        src: '/images/live/aragao-funchal-poster-002.jpg',
        alt: 'Aragão programme spread — synopsis and technical credits, Teatro Municipal Baltazar Dias, Funchal, 2021',
      },
    ],
    'showcase-casa-amarela': [
      {
        src: '/images/live/showcase-casa-amarela-poster-001.jpg',
        alt: 'Showcase Casa Amarela poster — Cooperativa Mula, Barreiro, 14 June 2025 — NOx, Copo d\'Água, TiaAvô, Rebolation All-Stars DJ set',
      },
    ],
    'nariz-entupido': [
      {
        src: '/images/live/nariz-entupido-poster-001.jpg',
        alt: 'Nariz Entupido poster — 30 anos SPH / 20 anos Thisco anniversary, SMUP, Parede, 22 October 2021; CAVERNANCIA + Jerome Faria',
        artist: { name: 'André Lemos', url: 'https://www.chilicomcarne.com/index.php/autores/gallery/18' },
      },
    ],
    'festival-multiplo-2026': [
      {
        src: '/images/live/festival-multiplo-2026-poster-001.jpg',
        alt: 'Festival Múltiplo 2026 poster listing the full three-day lineup, Zaratan, Lisbon',
      },
      {
        src: '/images/live/festival-multiplo-2026-poster-002.jpg',
        alt: 'Festival Múltiplo 2026 poster for 23 August at Zaratan, Lisbon — Jerome Faria, Formidolor, Joana de Sá, Double Double',
      },
    ],
  };

  it('has a poster snapshot for exactly the poster-bearing events', () => {
    const withPosters = events.filter(event => event.posters?.length).map(event => event.id).sort();
    expect(withPosters).toEqual(Object.keys(POSTERS).sort());
  });

  it('matches the golden src and alt for every poster', () => {
    for (const event of events) {
      if (event.posters?.length) {
        expect(event.posters, `id="${event.id}"`).toEqual(POSTERS[event.id]);
      }
    }
  });

  it('gives every poster a non-empty alt and a live-images source', () => {
    for (const event of events) {
      for (const poster of event.posters ?? []) {
        expect(poster.alt.trim().length, `id="${event.id}"`).toBeGreaterThan(0);
        expect(poster.src).toMatch(/^\/images\/live\/.+\.jpg$/);
      }
    }
  });
});

describe('liveData year grouping (derived)', () => {
  const YEARS = ['2026', '2025', '2024', '2022', '2021', '2015', '2013', '2012', '2011', '2010', '2009', '2008', '2007', '2006', '2005'];
  const EVENTS_BY_YEAR: Record<string, string[]> = {
    '2005': ['madeiradig-2005'],
    '2006': ['madeiradig-2006'],
    '2007': ['madeiradig-2007', 'stfu-porto'],
    '2008': ['eme-madeira-2008', 'eme-2008', 'storung-2008'],
    '2009': ['madeiradig-2009', 'eme-olhares-2009'],
    '2010': ['olhares-de-outono-2010'],
    '2011': ['madeiradig-2011', 'migractions-2011'],
    '2012': ['cine-qua-non'],
    '2013': ['cognitivopolis', 'caligari-live-3', 'caligari-live-2', 'caligari-live'],
    '2015': ['heineken-series', 'fica-na-cidade'],
    '2021': ['aragao-cartaxo', 'nariz-entupido', 'aragao-funchal', 'reviralho'],
    '2022': ['amess-teatro-baltazar-dias', 'amess-museu-franco', 'jejum-11'],
    '2024': ['cca-no-desterro-august', 'cca-no-desterro'],
    '2025': ['showcase-casa-amarela', 'fim-de-emissao-45'],
    '2026': ['tbc-2026-09-19', 'festival-multiplo-2026'],
  };

  it('derives the same years, newest first', () => {
    expect(liveYears).toEqual(YEARS);
  });

  it('derives each year with the same events in the same order', () => {
    for (const year of liveYears) {
      expect(sortedLiveData[year]?.items.map(event => event.id), `year ${year}`).toEqual(EVENTS_BY_YEAR[year]);
      expect(sortedLiveData[year]?.title, `year ${year}`).toBe(year);
      expect(sortedLiveData[year]?.id, `year ${year}`).toBe(year);
    }
  });

  it('groups every flat event and drops none', () => {
    const grouped = liveYears.reduce((sum, year) => sum + (sortedLiveData[year]?.items.length ?? 0), 0);
    expect(grouped).toBe(liveEvents.length);
  });
});
