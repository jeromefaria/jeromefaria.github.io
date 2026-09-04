import { describe, expect, it } from 'vitest';

import { formatEventDate, formatEventDateRange } from './formatters';

const withPlainSpaces = (value: string): string => value.replace(/\s/g, ' ');

describe('formatters', () => {
  describe('formatEventDate', () => {
    it('formats an ISO date as "Day Month Year" (en-GB)', () => {
      expect(formatEventDate('2024-03-15')).toBe('15 March 2024');
    });

    it('handles single- and double-digit days', () => {
      expect(formatEventDate('2024-07-01')).toBe('1 July 2024');
      expect(formatEventDate('2024-07-31')).toBe('31 July 2024');
    });

    it('handles leap-year and century-boundary dates', () => {
      expect(formatEventDate('2024-02-29')).toBe('29 February 2024');
      expect(formatEventDate('2000-01-01')).toBe('1 January 2000');
      expect(formatEventDate('1999-12-31')).toBe('31 December 1999');
    });

    it('pins the date regardless of timezone via T00:00:00', () => {
      expect(formatEventDate('2024-01-01')).toBe('1 January 2024');
    });

    it('returns an empty string for empty, null, or undefined input', () => {
      expect(formatEventDate('')).toBe('');
      expect(formatEventDate(null as unknown as string)).toBe('');
      expect(formatEventDate(undefined as unknown as string)).toBe('');
    });
  });

  describe('formatEventDateRange', () => {
    it('formats a single date when there is no end date', () => {
      expect(formatEventDateRange('2021-09-22')).toBe('22 September 2021');
    });

    it('formats a single date when the end date equals the start', () => {
      expect(formatEventDateRange('2021-09-22', '2021-09-22')).toBe('22 September 2021');
    });

    it('collapses a same-month run to a shared month and year', () => {
      expect(withPlainSpaces(formatEventDateRange('2021-09-22', '2021-09-25'))).toBe('22 – 25 September 2021');
    });

    it('spells out both months for a same-year run that crosses months', () => {
      expect(withPlainSpaces(formatEventDateRange('2021-09-30', '2021-10-02'))).toBe('30 September – 2 October 2021');
    });

    it('spells out both full dates for a run that crosses years', () => {
      expect(withPlainSpaces(formatEventDateRange('2021-12-31', '2022-01-02'))).toBe('31 December 2021 – 2 January 2022');
    });
  });

  describe('pt-PT', () => {
    it('formats a single date day-first with a lowercase month', () => {
      expect(formatEventDate('2021-09-22', 'pt')).toBe('22 de setembro de 2021');
    });

    it('collapses a same-month run day-first', () => {
      expect(formatEventDateRange('2021-09-22', '2021-09-25', 'pt')).toBe('22–25 de setembro de 2021');
    });

    it('spans months and years day-first in Portuguese', () => {
      const acrossMonths = formatEventDateRange('2021-09-30', '2021-10-02', 'pt');
      expect(acrossMonths).toContain('30 de setembro');
      expect(acrossMonths).toContain('2 de outubro de 2021');

      const acrossYears = formatEventDateRange('2021-12-31', '2022-01-02', 'pt');
      expect(acrossYears).toContain('31 de dezembro de 2021');
      expect(acrossYears).toContain('2 de janeiro de 2022');
    });
  });
});
