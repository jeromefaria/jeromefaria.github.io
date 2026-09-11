import { describe, expect, it } from 'vitest';

import { venueCompactLabel, venueLabel, venuePlace, venuePrimaryLabel } from './venueFormat';

describe('venuePlace', () => {
  it('joins localized city and country, without the venue name', () => {
    expect(venuePlace({ name: 'ZDB', city: 'Lisbon', country: 'Portugal' })).toBe('Lisbon, Portugal');
  });

  it('localizes exonyms for pt', () => {
    expect(venuePlace({ city: 'Lisbon', country: 'Spain' }, 'pt')).toBe('Lisboa, Espanha');
  });

  it('drops empty parts', () => {
    expect(venuePlace({ country: 'Portugal' })).toBe('Portugal');
  });
});

describe('venueLabel', () => {
  it('prepends the venue name to the place', () => {
    expect(venueLabel({ name: 'ZDB', city: 'Lisbon', country: 'Portugal' })).toBe('ZDB, Lisbon, Portugal');
  });

  it('omits an absent name', () => {
    expect(venueLabel({ city: 'Porto', country: 'Portugal' })).toBe('Porto, Portugal');
  });
});

describe('venueCompactLabel', () => {
  it('joins name and city, dropping the country when a name or city is present', () => {
    expect(venueCompactLabel({ name: 'Zaratan', city: 'Lisbon', country: 'Portugal' })).toBe('Zaratan, Lisbon');
    expect(venueCompactLabel({ name: 'Störung', country: 'Spain' })).toBe('Störung');
    expect(venueCompactLabel({ city: 'Porto', country: 'Portugal' })).toBe('Porto');
  });

  it('falls back to the country when neither name nor city is present', () => {
    expect(venueCompactLabel({ country: 'Portugal' })).toBe('Portugal');
  });

  it('localizes for pt', () => {
    expect(venueCompactLabel({ name: 'Teatro Ibérico', city: 'Lisbon', country: 'Portugal' }, 'pt')).toBe('Teatro Ibérico, Lisboa');
    expect(venueCompactLabel({ country: 'Spain' }, 'pt')).toBe('Espanha');
  });
});

describe('venuePrimaryLabel', () => {
  it('takes the first present of name, city, country (localized)', () => {
    expect(venuePrimaryLabel({ name: 'ZDB', city: 'Lisbon', country: 'Portugal' })).toBe('ZDB');
    expect(venuePrimaryLabel({ city: 'Lisbon', country: 'Portugal' }, 'pt')).toBe('Lisboa');
    expect(venuePrimaryLabel({ country: 'Spain' }, 'pt')).toBe('Espanha');
  });
});
