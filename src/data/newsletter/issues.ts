import { issue as issue202605 } from './issues/2026-05.ts';
import type { NewsletterIssue } from './types.ts';

export const newsletterIssues: NewsletterIssue[] = [issue202605].sort((a, b) => b.date.localeCompare(a.date));

export const issueById = (id: string): NewsletterIssue | undefined =>
  newsletterIssues.find(issue => issue.id === id);
