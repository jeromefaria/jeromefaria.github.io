import { describe, expect, it } from 'vitest';

import { renderMarkdown, renderMarkdownInline } from './renderMarkdown';

describe('renderMarkdown', () => {
  it('renders GFM markdown to HTML', () => {
    expect(renderMarkdown('# Title')).toContain('<h1');
    expect(renderMarkdown('**bold**')).toContain('<strong>bold</strong>');
  });

  it('honours the breaks option (a single newline becomes a <br>)', () => {
    expect(renderMarkdown('a\nb')).toContain('<br>');
  });

  it('externalizes external links', () => {
    const html = renderMarkdown('[x](https://example.com)');

    expect(html).toContain('target="_blank"');
    expect(html).toContain('rel="noopener noreferrer"');
  });
});

describe('renderMarkdownInline', () => {
  it('renders an inline link without wrapping it in a paragraph', () => {
    const html = renderMarkdownInline('a track by [Aires](https://aires.bandcamp.com/)');

    expect(html).toContain('<a href="https://aires.bandcamp.com/"');
    expect(html).toContain('>Aires</a>');
    expect(html).not.toContain('<p>');
  });

  it('externalizes external links', () => {
    const html = renderMarkdownInline('[x](https://example.com)');

    expect(html).toContain('target="_blank"');
    expect(html).toContain('rel="noopener noreferrer"');
  });

  it('leaves plain text untouched', () => {
    expect(renderMarkdownInline('Out in May.')).toBe('Out in May.');
  });
});
