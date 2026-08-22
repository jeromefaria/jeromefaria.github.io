import { describe, expect, it } from 'vitest';

import { pluralize } from './pluralize';

describe('pluralize', () => {
  it('returns the singular for a count of 1', () => {
    expect(pluralize(1, 'Photo')).toBe('Photo');
  });

  it('appends "s" by default for any non-1 count', () => {
    expect(pluralize(0, 'Poster')).toBe('Posters');
    expect(pluralize(3, 'Video')).toBe('Videos');
  });

  it('uses an explicit plural when the default does not apply', () => {
    expect(pluralize(2, 'Gallery', 'Galleries')).toBe('Galleries');
  });
});
