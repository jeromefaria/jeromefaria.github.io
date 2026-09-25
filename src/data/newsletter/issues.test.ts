import { describe, expect, it } from 'vitest';

import { assertUniqueIds, issueById, newsletterIssues } from './issues';
import type { NewsletterIssue } from './types';

const issue = (id: string, date: string): NewsletterIssue => ({ id, date, subject: id, blocks: [] });

describe('newsletter issues registry', () => {
  it('exposes at least one issue, newest first', () => {
    expect(newsletterIssues.length).toBeGreaterThan(0);

    const dates = newsletterIssues.map(entry => entry.date);
    expect([...dates].sort((a, b) => b.localeCompare(a))).toEqual(dates);
  });

  it('looks an issue up by id, and returns undefined for an unknown id', () => {
    const first = newsletterIssues[0];
    expect(issueById(first.id)).toBe(first);
    expect(issueById('no-such-issue')).toBeUndefined();
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
