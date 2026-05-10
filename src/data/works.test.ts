import { describe, expect, it } from 'vitest';

import { worksData } from './works';

describe('worksData', () => {
  describe('mastering entries', () => {
    const masteringItems = worksData.mastering.items;

    it('every entry has a non-empty title', () => {
      for (const item of masteringItems) {
        expect(item.title.trim(), `id="${item.id}" title`).not.toBe('');
      }
    });

    it('every meta contains an em-dash separating artist from release info', () => {
      for (const item of masteringItems) {
        expect(item.meta, `id="${item.id}" meta`).toMatch(/—/);
      }
    });

    it('every meta ends with a four-digit year', () => {
      for (const item of masteringItems) {
        expect(item.meta, `id="${item.id}" meta`).toMatch(/\d{4}$/);
      }
    });
  });
});
