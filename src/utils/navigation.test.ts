import { afterEach, describe, expect, it, vi } from 'vitest';

import { clearHash, findSectionContainingId, updateHash } from './navigation';

describe('updateHash', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('replaces the URL hash without adding a history entry', () => {
    const replaceState = vi.spyOn(window.history, 'replaceState').mockImplementation(() => undefined);

    updateHash('madeiradig-2011');

    expect(replaceState).toHaveBeenCalledWith(null, '', '#madeiradig-2011');
  });

  it('does not use pushState (avoids polluting history)', () => {
    const pushState = vi.spyOn(window.history, 'pushState').mockImplementation(() => undefined);
    vi.spyOn(window.history, 'replaceState').mockImplementation(() => undefined);

    updateHash('solo');

    expect(pushState).not.toHaveBeenCalled();
  });
});

describe('clearHash', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('replaces the URL with the bare pathname', () => {
    const replaceState = vi.spyOn(window.history, 'replaceState').mockImplementation(() => undefined);

    clearHash();

    expect(replaceState).toHaveBeenCalledWith(null, '', window.location.pathname);
  });
});

describe('findSectionContainingId', () => {
  const data = {
    solo: { items: [{ id: 'a' }, { id: 'b' }] },
    live: { items: [{ id: 'c' }] },
    empty: {},
  };

  it('returns the key of the section whose items contain the id', () => {
    expect(findSectionContainingId(['solo', 'live'], data, 'c')).toBe('live');
  });

  it('returns null when no section contains the id', () => {
    expect(findSectionContainingId(['solo', 'live'], data, 'missing')).toBeNull();
  });

  it('skips sections that have no items', () => {
    expect(findSectionContainingId(['empty', 'solo'], data, 'a')).toBe('solo');
  });
});
