import { describe, expect, it } from 'vitest';

import { essays } from './writing';
import { buildDrafts, draftSlugs, essayBodyBySlug, essayMetaBySlug, listedEssays } from './writingContent';

describe('writingContent', () => {
  it('resolves a published essay body and metadata by slug', () => {
    expect(essayBodyBySlug('orchestration')).toContain('Orchestration');
    expect(essayMetaBySlug('orchestration')?.title).toBe('Orchestration');
  });

  it('returns undefined for an unknown slug', () => {
    expect(essayBodyBySlug('nope')).toBeUndefined();
    expect(essayMetaBySlug('nope')).toBeUndefined();
  });

  it('exposes no drafts under the test runner, listing only published essays newest-first', () => {
    expect(draftSlugs.size).toBe(0);
    const publishedNewestFirst = [...essays].sort((a, b) => b.date.localeCompare(a.date)).map(essay => essay.slug);
    expect(listedEssays.map(essay => essay.slug)).toEqual(publishedNewestFirst);
  });

  it('builds draft essays from raw frontmatter, newest first, with bodies stripped', () => {
    const { drafts, bodies } = buildDrafts({
      '/x/_drafts/en-veille.md': '---\ntitle: En Veille\ndate: 2026-09-01\ntagline: T\ndescription: D\n---\nBody one',
      '/x/_drafts/2504.md': '---\ntitle: "2504"\ndate: 2024-04-25\n---\nBody two',
    });

    expect(drafts.map(draft => draft.slug)).toEqual(['en-veille', '2504']);
    expect(drafts[0]).toMatchObject({ title: 'En Veille', date: '2026-09-01', tagline: 'T', description: 'D' });
    expect(bodies['en-veille']).toBe('Body one');
    expect(bodies['2504']).toBe('Body two');
  });

  it('falls back to the slug as title when a draft has no frontmatter', () => {
    const { drafts } = buildDrafts({ '/x/_drafts/rough.md': 'no frontmatter here' });
    expect(drafts[0]).toMatchObject({ slug: 'rough', title: 'rough', date: '', tagline: '', description: '' });
  });
});
