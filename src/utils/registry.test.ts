import { describe, expect, it } from 'vitest';

import { createNameLookup } from './registry';

describe('createNameLookup', () => {
  const registry = {
    foo: { name: 'Foo', url: 'https://foo.example' },
    bar: { name: 'Bar' },
  };
  const find = createNameLookup(registry);

  it('finds an entity by its name', () => {
    expect(find('Foo')).toEqual({ name: 'Foo', url: 'https://foo.example' });
    expect(find('Bar')).toEqual({ name: 'Bar' });
  });

  it('returns undefined for an unknown name', () => {
    expect(find('Baz')).toBeUndefined();
  });

  it('keys by the entity name, not the registry key', () => {
    expect(find('foo')).toBeUndefined();
  });
});
