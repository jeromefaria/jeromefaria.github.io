import { describe, expect, it } from 'vitest';

import { issueById, newsletterIssues } from './issues';

describe('newsletter issues registry', () => {
  it('exposes at least one issue, newest first', () => {
    expect(newsletterIssues.length).toBeGreaterThan(0);

    const dates = newsletterIssues.map(issue => issue.date);
    expect([...dates].sort((a, b) => b.localeCompare(a))).toEqual(dates);
  });

  it('looks an issue up by id, and returns undefined for an unknown id', () => {
    const first = newsletterIssues[0];
    expect(issueById(first.id)).toBe(first);
    expect(issueById('no-such-issue')).toBeUndefined();
  });
});
