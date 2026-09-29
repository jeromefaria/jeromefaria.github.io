import { afterEach, describe, expect, it, vi } from 'vitest';

import { readJson, readStorage, writeJson, writeStorage } from './storage';

afterEach(() => {
  localStorage.clear();
  vi.restoreAllMocks();
});

describe('readStorage', () => {
  it('returns the stored value', () => {
    localStorage.setItem('k', 'v');
    expect(readStorage('k')).toBe('v');
  });

  it('returns the fallback when the key is missing', () => {
    expect(readStorage('missing', 'fb')).toBe('fb');
  });

  it('returns the fallback when access throws', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('blocked');
    });
    expect(readStorage('k', 'fb')).toBe('fb');
  });
});

describe('writeStorage', () => {
  it('persists the value', () => {
    writeStorage('k', 'v');
    expect(localStorage.getItem('k')).toBe('v');
  });

  it('swallows a write failure', () => {
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('quota');
    });
    expect(() => writeStorage('k', 'v')).not.toThrow();
  });
});

describe('readJson / writeJson', () => {
  it('round-trips a value', () => {
    writeJson('k', ['a', 'b']);
    expect(readJson('k', [])).toEqual(['a', 'b']);
  });

  it('returns the fallback when the key is missing', () => {
    expect(readJson('missing', { n: 1 })).toEqual({ n: 1 });
  });

  it('returns the fallback on malformed JSON', () => {
    localStorage.setItem('k', '{not json');
    expect(readJson('k', 'fb')).toBe('fb');
  });
});
