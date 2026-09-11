import { releaseById } from '@/data/works';
import { essays } from '@/data/writing';
import type { Release } from '@/types/works';
import type { Essay } from '@/types/writing';

const essayReleaseId = (essay: Essay): string => essay.release ?? essay.slug;

export const essayForRelease = (releaseId: string): Essay | undefined =>
  essays.find(essay => essayReleaseId(essay) === releaseId);

export const releaseForEssay = (essay: Essay | undefined): Release | undefined =>
  essay ? releaseById.get(essayReleaseId(essay)) : undefined;
