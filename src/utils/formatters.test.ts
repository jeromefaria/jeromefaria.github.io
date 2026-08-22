import { describe, expect, it } from 'vitest';

import { formatEventDate } from './formatters';

describe('formatters', () => {
  describe('formatEventDate', () => {
    it('formats an ISO date as "Month Day, Year"', () => {
      expect(formatEventDate('2024-03-15')).toBe('March 15, 2024');
    });

    it('handles single- and double-digit days', () => {
      expect(formatEventDate('2024-07-01')).toBe('July 1, 2024');
      expect(formatEventDate('2024-07-31')).toBe('July 31, 2024');
    });

    it('handles leap-year and century-boundary dates', () => {
      expect(formatEventDate('2024-02-29')).toBe('February 29, 2024');
      expect(formatEventDate('2000-01-01')).toBe('January 1, 2000');
      expect(formatEventDate('1999-12-31')).toBe('December 31, 1999');
    });

    it('pins the date regardless of timezone via T00:00:00', () => {
      expect(formatEventDate('2024-01-01')).toBe('January 1, 2024');
    });

    it('returns an empty string for empty, null, or undefined input', () => {
      expect(formatEventDate('')).toBe('');
      expect(formatEventDate(null as unknown as string)).toBe('');
      expect(formatEventDate(undefined as unknown as string)).toBe('');
    });
  });
});
