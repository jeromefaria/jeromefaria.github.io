import { describe, expect, it } from 'vitest';

import { liveData } from './live';

// The event-level image alt exactly as each was written per-image before it was
// hoisted to the event. Guards the hoist (and future edits) against drift.
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

const events = Object.values(liveData).flatMap(section => section.items);

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
