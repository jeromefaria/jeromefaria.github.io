import { describe, expect, it } from 'vitest';

import { essayBySlug, essays } from './writing';

describe('writing data', () => {
  it('exposes at least one essay with the required fields', () => {
    expect(essays.length).toBeGreaterThan(0);

    for (const essay of essays) {
      expect(essay.slug).toBeTruthy();
      expect(essay.title).toBeTruthy();
      expect(essay.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(essay.description).toBeTruthy();
      expect(essay.tagline).toBeTruthy();
    }
  });

  it('resolves an essay by slug', () => {
    expect(essayBySlug('orchestration')?.title).toBe('Orchestration');
  });

  it('returns undefined for an unknown slug', () => {
    expect(essayBySlug('does-not-exist')).toBeUndefined();
  });
});
