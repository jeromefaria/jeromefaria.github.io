import { describe, expect, it } from 'vitest';

import { essayForRelease, releaseForEssay } from './essayLinks';

describe('essayLinks', () => {
  it('resolves the essay for a release that has one', () => {
    expect(essayForRelease('2504')?.slug).toBe('2504');
    expect(essayForRelease('contraplacado')?.slug).toBe('contraplacado');
  });

  it('returns undefined for a release with no published essay', () => {
    expect(essayForRelease('overlapse')).toBeUndefined();
    expect(essayForRelease('does-not-exist')).toBeUndefined();
  });

  it('resolves the release for an essay about one', () => {
    expect(releaseForEssay('2504')?.id).toBe('2504');
    expect(releaseForEssay('en-veille')?.id).toBe('en-veille');
  });

  it('returns undefined for an essay with no matching release', () => {
    expect(releaseForEssay('orchestration')).toBeUndefined();
    expect(releaseForEssay('does-not-exist')).toBeUndefined();
  });
});
