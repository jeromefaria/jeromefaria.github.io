// A dependency-free subsequence matcher. `query`'s characters must appear in
// `target` in order; the score rewards contiguous runs and word starts, and
// mildly favours earlier matches, so "sw" ranks "Solo Works" above "Password".
const WORD_BOUNDARY = /[\s\-_/]/;

// Lowercase and strip diacritics so "saude" matches "saúde" and "vitor" matches "Vítor".
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

export interface Fuzzable {
  title: string;
  keywords?: string[];
}

// Best score across the title and any keywords; keyword hits count for less than
// a title hit so the visible label dominates ranking.
const bestScore = (query: string, item: Fuzzable): number | null => {
  const scores: number[] = [];

  const titleScore = scoreAgainst(query, item.title);
  if (titleScore !== null) scores.push(titleScore);

  for (const keyword of item.keywords ?? []) {
    const keywordScore = scoreAgainst(query, keyword);
    if (keywordScore !== null) scores.push(keywordScore * 0.5);
  }

  return scores.length > 0 ? Math.max(...scores) : null;
};

// Every whitespace-separated token must match (fzf-style AND), so each extra word
// narrows the results; the score is their sum.
const scoreItem = (tokens: string[], item: Fuzzable): number | null => {
  let total = 0;

  for (const token of tokens) {
    const score = bestScore(token, item);
    if (score === null) return null;
    total += score;
  }

  return total;
};

// Rank `items` by fuzzy relevance to `query`, dropping non-matches. An empty
// query returns the input unchanged, so callers can show a curated default set.
export const fuzzyRank = <T extends Fuzzable>(query: string, items: T[]): T[] => {
  const tokens = query.trim().split(/\s+/).filter(Boolean);
  if (tokens.length === 0) return items;

  return items
    .map(item => ({ item, score: scoreItem(tokens, item) }))
    .filter((entry): entry is { item: T; score: number } => entry.score !== null)
    .sort((a, b) => b.score - a.score)
    .map(entry => entry.item);
};
