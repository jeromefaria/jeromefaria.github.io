import { describe, expect, it } from 'vitest';

import { findTomlComments } from './check-toml-comments.mjs';

const bodies = text => findTomlComments(text).map(comment => comment.body);

describe('check-toml-comments findTomlComments', () => {
  it('flags a full-line comment', () => {
    expect(bodies('# describe the thing\nkey = 1')).toEqual(['describe the thing']);
  });

  it('flags an inline comment after a value', () => {
    expect(bodies('key = 1 # inline note')).toEqual(['inline note']);
  });

  it('allows a justified `keep:` comment', () => {
    expect(bodies('# keep: a genuine non-obvious gotcha\nkey = 1')).toEqual([]);
  });

  it('ignores # inside a single-line string', () => {
    expect(bodies("pattern = '\\\\(#(\\\\d+)\\\\)'")).toEqual([]);
  });

  it('ignores # inside a triple-quoted string (markdown template)', () => {
    expect(bodies('body = """\n# Changelog\n## Unreleased\n"""\nkey = 1')).toEqual([]);
  });

  it('reports the correct line number', () => {
    expect(findTomlComments('a = 1\nb = 2\n# late comment')[0].line).toBe(3);
  });
});
