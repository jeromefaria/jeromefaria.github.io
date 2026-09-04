const WORD_BOUNDARY = /[\s\-_/]/;

const normalize = (value: string): string =>
  value.toLowerCase().normalize('NFKD').replace(/[̀-ͯ]/g, '');

const scoreAgainst = (query: string, target: string): number | null => {
  const q = normalize(query);
  const t = normalize(target);

  let score = 0;
  let cursor = 0;
  let previousIndex = -2;

  for (const char of q) {
    const index = t.indexOf(char, cursor);
    if (index === -1) return null;

    let points = 1;
    if (index === previousIndex + 1) points += 3;
    if (index === 0 || WORD_BOUNDARY.test(t[index - 1] ?? '')) points += 2;
    points -= index * 0.01;

    score += points;
    previousIndex = index;
    cursor = index + 1;
  }

  return score;
};

const KEYWORD_WEIGHT = 0.6;
const TEXT_WEIGHT = 0.2;

export interface Fuzzable {
  title: string;
  keywords?: string[];
  text?: string[];
}

const scoreField = (query: string, terms: string[], weight: number, scores: number[]): void => {
  for (const term of terms) {
    const score = scoreAgainst(query, term);
    if (score !== null) scores.push(score * weight);
  }
};

const bestScore = (query: string, item: Fuzzable): number | null => {
  const scores: number[] = [];

  const titleScore = scoreAgainst(query, item.title);
  if (titleScore !== null) scores.push(titleScore);

  scoreField(query, item.keywords ?? [], KEYWORD_WEIGHT, scores);
  scoreField(query, item.text ?? [], TEXT_WEIGHT, scores);

  return scores.length > 0 ? Math.max(...scores) : null;
};

const scoreItem = (tokens: string[], item: Fuzzable): number | null => {
  let total = 0;

  for (const token of tokens) {
    const score = bestScore(token, item);
    if (score === null) return null;
    total += score;
  }

  return total;
};

export const fuzzyRank = <T extends Fuzzable>(query: string, items: T[]): T[] => {
  const tokens = query.trim().split(/\s+/).filter(Boolean);
  if (tokens.length === 0) return items;

  return items
    .map(item => ({ item, score: scoreItem(tokens, item) }))
    .filter((entry): entry is { item: T; score: number } => entry.score !== null)
    .sort((a, b) => b.score - a.score)
    .map(entry => entry.item);
};
