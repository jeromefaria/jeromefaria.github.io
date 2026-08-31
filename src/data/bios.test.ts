import { describe, expect, it } from 'vitest';

import { bios } from './bios';

const hrefs = (html: string): string[] =>
  [...html.matchAll(/href="([^"]+)"/g)].map(match => match[1]).sort();

describe('bios link integrity', () => {
  const blocks = [
    { label: 'short', value: bios.short },
    { label: 'long[0]', value: bios.long[0] },
    { label: 'long[1]', value: bios.long[1] },
    { label: 'long[2]', value: bios.long[2] },
  ];

  it.each(blocks)('$label carries identical hrefs in en and pt', ({ value }) => {
    expect(hrefs(value.pt)).toEqual(hrefs(value.en));
  });
});
