import { describe, expect, it } from 'vitest';

import { stripHtml } from './stripHtml';

describe('stripHtml', () => {
  it('removes tags and collapses whitespace', () => {
    expect(stripHtml('A <a href="#">linked</a>  note.')).toBe('A linked note.');
  });

  it('returns an empty string for undefined input', () => {
    expect(stripHtml()).toBe('');
  });
});
