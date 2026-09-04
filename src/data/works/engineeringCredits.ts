import type { EngineeringRole, Release, WorksData } from '@/types/works';

// Engineering credits aren't authored — they're derived: every release that carries
// engineering roles yields a pseudo-release (folded into the mixing-and-mastering
// section by works.ts), so the same credit never has to be maintained in two places.
export const deriveEngineeringCredits = (worksData: WorksData): Release[] =>
  Object.values(worksData).flatMap(section =>
    section.items
      .filter((release): release is Release & { engineering: EngineeringRole[] } => Boolean(release.engineering?.length))
      .map(release => ({
        id: `engineering-${release.id}`,
        worksRef: release.id,
        title: release.title,
        meta: {
          kind: 'engineering' as const,
          roles: release.engineering,
          editions: 'editions' in release.meta ? release.meta.editions : [],
          year: release.meta.year,
        },
      })));
