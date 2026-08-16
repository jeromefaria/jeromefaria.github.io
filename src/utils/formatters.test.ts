import { describe, expect, it } from 'vitest';

import { formatEventDate, stripHtml } from './formatters';

describe('formatters', () => {
  describe('stripHtml', () => {
    it('should remove simple HTML tags', () => {
      const html = '<p>Hello World</p>';
      expect(stripHtml(html)).toBe('Hello World');
    });

    it('should remove nested HTML tags', () => {
      const html = '<div><p>Hello <strong>World</strong></p></div>';
      expect(stripHtml(html)).toBe('Hello World');
    });

    it('should handle self-closing tags', () => {
      const html = 'Line 1<br/>Line 2';
      expect(stripHtml(html)).toBe('Line 1Line 2');
    });

    it('should handle img tags', () => {
      const html = 'Text <img src="image.jpg" alt="test"/> more text';
      expect(stripHtml(html)).toBe('Text  more text');
    });

    it('should preserve text content only', () => {
      const html = '<a href="https://example.com">Click here</a>';
      expect(stripHtml(html)).toBe('Click here');
    });

    it('should handle empty strings', () => {
      expect(stripHtml('')).toBe('');
    });

    it('should handle strings with no HTML', () => {
      const text = 'Plain text';
      expect(stripHtml(text)).toBe('Plain text');
    });

    it('should handle multiple tags in a row', () => {
      const html = '<p></p><div></div>Content';
      expect(stripHtml(html)).toBe('Content');
    });

    it('should handle tags with attributes', () => {
      const html = '<div class="container" id="main"><span style="color: red;">Text</span></div>';
      expect(stripHtml(html)).toBe('Text');
    });

    it('should handle null/undefined gracefully', () => {
      expect(stripHtml(null as unknown as string)).toBe('');
      expect(stripHtml(undefined as unknown as string)).toBe('');
    });
  });

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
