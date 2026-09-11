import { describe, expect, it } from 'vitest';

import { renderMarkdown } from './renderMarkdown';

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
