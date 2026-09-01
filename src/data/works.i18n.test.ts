import { describe, expect, it } from 'vitest';

import { hasDescription } from '@/types';

import { worksData } from './works';

const hrefs = (html: string): string[] =>
  [...html.matchAll(/href="([^"]+)"/g)].map(match => match[1]).sort();

const described = Object.values(worksData)
  .flatMap(section => section.items)
  .filter(hasDescription);

describe('works description link integrity', () => {
  it.each(described)('$id keeps an identical href set across locales', release => {
    expect(hrefs(release.description.pt)).toEqual(hrefs(release.description.en));
  });
});
