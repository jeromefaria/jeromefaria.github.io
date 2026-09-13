import { describe, expect, it } from 'vitest';

import { aboutSections } from '@/data/about';
import { epkManifest } from '@/data/epk';
import { liveEvents } from '@/data/live';
import { allReleases } from '@/data/works';

import { resolveCredit } from './people';

const collectRefs = (node: unknown, photographers: string[], collaborators: string[]): void => {
  if (Array.isArray(node)) {
    node.forEach(child => collectRefs(child, photographers, collaborators));
    return;
  }

  if (!node || typeof node !== 'object') return;

  for (const [key, value] of Object.entries(node)) {
    if (key === 'photographer' && typeof value === 'string') {
      photographers.push(value);
    } else if (key === 'collaborators' && Array.isArray(value)) {
      collaborators.push(...value.filter((entry): entry is string => typeof entry === 'string'));
    } else {
      collectRefs(value, photographers, collaborators);
    }
  }
};

const photographers: string[] = [];
const collaborators: string[] = [];
collectRefs([aboutSections, liveEvents, allReleases, epkManifest], photographers, collaborators);

const unresolved = (refs: string[]): string[] =>
  [...new Set(refs)].filter(ref => {
    try {
      resolveCredit(ref);
      return false;
    } catch {
      return true;
    }
  });

describe('resolveCredit', () => {
  it('resolves a person by key', () => {
    expect(resolveCredit('pedro-jafuno')).toEqual({ name: 'Pedro Jafuno', url: 'https://www.instagram.com/jafuno/' });
  });

  it('resolves an org by key, preferring its label over its short name', () => {
    expect(resolveCredit('eme')).toEqual({ name: 'EME Festival', url: 'https://www.emefestival.org/' });
  });

  it('resolves a person with no url', () => {
    expect(resolveCredit('valentina-araujo')).toEqual({ name: 'Valentina Araújo' });
  });

  it('throws on an unknown ref', () => {
    expect(() => resolveCredit('not-a-real-key')).toThrow(/Unknown credit ref/);
  });
});

describe('credit registry integrity', () => {
  it('resolves every photographer ref used across the site data', () => {
    expect(photographers.length).toBeGreaterThan(0);
    expect(unresolved(photographers)).toEqual([]);
  });

  it('resolves every collaborator ref used across the works data', () => {
    expect(collaborators).toContain('structura');
    expect(unresolved(collaborators)).toEqual([]);
  });
});
