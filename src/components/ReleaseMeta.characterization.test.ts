import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';

import { worksData } from '@/data/works';

import ReleaseMeta from './ReleaseMeta.vue';

// Display strings from before meta was normalised — <ReleaseMeta> must
// reproduce the same text and links, proving the migration is invisible.
const ORIGINAL_META: Record<string, string> = {
  'contraplacado': 'Digital — BRØQN, BRQN009, 2026',
  'en-veille': 'Digital — BRØQN, BRQN008, 2026',
  '2504': 'Digital — BRØQN, BRQN006, 2024',
  'caligari-album': 'Digital — BRØQN, BRQN005, 2023',
  'overlapse': 'Digital — BRØQN, BRQN002 / Enough Records, ENRMP296, 2012',
  '1714': 'Digital — BRØQN, BRQN001, 2010',
  'nny-plus': 'CDr — <a href="https://www.discogs.com/label/84424-Almasud-Records">Almasud Records</a>, CDRASUD015, 2007',
  'coil': 'Digital — <a href="https://mimirecords.bandcamp.com/">MiMi Records</a>, MI056, 2006',
  'readerror': 'Digital — <a href="https://mimirecords.bandcamp.com/">MiMi Records</a>, MI031, 2005',
  'ect': 'Digital — <a href="https://www.monocromatica.com/netlabel/">Test Tube</a>, TUBE026, 2005',
  'offear': 'Digital — <a href="https://enoughrecords.scene.org/">Enough Records</a>, ENRMP040, 2004',
  'overlapse-xiii': 'Digital/Cassette — BRØQN, BRQN007, 2025',
  'altar': 'Digital/Cassette — <a href="https://casaamarela.bandcamp.com/">Colectivo Casa Amarela</a>, CCA#035, 2024',
  'depolarized': 'Digital — BRØQN, BRQN003, 2012',
  'aragao': 'Theatre — <a href="https://teatrobaltazardias.funchal.pt/">Teatro Municipal Baltazar Dias</a>, 2021',
  'invisible-other': 'Film — dir. <a href="https://margaridapaiva.net/">Margarida Paiva</a>, 2016',
  'caligari': 'Live Score — 2013',
  'hyphema': 'DVD — Pixelnerve, PXN001, 2008',
  'comp-marrow': 'in <em><a href="https://citiesandmemory.bandcamp.com/album/migration-sounds">Migration Sounds</a></em> — MP3, <a href="https://citiesandmemory.com/">Cities and Memory</a>, 2024',
  'comp-100421': 'in <em><a href="https://descendresalacave.bandcamp.com/album/transmissions-from-the-heart-of-darkness-part-v-elsewhere">Transmissions From The Heart Of Darkness, Part V: Elsewhere</a></em> — MP3, Des Cendres À La Cave, 2013',
  'comp-absence': 'in <em><a href="https://indierockmag.bandcamp.com/album/irm-presents-clashes">IRM Presents: Clashes</a></em> — MP3, Indie Rock Mag, 2012',
  'comp-sustain': 'in <em><a href="https://futuresequence.bandcamp.com/album/sequence4">SEQUENCE4</a></em> — MP3, Future Sequence, SEQ004, 2011',
  'comp-madeiradig11': 'in <em><a href="https://www.discogs.com/release/3345819-Michael-Rosen-What-Does-It-Sound-Like-When-Volcanoes-Start-To-Whisper-Edition-2011-Madeira-Island">What Does It Sound Like When Volcanoes Start To Whisper</a></em> — CD, Madeira Dig, MADEIRADIG2011, 2011',
  'comp-madeiradig09': 'in <em><a href="https://www.discogs.com/release/11528327-Various-What-It-Sounds-Like-When-Flowers-Start-To-Think-edition-09-madeira-island">What It Sounds Like When Flowers Start To Think</a></em> — CD, Madeira Dig, MadeiraDig09, 2009',
  'comp-sand-dune': 'in <em>Baconism</em> — CD/MP3, NIkO, NIKO005, 2008',
  'comp-crystal-space-thisco': 'in <em><a href="https://thisco.bandcamp.com/album/thisagree-shadow">Thisagree & Shadow</a></em> — CD, Thisco, THISK.43, 2008',
  'comp-datacross': 'in <em><a href="https://archive.org/details/enrcmp07">Datacross.1</a></em> — MP3, <a href="https://enoughrecords.scene.org/">Enough Records</a>, ENRCMP07, 2007',
  'comp-cybernetics': 'with Structura in <em><a href="https://archive.org/details/enrcmp05">SOUNDResearch</a></em> — CD/MP3, <a href="https://enoughrecords.scene.org/">Enough Records</a>, ENRCMP05, 2007',
  'comp-13': 'in <em><a href="https://archive.org/details/enrcmp06">Falésia</a></em> — CD/MP3, <a href="https://enoughrecords.scene.org/">Enough Records</a>, ENRCMP06, 2007',
  'comp-twoism': 'in <em><a href="https://twoismrecords.bandcamp.com/album/one-on-twoism-volume-1">One On Twoism</a></em> — MP3, <a href="https://twoismrecords.bandcamp.com/">Twoism Records</a>, OOT001, 2007',
  'comp-332': 'in <em><a href="https://archive.org/details/mimi065">Friends Reinterpretations Of Unreleased 332 Variations Volume 4</a></em> — MP3, <a href="https://archive.org/details/mimi-records">MiMi Records</a>, MI065, 2006',
  'comp-crystal-space-mimi': 'in <em><a href="https://archive.org/details/mimi050">Saudade: V/A from the Atlantic Coast</a></em> — MP3, <a href="https://archive.org/details/mimi-records">MiMi Records</a>, MI050, 2006',
  'comp-valid-specimen': 'in <em><a href="https://archive.org/details/enrcmp03">Dark Vault</a></em> — MP3, <a href="https://enoughrecords.scene.org/">Enough Records</a>, ENRCMP03, 2004',
  'glitch': 'Book — Mark Batty Publisher, 2009 — <a href="https://www.google.com/books/edition/_/3r65PAAACAAJ?hl=en">ISBN 978-0-9799666-6-8</a>',
  'master-overlapse-xiii': 'various artists — BRØQN, BRQN007, 2025',
  'master-open': 'Hugo Calcio — <a href="https://casaamarela.bandcamp.com/">Colectivo Casa Amarela</a>, CCA#016, 2021',
  'master-vessels': '<a href="https://canadian-rifles.bandcamp.com/">Rui P. Andrade</a> — BRØQN, BRQN004, 2012',
};

const allReleases = Object.values(worksData).flatMap(section => section.items);
const normalise = (value: string) => value.replace(/\s+/g, ' ').trim();
const stripTags = (value: string) => value.replace(/<[^>]+>/g, '');
const hrefsOf = (value: string) => [...value.matchAll(/href="([^"]+)"/g)].map(match => match[1]);

describe('ReleaseMeta reproduces the original display for every release', () => {
  it('has a snapshot for every release, and no orphans', () => {
    expect(allReleases.map(release => release.id).sort()).toEqual(Object.keys(ORIGINAL_META).sort());
  });

  it('renders the same visible text and the same links as the pre-normalisation string', () => {
    for (const release of allReleases) {
      const original = ORIGINAL_META[release.id];
      const wrapper = mount(ReleaseMeta, { props: { meta: release.meta } });
      const rendered = wrapper.element.textContent ?? '';

      expect(normalise(rendered), `text id="${release.id}"`).toBe(normalise(stripTags(original)));
      expect(hrefsOf(wrapper.element.outerHTML), `links id="${release.id}"`).toEqual(hrefsOf(original));
    }
  });
});
