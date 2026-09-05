import type { WorksData } from '@/types/works';

import { collaborations } from './works/collaborations.ts';
import { compilations } from './works/compilations.ts';
import { deriveEngineeringCredits } from './works/engineeringCredits.ts';
import { film } from './works/film.ts';
import { mixingAndMastering } from './works/mixingAndMastering.ts';
import { nny } from './works/nny.ts';
import { publications } from './works/publications.ts';
import { solo } from './works/solo.ts';

// eslint-disable-next-line local/no-comments -- object-key order defines the rendered /works section order; reordering silently changes the page
// Object-key order sets worksSections and the rendered /works section order.
export const worksData: WorksData = {
  solo,
  nny,
  collaborations,
  film,
  compilations,
  publications,
  'mixing-and-mastering': mixingAndMastering,
};

worksData['mixing-and-mastering']?.items.push(...deriveEngineeringCredits(worksData));

for (const section of Object.values(worksData)) {
  section.items.sort((first, second) => second.meta.year - first.meta.year);
}

export const worksSections: string[] = Object.keys(worksData);
