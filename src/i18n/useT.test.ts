import { describe, expect, it } from 'vitest';

import { createTranslate } from './useT';

describe('createTranslate', () => {
  it('resolves a nested key in the given locale', () => {
    expect(createTranslate('en')('nav.about')).toBe('About');
    expect(createTranslate('pt')('nav.about')).toBe('Sobre');
  });

  it('returns the key unchanged when it resolves to nothing', () => {
    expect(createTranslate('en')('nav.missing')).toBe('nav.missing');
    expect(createTranslate('en')('does.not.exist')).toBe('does.not.exist');
  });

  it('returns the key when it resolves to a non-string node', () => {
    expect(createTranslate('en')('nav')).toBe('nav');
  });

  it('interpolates named params into a template', () => {
    expect(createTranslate('en')('privacy.lastUpdated', { date: '2 September 2026' })).toBe(
      'Last updated 2 September 2026.',
    );
  });

  it('leaves an unmatched placeholder intact when its param is missing', () => {
    expect(createTranslate('en')('privacy.lastUpdated', {})).toBe('Last updated {date}.');
  });

  it('returns the template unchanged when no params are passed', () => {
    expect(createTranslate('en')('privacy.lastUpdated')).toBe('Last updated {date}.');
  });
});
