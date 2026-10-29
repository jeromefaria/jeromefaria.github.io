import { describe, expect, it } from 'vitest';

import { extractNames, LINKED_NAME, REGISTRY_NAME, unresolvedMarkers } from './check-people.mjs';

describe('extractNames', () => {
  it('pulls every registry name from a registry file', () => {
    const content = "export const people = {\n  basinski: { name: 'William Basinski' },\n  deupree: { name: 'Taylor Deupree' },\n};";

    expect(extractNames(content, REGISTRY_NAME)).toEqual(['William Basinski', 'Taylor Deupree']);
  });

  it('pulls only names from inline name+url objects, not bare names', () => {
    const content = "a: { name: 'Linked', url: 'https://x.test' },\nb: { name: 'Unlinked' },";

    expect(extractNames(content, LINKED_NAME)).toEqual(['Linked']);
  });

  it('returns an empty list when nothing matches', () => {
    expect(extractNames('no names here', REGISTRY_NAME)).toEqual([]);
  });
});

describe('unresolvedMarkers', () => {
  const resolvable = new Set(['William Basinski', 'Taylor Deupree']);

  it('reports only markers that resolve to no known name, with line numbers', () => {
    const text = "credit: '[[William Basinski]]',\nnote: 'with [[Nobody Here]]',";

    expect(unresolvedMarkers(text, resolvable)).toEqual([{ line: 2, name: 'Nobody Here' }]);
  });

  it('catches several unresolved markers on one line', () => {
    const text = 'played with [[Ghost One]] and [[Ghost Two]]';

    expect(unresolvedMarkers(text, resolvable)).toEqual([
      { line: 1, name: 'Ghost One' },
      { line: 1, name: 'Ghost Two' },
    ]);
  });

  it('passes when every marker resolves', () => {
    expect(unresolvedMarkers('[[Taylor Deupree]]', resolvable)).toEqual([]);
  });
});
