import { worksData } from '@/data/works';
import { essayBySlug } from '@/data/writing';
import type { Release } from '@/types/works';
import type { Essay } from '@/types/writing';

const releaseById = new Map<string, Release>(
  Object.values(worksData)
    .flatMap(section => section.items)
    .filter(item => item.meta.kind !== 'engineering')
    .map(item => [item.id, item]),
);

export const essayForRelease = (releaseId: string): Essay | undefined => essayBySlug(releaseId);

export const releaseForEssay = (slug: string): Release | undefined => releaseById.get(slug);
