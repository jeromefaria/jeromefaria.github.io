import { describe, expect, it } from 'vitest';

import { ptContract } from './ptGrammar';

describe('ptContract', () => {
  it('contracts "em" by gender and number', () => {
    expect(ptContract('em', { gender: 'm' })).toBe('no');
    expect(ptContract('em', { gender: 'f' })).toBe('na');
    expect(ptContract('em', { gender: 'm', plural: true })).toBe('nos');
    expect(ptContract('em', { gender: 'f', plural: true })).toBe('nas');
  });

  it('contracts "por" by gender and number', () => {
    expect(ptContract('por', { gender: 'm' })).toBe('pelo');
    expect(ptContract('por', { gender: 'f' })).toBe('pela');
    expect(ptContract('por', { gender: 'm', plural: true })).toBe('pelos');
    expect(ptContract('por', { gender: 'f', plural: true })).toBe('pelas');
  });

  it('returns the bare preposition when the entity has no grammar', () => {
    expect(ptContract('em')).toBe('em');
    expect(ptContract('por')).toBe('por');
  });
});
