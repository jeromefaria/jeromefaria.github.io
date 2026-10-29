import { describe, expect, it, vi } from 'vitest';

vi.mock('../lib/playwright-render.mjs', () => ({ renderPdf: vi.fn(), withBrowser: vi.fn(), runAsMain: vi.fn() }));

const { resumeHtml } = await import('./generate-resume.mjs');

describe('resumeHtml', () => {
  it('wraps the rendered markdown body in the document shell', () => {
    expect(resumeHtml('<h1>Jerome Faria</h1><p>Sound artist &amp; composer</p>', '/* base */')).toMatchSnapshot();
  });

  it('injects the given styles and body into the document', () => {
    const html = resumeHtml('<h1>CV</h1>', 'BASE_STYLES');

    expect(html.startsWith('<!doctype html>')).toBe(true);
    expect(html).toContain('BASE_STYLES');
    expect(html).toContain('<body><h1>CV</h1></body>');
    expect(html).toContain('hr + h2 { border-bottom: none;');
  });
});
