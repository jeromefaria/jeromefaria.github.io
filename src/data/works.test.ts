import { describe, expect, it } from 'vitest';

import { worksData } from './works';

const allReleases = Object.values(worksData).flatMap(section => section.items);
const KINDS = ['music', 'compilation', 'commission', 'publication', 'engineering'];

describe('worksData', () => {
  it('every release has a known meta kind and a four-digit year', () => {
    for (const release of allReleases) {
      expect(KINDS, `id="${release.id}" kind`).toContain(release.meta.kind);
      expect(release.meta.year, `id="${release.id}" year`).toBeGreaterThanOrEqual(1900);
      expect(release.meta.year, `id="${release.id}" year`).toBeLessThan(2100);
    }
  });

  it('lists mixing/mastering credits newest first', () => {
    const years = (worksData['mixing-and-mastering']?.items ?? []).map(item => item.meta.year);
    expect(years).toEqual([...years].sort((first, second) => second - first));
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
