import { describe, expect, it } from 'vitest';

import { localizePlace } from './exonyms';

describe('localizePlace', () => {
  it('leaves place names untouched for the default (en) locale', () => {
    expect(localizePlace('Lisbon', 'en')).toBe('Lisbon');
    expect(localizePlace('Spain', 'en')).toBe('Spain');
  });

  it('translates known exonyms for pt', () => {
    expect(localizePlace('Lisbon', 'pt')).toBe('Lisboa');
    expect(localizePlace('Spain', 'pt')).toBe('Espanha');
    expect(localizePlace('France', 'pt')).toBe('França');
  });

  it('falls back to the original name when there is no exonym', () => {
    expect(localizePlace('Porto', 'pt')).toBe('Porto');
    expect(localizePlace('Barcelona', 'pt')).toBe('Barcelona');
  });
});
