import { describe, expect, it } from 'vitest';

import { formatEventDate, formatEventDateRange } from './formatters';

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

  describe('formatEventDateRange', () => {
    it('formats a single date when there is no end date', () => {
      expect(formatEventDateRange('2021-09-22')).toBe('September 22, 2021');
    });

    it('formats a single date when the end date equals the start', () => {
      expect(formatEventDateRange('2021-09-22', '2021-09-22')).toBe('September 22, 2021');
    });

    it('collapses a same-month run to a shared month and year', () => {
      expect(formatEventDateRange('2021-09-22', '2021-09-25')).toBe('September 22–25, 2021');
    });

    it('spells out both months for a same-year run that crosses months', () => {
      expect(formatEventDateRange('2021-09-30', '2021-10-02')).toBe('September 30 – October 2, 2021');
    });

    it('spells out both full dates for a run that crosses years', () => {
      expect(formatEventDateRange('2021-12-31', '2022-01-02')).toBe('December 31, 2021 – January 2, 2022');
    });
  });
});
