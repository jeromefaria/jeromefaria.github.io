import { describe, expect, it } from 'vitest';

import { safeNewsletterUrl } from './newsletterUrl';

describe('safeNewsletterUrl', () => {
  it('passes absolute http(s) and mailto through', () => {
    expect(safeNewsletterUrl('https://venue.example/tickets')).toBe('https://venue.example/tickets');
    expect(safeNewsletterUrl('mailto:hello@example.com')).toBe('mailto:hello@example.com');
  });

  it('passes relative internal links through (the newsletter allows them)', () => {
    expect(safeNewsletterUrl('/newsletter')).toBe('/newsletter');
    expect(safeNewsletterUrl('#section')).toBe('#section');
  });

  it('trims before checking the scheme', () => {
    expect(safeNewsletterUrl('  /privacy  ')).toBe('/privacy');
  });

  it('rejects javascript:, data:, and other schemes', () => {
    expect(safeNewsletterUrl('javascript:alert(1)')).toBeNull();
    expect(safeNewsletterUrl('data:text/html,<script>')).toBeNull();
    expect(safeNewsletterUrl('vbscript:msgbox')).toBeNull();
  });

  it('treats empty/nullish as no link', () => {
    expect(safeNewsletterUrl(null)).toBeNull();
    expect(safeNewsletterUrl(undefined)).toBeNull();
    expect(safeNewsletterUrl('')).toBeNull();
  });
});
