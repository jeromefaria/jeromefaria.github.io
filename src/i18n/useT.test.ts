import { describe, expect, it } from 'vitest';

import { createTranslate } from './useT';

describe('createTranslate', () => {
  it('resolves a nested key against the English fallback catalog', () => {
    // createTranslate is the provider-less fallback and is English-only; the
    // Portuguese path is exercised through the i18n provider (see index.test.ts).
    expect(createTranslate()('nav.about')).toBe('About');
  });

  it('returns the key unchanged when it resolves to nothing', () => {
    expect(createTranslate()('nav.missing')).toBe('nav.missing');
    expect(createTranslate()('does.not.exist')).toBe('does.not.exist');
  });

  it('returns the key when it resolves to a non-string node', () => {
    expect(createTranslate()('nav')).toBe('nav');
  });

  it('interpolates named params into a template', () => {
    expect(createTranslate()('privacy.lastUpdated', { date: '2 September 2026' })).toBe(
      'Last updated 2 September 2026.',
    );
  });

  it('leaves an unmatched placeholder intact when its param is missing', () => {
    expect(createTranslate()('privacy.lastUpdated', {})).toBe('Last updated {date}.');
  });

  it('returns the template unchanged when no params are passed', () => {
    expect(createTranslate()('privacy.lastUpdated')).toBe('Last updated {date}.');
  });
});
