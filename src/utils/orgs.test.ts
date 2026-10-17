import { describe, expect, it, vi } from 'vitest';

import { orgUrl, resolveEditionLabel } from './orgs';

vi.mock('@/data/orgs', () => ({
  orgs: {
    'enough-records': { name: 'Enough Records', url: 'https://enoughrecords.scene.org/' },
    'brqn': { name: 'BRØQN' },
  },
}));

describe('orgUrl', () => {
  it('returns the url of an organization looked up by name', () => {
    expect(orgUrl('Enough Records')).toBe('https://enoughrecords.scene.org/');
  });

  it('is undefined for an org with no url and for an unknown name', () => {
    expect(orgUrl('BRØQN')).toBeUndefined();
    expect(orgUrl('Nobody')).toBeUndefined();
  });
});

describe('resolveEditionLabel', () => {
  it('resolves an org-key ref to the registry name and url', () => {
    expect(resolveEditionLabel('enough-records')).toEqual({ text: 'Enough Records', url: 'https://enoughrecords.scene.org/' });
  });

  it('resolves a urlless org-key ref to name only', () => {
    expect(resolveEditionLabel('brqn')).toEqual({ text: 'BRØQN' });
  });

  it('throws on an unknown org-key ref', () => {
    expect(() => resolveEditionLabel('not-a-real-key')).toThrow(/Unknown org ref/);
  });

  it('passes an inline label through, keeping its explicit url', () => {
    expect(resolveEditionLabel({ text: 'Twoism Records', url: 'https://twoismrecords.bandcamp.com/' }))
      .toEqual({ text: 'Twoism Records', url: 'https://twoismrecords.bandcamp.com/' });
  });

  it('backfills an inline label url from the registry by name', () => {
    expect(resolveEditionLabel({ text: 'Enough Records' })).toEqual({ text: 'Enough Records', url: 'https://enoughrecords.scene.org/' });
  });

  it('leaves an inline label with no url and no registry match as text only', () => {
    expect(resolveEditionLabel({ text: 'Self-Released' })).toEqual({ text: 'Self-Released' });
  });
});
