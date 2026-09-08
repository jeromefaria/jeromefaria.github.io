import { describe, expect, it } from 'vitest';

import { essayBySlug } from '@/data/writing';
import type { Essay } from '@/types/writing';

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

  it('resolves the release for an essay whose slug matches one', () => {
    expect(releaseForEssay(essayBySlug('2504'))?.id).toBe('2504');
    expect(releaseForEssay(essayBySlug('en-veille'))?.id).toBe('en-veille');
  });

  it('honours the essay release frontmatter over the slug', () => {
    const essay: Essay = { slug: 'making-of-overlapse', title: '', date: '', tagline: '', description: '', release: 'overlapse' };
    expect(releaseForEssay(essay)?.id).toBe('overlapse');
  });

  it('returns undefined for an essay with no matching release, or no essay', () => {
    expect(releaseForEssay(essayBySlug('orchestration'))).toBeUndefined();
    expect(releaseForEssay(undefined)).toBeUndefined();
  });
});
