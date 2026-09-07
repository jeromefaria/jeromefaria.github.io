import type { Essay } from '@/types/writing';

export const essays: Essay[] = [
  {
    slug: 'orchestration',
    title: 'Orchestration',
    date: '2026-09-07',
    tagline: 'The conducting is the part I keep',
    description: 'Music and software, the same instinct — using AI as a tool, never a replacement, and building a place I own outright.',
  },
];

export const essayBySlug = (slug: string): Essay | undefined =>
  essays.find(essay => essay.slug === slug);
