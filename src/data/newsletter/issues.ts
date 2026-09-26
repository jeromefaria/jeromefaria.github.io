import type { NewsletterIssue } from './types.ts';

export const assertUniqueIds = (issues: NewsletterIssue[]): NewsletterIssue[] => {
  const seen = new Set<string>();

  for (const issue of issues) {
    if (seen.has(issue.id)) throw new Error(`Duplicate newsletter issue id: ${issue.id}`);
    seen.add(issue.id);
  }

  return issues;
};

export const byNewestFirst = (a: NewsletterIssue, b: NewsletterIssue): number => b.date.localeCompare(a.date);

export const findIssue = (issues: NewsletterIssue[], id: string): NewsletterIssue | undefined =>
  issues.find(issue => issue.id === id);

const issues: NewsletterIssue[] = [];

export const newsletterIssues: NewsletterIssue[] = assertUniqueIds(issues.sort(byNewestFirst));

export const issueById = (id: string): NewsletterIssue | undefined => findIssue(newsletterIssues, id);
