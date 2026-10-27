import { describe, expect, it } from 'vitest';

import { bios } from '@/data/bios';
import {
  dossierCompilations,
  type DossierCredit,
  dossierEngineering,
  dossierEntryKinds,
  dossierManifest,
  dossierTimeline,
  type DossierTimelineEntry,
} from '@/data/dossier';
import { pressQuotes } from '@/data/press';

const KINDS = new Set<string>(dossierEntryKinds);

const hasBilingualDetail = (entry: DossierTimelineEntry | DossierCredit): boolean =>
  entry.detail.en.trim().length > 0 && entry.detail.pt.trim().length > 0;

describe('dossier data', () => {
  it('lists timeline entries with a 4-digit year, a known kind, a title, and bilingual detail', () => {
    expect(dossierTimeline.length).toBeGreaterThan(0);

    for (const entry of dossierTimeline) {
      expect(entry.year).toMatch(/^\d{4}$/);
      expect(KINDS.has(entry.kind)).toBe(true);
      expect(entry.title.trim().length).toBeGreaterThan(0);
      expect(hasBilingualDetail(entry)).toBe(true);
    }
  });

  it('lists compilation and engineering credits with a year, title, and bilingual detail', () => {
    for (const entry of [...dossierCompilations, ...dossierEngineering]) {
      expect(entry.year).toMatch(/^\d{4}$/);
      expect(entry.title.trim().length).toBeGreaterThan(0);
      expect(hasBilingualDetail(entry)).toBe(true);
    }
  });

  it('keeps the timeline in chronological order', () => {
    const years = dossierTimeline.map(entry => Number(entry.year));

    expect(years).toEqual([...years].sort((a, b) => a - b));
  });

  it('points the bio at a single-string bio variant that exists', () => {
    expect(['short', 'press']).toContain(dossierManifest.bio);
    expect(typeof bios[dossierManifest.bio].en).toBe('string');
  });

  it('references only press quotes that exist', () => {
    const ids = new Set(pressQuotes.map(quote => quote.id));

    for (const id of dossierManifest.featuredPressIds) expect(ids.has(id)).toBe(true);
  });
});
