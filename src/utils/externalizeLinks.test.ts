import { describe, expect, it } from 'vitest';

import { externalizeLinks } from './externalizeLinks';

describe('externalizeLinks', () => {
  it('opens external anchors in a new tab with a safe rel', () => {
    expect(externalizeLinks('Music by <a href="https://aires.bandcamp.com/">Aires</a>.'))
      .toBe('Music by <a href="https://aires.bandcamp.com/" target="_blank" rel="noopener noreferrer">Aires</a>.');
  });

  it('marks every external anchor in the string', () => {
    const html = '<a href="https://a.com">A</a> and <a href="https://b.com">B</a>';
    const result = externalizeLinks(html);

    expect(result.match(/target="_blank"/g)).toHaveLength(2);
  });

  it('leaves relative and hash links untouched', () => {
    const html = '<a href="/works">Works</a> and <a href="#anchor">Anchor</a>';

    expect(externalizeLinks(html)).toBe(html);
  });

  it('returns plain text unchanged', () => {
    expect(externalizeLinks('Music by Jerome Faria.')).toBe('Music by Jerome Faria.');
  });
});
