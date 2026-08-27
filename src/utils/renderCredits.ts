import type { Contributor } from '@/types/common';

const MARKER = /\[\[([^\]]+)\]\]/g;

export const renderCredits = (credits: string, contributors: Contributor[] = []): string => {
  const linked = new Map<string, string>();

  for (const contributor of contributors) {
    if (contributor.url) linked.set(contributor.name, contributor.url);
  }

  return credits.replace(MARKER, (_match, name: string) => {
    const url = linked.get(name);
    return url ? `<a href="${url}">${name}</a>` : name;
  });
};

export const plainCredits = (credits: string): string => credits.replace(MARKER, '$1');
