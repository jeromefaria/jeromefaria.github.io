import { describe, expect, it } from 'vitest';

import { formatMeta } from './formatMeta';

describe('formatMeta', () => {
  it('leads with the format and joins a single edition with the year', () => {
    expect(formatMeta({ format: 'Digital', editions: [{ label: 'BRØQN', catalog: 'BRQN009' }], year: 2026 }))
      .toBe('Digital — BRØQN, BRQN009, 2026');
  });

  it('omits the catalogue when an edition has none', () => {
    expect(formatMeta({ format: 'Theatre', editions: [{ label: 'Teatro' }], year: 2021 }))
      .toBe('Theatre — Teatro, 2021');
  });

  it('joins multiple editions with a slash', () => {
    expect(formatMeta({
      format: 'Digital',
      editions: [{ label: 'BRØQN', catalog: 'BRQN002' }, { label: 'Enough Records', catalog: 'ENRMP296' }],
      year: 2012,
    })).toBe('Digital — BRØQN, BRQN002 / Enough Records, ENRMP296, 2012');
  });

  it('drops the body and dashes straight to the year when there are no editions', () => {
    expect(formatMeta({ format: 'Live Score', editions: [], year: 2013 }))
      .toBe('Live Score — 2013');
  });

  it('leads with the appearance and moves the format into the body', () => {
    expect(formatMeta({
      appearance: 'in <em>Dark Vault</em>',
      format: 'MP3',
      editions: [{ label: 'Enough Records', catalog: 'ENRCMP03' }],
      year: 2004,
    })).toBe('in <em>Dark Vault</em> — MP3, Enough Records, ENRCMP03, 2004');
  });

  it('leads with the credit when there is no appearance', () => {
    expect(formatMeta({ credit: 'various artists', editions: [{ label: 'BRØQN', catalog: 'BRQN007' }], year: 2025 }))
      .toBe('various artists — BRØQN, BRQN007, 2025');
  });

  it('falls back to an empty lead when there is no appearance, credit, or format', () => {
    expect(formatMeta({ editions: [], year: 2020 })).toBe(' — 2020');
  });

  it('appends a note after the year', () => {
    expect(formatMeta({ format: 'Book', editions: [{ label: 'Mark Batty Publisher' }], year: 2009, note: 'ISBN 1-2-3' }))
      .toBe('Book — Mark Batty Publisher, 2009 — ISBN 1-2-3');
  });
});
