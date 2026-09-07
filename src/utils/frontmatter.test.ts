import { describe, expect, it } from 'vitest';

import { parseFrontmatter } from './frontmatter';

describe('parseFrontmatter', () => {
  it('returns the raw body untouched when there is no frontmatter', () => {
    expect(parseFrontmatter('# Title\n\nBody')).toEqual({ meta: {}, body: '# Title\n\nBody' });
  });

  it('parses key/value pairs and strips the fence from the body', () => {
    const { meta, body } = parseFrontmatter('---\ntitle: En Veille\ndate: 2026-09-01\n---\n# En Veille\n\nBody');
    expect(meta).toEqual({ title: 'En Veille', date: '2026-09-01' });
    expect(body).toBe('# En Veille\n\nBody');
  });

  it('unwraps single- and double-quoted values', () => {
    const { meta } = parseFrontmatter('---\ntagline: "The conducting is the part I keep"\ndescription: \'x\'\n---\nB');
    expect(meta['tagline']).toBe('The conducting is the part I keep');
    expect(meta['description']).toBe('x');
  });

  it('handles CRLF line endings', () => {
    const { meta, body } = parseFrontmatter('---\r\ntitle: A\r\n---\r\nBody');
    expect(meta['title']).toBe('A');
    expect(body).toBe('Body');
  });

  it('ignores lines without a colon and lines with an empty key', () => {
    const { meta } = parseFrontmatter('---\ntitle: A\nnocolon\n: orphan\n---\nB');
    expect(meta).toEqual({ title: 'A' });
  });
});
