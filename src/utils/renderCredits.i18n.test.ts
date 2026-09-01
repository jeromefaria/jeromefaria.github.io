import { describe, expect, it } from 'vitest';

import { worksData } from '@/data/works';
import { hasCredits } from '@/types';

import { plainCredits } from './renderCredits';

const credited = Object.values(worksData)
  .flatMap(section => section.items)
  .filter(hasCredits);

const ptCredits = credited.map(release => plainCredits(release.credits, 'pt')).join('\n');

describe('renderCredits (pt)', () => {
  it('composes Portuguese role vocabulary distinct from English', () => {
    const enCredits = credited.map(release => plainCredits(release.credits, 'en')).join('\n');
    expect(ptCredits).not.toBe(enCredits);
    expect(ptCredits).toContain('Música de');
    expect(ptCredits).toContain('Fotografia de');
  });

  it('applies the by→de, at→no, colon connectors and turns "and" into "e"', () => {
    expect(ptCredits).toContain('Gravado, misturado e masterizado no Human Error Labs');
    expect(ptCredits).toContain('Filmado no Jardim Botânico do Porto');
    expect(ptCredits).toContain('Interpretação de Jerome Faria e Nuno Filipe');
    expect(ptCredits).toContain('Encenação: Sara Gonçalves');
    expect(ptCredits).toContain('Imagem: Diogo Castro');
    expect(ptCredits).toContain('a reinterpretar "Contraplacado" de Aires');
  });
});
