import { issue as issue20260512 } from './issues/2026-05-12.ts';
import type { NewsletterIssue } from './types.ts';

export const assertUniqueIds = (issues: NewsletterIssue[]): NewsletterIssue[] => {
  const seen = new Set<string>();

  for (const issue of issues) {
    if (seen.has(issue.id)) throw new Error(`Duplicate newsletter issue id: ${issue.id}`);
    seen.add(issue.id);
  }

  return issues;
};

export const newsletterIssues: NewsletterIssue[] =
  assertUniqueIds([issue20260512].sort((a, b) => b.date.localeCompare(a.date)));

export const issueById = (id: string): NewsletterIssue | undefined =>
  newsletterIssues.find(issue => issue.id === id);
