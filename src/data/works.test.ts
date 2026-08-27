import { describe, expect, it } from 'vitest';

import { worksData } from './works';

const allReleases = Object.values(worksData).flatMap(section => section.items);
const KINDS = ['music', 'compilation', 'commission', 'publication', 'mastering'];

describe('worksData', () => {
  it('every release has a known meta kind and a four-digit year', () => {
    for (const release of allReleases) {
      expect(KINDS, `id="${release.id}" kind`).toContain(release.meta.kind);
      expect(release.meta.year, `id="${release.id}" year`).toBeGreaterThanOrEqual(1900);
      expect(release.meta.year, `id="${release.id}" year`).toBeLessThan(2100);
    }
  });

  it('every mastering entry names the mastered artist', () => {
    for (const item of worksData.mastering.items) {
      expect(item.meta.kind, `id="${item.id}"`).toBe('mastering');

      if (item.meta.kind === 'mastering') {
        expect(item.meta.artist.name.trim(), `id="${item.id}" artist`).toBeTruthy();
      }
    }
  });
});
