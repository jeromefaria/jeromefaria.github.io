export type PtGrammar = { gender: 'm' | 'f'; plural?: boolean };

type Preposition = 'em' | 'por';

const CONTRACTIONS: Record<Preposition, Record<'m' | 'f', readonly [string, string]>> = {
  em: { m: ['no', 'nos'], f: ['na', 'nas'] },
  por: { m: ['pelo', 'pelos'], f: ['pela', 'pelas'] },
};

export const ptContract = (preposition: Preposition, grammar?: PtGrammar): string => {
  if (!grammar) return preposition;

  const [singular, plural] = CONTRACTIONS[preposition][grammar.gender];
  return grammar.plural ? plural : singular;
};
