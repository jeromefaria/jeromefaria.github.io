import { describe, expect, it, vi } from 'vitest';

import { resolveEventVenue } from './resolveVenue';

vi.mock('@/data/venues', () => ({
  venues: {
    full: { name: 'Full Venue', url: 'https://full.example/', label: { en: 'Full', pt: 'Completo' }, pt: { gender: 'm' } },
    bare: { name: 'Bare Venue' },
  },
}));

describe('resolveEventVenue', () => {
  it('resolves a ref to the registry name, url, label, and pt, keeping per-event place', () => {
    expect(resolveEventVenue({ ref: 'full', city: 'Lisbon', country: 'Portugal' })).toEqual({
      name: 'Full Venue',
      url: 'https://full.example/',
      label: { en: 'Full', pt: 'Completo' },
      pt: { gender: 'm' },
      city: 'Lisbon',
      country: 'Portugal',
    });
  });

  it('omits registry fields the entry does not have', () => {
    expect(resolveEventVenue({ ref: 'bare', country: 'Portugal' })).toEqual({ name: 'Bare Venue', country: 'Portugal' });
  });

  it('throws on an unknown venue ref', () => {
    expect(() => resolveEventVenue({ ref: 'nope', country: 'Portugal' })).toThrow(/Unknown venue ref/);
  });

  it('passes an inline venue through unchanged', () => {
    const inline = { name: 'Inline Venue', url: 'https://inline.example/', city: 'Porto', country: 'Portugal' };
    expect(resolveEventVenue(inline)).toEqual(inline);
  });
});
