import { afterEach, describe, expect, it, vi } from 'vitest';

import { updateHash } from './navigation';

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
