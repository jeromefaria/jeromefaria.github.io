import type { WorksData } from '@/types/works';

import { collaborations } from './works/collaborations';
import { compilations } from './works/compilations';
import { deriveEngineeringCredits } from './works/engineeringCredits';
import { film } from './works/film';
import { mixingAndMastering } from './works/mixingAndMastering';
import { nny } from './works/nny';
import { publications } from './works/publications';
import { solo } from './works/solo';

// Section order here drives worksSections (and the /works page order); the raw section
// data lives in ./works/*, and the derived engineering credits + newest-first sort below
// operate on the assembled set.
export const worksData: WorksData = {
  solo,
  nny,
  collaborations,
  film,
  compilations,
  publications,
  'mixing-and-mastering': mixingAndMastering,
};

// Fold the derived engineering credits into the mixing-and-mastering section.
worksData['mixing-and-mastering']?.items.push(...deriveEngineeringCredits(worksData));

// Every section lists newest first — a derived invariant, so entries can be authored in any order.
for (const section of Object.values(worksData)) {
  section.items.sort((first, second) => second.meta.year - first.meta.year);
}

export const worksSections: string[] = Object.keys(worksData);
