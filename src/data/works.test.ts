import { describe, expect, it } from 'vitest';

import { releaseYear } from '@/utils/releaseDate';

import { worksData } from './works';

const allReleases = Object.values(worksData).flatMap(section => section.items);
const KINDS = ['music', 'compilation', 'commission', 'publication', 'engineering'];

describe('worksData', () => {
  it('every release has a known meta kind and a valid released date', () => {
    for (const release of allReleases) {
      expect(KINDS, `id="${release.id}" kind`).toContain(release.meta.kind);
      expect(release.meta.released, `id="${release.id}" released`).toMatch(/^\d{4}(-\d{2}(-\d{2})?)?$/);
      expect(releaseYear(release.meta.released), `id="${release.id}" year`).toBeGreaterThanOrEqual(1900);
      expect(releaseYear(release.meta.released), `id="${release.id}" year`).toBeLessThan(2100);
    }
  });

  it('lists every section newest first', () => {
    for (const section of Object.values(worksData)) {
      const years = section.items.map(item => releaseYear(item.meta.released));
      expect(years, section.title).toEqual([...years].sort((first, second) => second - first));
    }
  });

  it('every mixing/mastering credit carries a role; third-party names the artist, own links back', () => {
    const credits = worksData['mixing-and-mastering']?.items ?? [];
    expect(credits.length).toBeGreaterThan(0);

    for (const item of credits) {
      expect(item.meta.kind, `id="${item.id}"`).toBe('engineering');

      if (item.meta.kind === 'engineering') {
        expect(item.meta.roles.length, `id="${item.id}" roles`).toBeGreaterThan(0);

        if (item.externalUrl) {
          expect(item.meta.artist?.name.trim(), `id="${item.id}" artist`).toBeTruthy();
        } else {
          expect(item.worksRef, `id="${item.id}" worksRef`).toBeTruthy();
        }
      }
    }
  });
});
