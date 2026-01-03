import { describe, expect, it } from 'vitest';

import { formatEventDate, formatSchemaDate } from './dateFormatter';

describe('dateFormatter', () => {
  describe('formatEventDate', () => {
    it('should format ISO date to "Month Day, Year" format', () => {
      const isoDate = '2024-03-15';
      expect(formatEventDate(isoDate)).toBe('March 15, 2024');
    });

    it('should handle different months correctly', () => {
      expect(formatEventDate('2024-01-05')).toBe('January 5, 2024');
      expect(formatEventDate('2024-02-14')).toBe('February 14, 2024');
      expect(formatEventDate('2024-12-25')).toBe('December 25, 2024');
    });

    it('should handle different years correctly', () => {
      expect(formatEventDate('2020-06-10')).toBe('June 10, 2020');
      expect(formatEventDate('2025-06-10')).toBe('June 10, 2025');
    });

    it('should handle single-digit days', () => {
      expect(formatEventDate('2024-07-01')).toBe('July 1, 2024');
      expect(formatEventDate('2024-07-09')).toBe('July 9, 2024');
    });

    it('should handle double-digit days', () => {
      expect(formatEventDate('2024-07-10')).toBe('July 10, 2024');
      expect(formatEventDate('2024-07-31')).toBe('July 31, 2024');
    });

    it('should handle null input', () => {
      expect(formatEventDate(null as unknown as string)).toBe('');
    });

    it('should handle undefined input', () => {
      expect(formatEventDate(undefined as unknown as string)).toBe('');
    });

    it('should handle empty string', () => {
      expect(formatEventDate('')).toBe('');
    });

    it('should handle leap year dates', () => {
      expect(formatEventDate('2024-02-29')).toBe('February 29, 2024');
    });

    it('should handle year 2000 correctly', () => {
      expect(formatEventDate('2000-01-01')).toBe('January 1, 2000');
    });

    it('should handle dates in the 1990s', () => {
      expect(formatEventDate('1999-12-31')).toBe('December 31, 1999');
    });

    it('should prevent timezone issues by using T00:00:00', () => {
      // This test ensures the date stays consistent regardless of timezone
      const isoDate = '2024-01-01';
      const result = formatEventDate(isoDate);
      // Should always format as January 1, 2024 regardless of timezone
      expect(result).toBe('January 1, 2024');
    });
  });

  describe('formatSchemaDate', () => {
    it('should return input unchanged (identity function)', () => {
      const isoDate = '2024-03-15';
      expect(formatSchemaDate(isoDate)).toBe('2024-03-15');
    });

    it('should handle different date formats', () => {
      expect(formatSchemaDate('2020-01-01')).toBe('2020-01-01');
      expect(formatSchemaDate('2025-12-31')).toBe('2025-12-31');
    });

    it('should handle null input', () => {
      expect(formatSchemaDate(null as unknown as string)).toBe('');
    });

    it('should handle undefined input', () => {
      expect(formatSchemaDate(undefined as unknown as string)).toBe('');
    });

    it('should handle empty string', () => {
      expect(formatSchemaDate('')).toBe('');
    });

    it('should preserve ISO 8601 format', () => {
      const isoDate = '2024-06-15';
      expect(formatSchemaDate(isoDate)).toBe(isoDate);
    });
  });
});
