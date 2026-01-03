import { describe, expect, it } from 'vitest';

import { extractYear, parseVenue, stripHtml } from './formatters';

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

  describe('parseVenue', () => {
    it('should parse full venue format correctly', () => {
      const venue = 'Teatro Nacional, Lisbon, Portugal';
      const result = parseVenue(venue);

      expect(result).toEqual({
        name: 'Teatro Nacional',
        addressLocality: 'Lisbon',
        addressCountry: 'Portugal',
      });
    });

    it('should parse venue with two parts', () => {
      const venue = 'Teatro Nacional, Lisbon';
      const result = parseVenue(venue);

      expect(result).toEqual({
        name: 'Teatro Nacional',
        addressLocality: 'Lisbon',
        addressCountry: '',
      });
    });

    it('should parse venue with one part', () => {
      const venue = 'Teatro Nacional';
      const result = parseVenue(venue);

      expect(result).toEqual({
        name: 'Teatro Nacional',
        addressLocality: '',
        addressCountry: '',
      });
    });

    it('should trim whitespace from parts', () => {
      const venue = '  Teatro Nacional  ,  Lisbon  ,  Portugal  ';
      const result = parseVenue(venue);

      expect(result).toEqual({
        name: 'Teatro Nacional',
        addressLocality: 'Lisbon',
        addressCountry: 'Portugal',
      });
    });

    it('should handle empty string', () => {
      const venue = '';
      const result = parseVenue(venue);

      expect(result).toEqual({
        name: '',
        addressLocality: '',
        addressCountry: '',
      });
    });

    it('should strip HTML from venue string', () => {
      const venue = '<strong>Teatro Nacional</strong>, <em>Lisbon</em>, Portugal';
      const result = parseVenue(venue);

      expect(result).toEqual({
        name: 'Teatro Nacional',
        addressLocality: 'Lisbon',
        addressCountry: 'Portugal',
      });
    });

    it('should handle venue with HTML and commas in name', () => {
      const venue = '<a href="#">Venue, Inc.</a>, New York, USA';
      const result = parseVenue(venue);

      expect(result).toEqual({
        name: 'Venue',
        addressLocality: 'Inc.',
        addressCountry: 'New York',
      });
    });

    it('should handle extra commas', () => {
      const venue = 'Teatro Nacional, Lisbon, Portugal, Europe';
      const result = parseVenue(venue);

      expect(result).toEqual({
        name: 'Teatro Nacional',
        addressLocality: 'Lisbon',
        addressCountry: 'Portugal',
      });
    });
  });

  describe('extractYear', () => {
    it('should extract 4-digit year from 2000s', () => {
      const text = 'Digital — BRØQN, 2024';
      expect(extractYear(text)).toBe('2024');
    });

    it('should extract 4-digit year from 1900s', () => {
      const text = 'Released in 1998';
      expect(extractYear(text)).toBe('1998');
    });

    it('should return null when no year found', () => {
      const text = 'No year here';
      expect(extractYear(text)).toBeNull();
    });

    it('should return first year if multiple', () => {
      const text = '2020 was followed by 2021';
      expect(extractYear(text)).toBe('2020');
    });

    it('should handle year in middle of text', () => {
      const text = 'The album from 2015 was great';
      expect(extractYear(text)).toBe('2015');
    });

    it('should handle year at start of text', () => {
      const text = '2010 was a good year';
      expect(extractYear(text)).toBe('2010');
    });

    it('should handle year at end of text', () => {
      const text = 'Released 2019';
      expect(extractYear(text)).toBe('2019');
    });

    it('should not match years outside 1900-2099 range', () => {
      const text = 'The year 1899 or 2100';
      expect(extractYear(text)).toBeNull();
    });

    it('should not match partial year matches', () => {
      const text = 'Code 12024 or 20245';
      expect(extractYear(text)).toBeNull();
    });

    it('should handle empty string', () => {
      const text = '';
      expect(extractYear(text)).toBeNull();
    });

    it('should handle null/undefined gracefully', () => {
      expect(extractYear(null as unknown as string)).toBeNull();
      expect(extractYear(undefined as unknown as string)).toBeNull();
    });

    it('should match year with word boundaries', () => {
      const text = 'Year: 2022.';
      expect(extractYear(text)).toBe('2022');
    });

    it('should handle year with surrounding punctuation', () => {
      const text = '(2021)';
      expect(extractYear(text)).toBe('2021');
    });
  });
});
