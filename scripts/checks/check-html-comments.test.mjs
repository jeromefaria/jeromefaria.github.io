import { describe, expect, it } from 'vitest';

import { ALLOWED, collectComments, stripStrings } from './check-html-comments.mjs';

describe('ALLOWED', () => {
  it('permits justified exceptions and tooling directives', () => {
    for (const body of ['keep: explains a real gotcha', '! IE conditional', '[if IE]', 'stylelint-disable', 'eslint-disable-line', '@ts-expect-error']) {
      expect(ALLOWED.test(body)).toBe(true);
    }
  });

  it('rejects a bare keep with no reason and plain prose', () => {
    expect(ALLOWED.test('keep:')).toBe(false);
    expect(ALLOWED.test('TODO tidy this up later')).toBe(false);
  });
});

describe('stripStrings', () => {
  it('removes double-quoted string literals', () => {
    expect(stripStrings('a = "x" + 0;')).toBe('a =  + 0;');
  });

  it('removes backtick template literals', () => {
    expect(stripStrings('a = `tpl` + 0;')).toBe('a =  + 0;');
  });
});

describe('collectComments', () => {
  it('finds an HTML comment', () => {
    expect(collectComments('<p>x</p><!-- note -->').map(c => c.body)).toEqual([' note ']);
  });

  it('finds a block comment inside inline style', () => {
    expect(collectComments('<style>.a{}/* css note */</style>').map(c => c.body)).toEqual([' css note ']);
  });

  it('finds a line comment inside inline script', () => {
    expect(collectComments('<script>\nconst a = 1; // trailing\n</script>').map(c => c.body)).toEqual([' trailing']);
  });

  it('does not treat a // inside a string literal as a comment', () => {
    expect(collectComments("<script>\nconst u = 'x // y';\n</script>")).toEqual([]);
  });
});
