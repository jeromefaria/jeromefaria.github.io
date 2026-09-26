import { describe, expect, it } from 'vitest';

import { assertUniqueIds, byNewestFirst, findIssue, issueById, newsletterIssues } from './issues';
import type { NewsletterIssue } from './types';

const issue = (id: string, date: string): NewsletterIssue => ({ id, date, subject: id, blocks: [] });

describe('newsletter issues registry', () => {
  it('starts empty until the first issue is published', () => {
    expect(newsletterIssues).toEqual([]);
    expect(issueById('anything')).toBeUndefined();
  });

  it('orders issues newest first', () => {
    const older = issue('a', '2026-01-01');
    const newer = issue('b', '2026-03-01');

    expect([older, newer].sort(byNewestFirst)).toEqual([newer, older]);
  });

  it('finds an issue by id, and returns undefined for an unknown id', () => {
    const target = issue('a', '2026-01-01');

    expect(findIssue([target, issue('b', '2026-02-01')], 'a')).toBe(target);
    expect(findIssue([target], 'missing')).toBeUndefined();
  });

  it('rejects duplicate issue ids', () => {
    expect(() => assertUniqueIds([issue('2026-05-12', '2026-05-12'), issue('2026-05-12', '2026-05-20')]))
      .toThrow(/Duplicate newsletter issue id: 2026-05-12/);
  });

  it('passes distinct issue ids through unchanged', () => {
    const issues = [issue('a', '2026-02-01'), issue('b', '2026-01-01')];

    expect(assertUniqueIds(issues)).toBe(issues);
  });
});
