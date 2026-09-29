import { describe, expect, it } from 'vitest';

import { anchor, escapeHtml, safeHref } from './html';

describe('escapeHtml', () => {
  it('escapes the five HTML-significant characters', () => {
    expect(escapeHtml('&<>"\'')).toBe('&amp;&lt;&gt;&quot;&#39;');
  });

  it('leaves ordinary text untouched', () => {
    expect(escapeHtml('Jerome Faria')).toBe('Jerome Faria');
  });
});

describe('safeHref', () => {
  it('allows http(s) and mailto, escaping the result', () => {
    expect(safeHref('https://example.com/a?x=1&y=2')).toBe('https://example.com/a?x=1&amp;y=2');
    expect(safeHref('mailto:hello@example.com')).toBe('mailto:hello@example.com');
  });

  it('rejects javascript: and other non-allowlisted schemes', () => {
    expect(safeHref('javascript:alert(1)')).toBeNull();
    expect(safeHref('data:text/html,<script>')).toBeNull();
  });

  it('trims surrounding whitespace before checking the scheme', () => {
    expect(safeHref('  https://example.com  ')).toBe('https://example.com');
  });
});

describe('anchor', () => {
  it('wraps the inner text in a link for a safe url', () => {
    expect(anchor('Label', 'https://example.com')).toBe('<a href="https://example.com">Label</a>');
  });

  it('returns the inner text unwrapped when the url is unsafe', () => {
    expect(anchor('Label', 'javascript:alert(1)')).toBe('Label');
  });

  it('returns the inner text unwrapped when no url is given', () => {
    expect(anchor('Label')).toBe('Label');
  });

  it('does not escape the inner text (caller owns that decision)', () => {
    expect(anchor('<em>x</em>', 'https://example.com')).toBe('<a href="https://example.com"><em>x</em></a>');
  });
});
