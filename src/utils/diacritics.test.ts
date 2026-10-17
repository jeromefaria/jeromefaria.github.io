import { describe, expect, it } from 'vitest';

import { foldDiacritics } from './diacritics';

describe('foldDiacritics', () => {
  it('strips Portuguese diacritics and lowercases', () => {
    expect(foldDiacritics('Água João Ção')).toBe('agua joao cao');
  });

  it('folds a range of accented Latin letters', () => {
    expect(foldDiacritics('àáâãäçèéêëñöü')).toBe('aaaaaceeeenou');
  });

  it('lowercases plain ASCII', () => {
    expect(foldDiacritics('ABC')).toBe('abc');
  });

  it('leaves already-folded text unchanged', () => {
    expect(foldDiacritics('hello world')).toBe('hello world');
  });

  it('preserves non-alphanumeric characters', () => {
    expect(foldDiacritics('São Paulo #2')).toBe('sao paulo #2');
  });
});
