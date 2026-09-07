import type { Essay } from '@/types/writing';

export const essays: Essay[] = [
  {
    slug: 'orchestration',
    title: 'Orchestration',
    date: '2026-09-07',
    tagline: 'The conducting is the part I keep',
    description: 'Music and software, the same instinct — using AI as a tool, never a replacement, and building a place I own outright.',
  },
  {
    slug: 'contraplacado',
    title: 'Contraplacado',
    date: '2026-04-30',
    tagline: 'Se Deus nos der vida e saúde',
    description: 'Dissolving a 2014 track to its atoms — a filmic reinterpretation in two languages, synthetic and orchestral, and a debt finally repaid.',
  },
  {
    slug: 'en-veille',
    title: 'En Veille',
    date: '2026-02-25',
    tagline: 'A vigil beneath the city, for Éliane Radigue',
    description: 'A single unedited improvisation recorded beneath Lisbon on a deliberately stripped-back rig — and the patient listening of Éliane Radigue.',
  },
  {
    slug: '2504',
    title: '2504',
    date: '2024-04-26',
    tagline: 'So that history is not forgotten',
    description: 'On the fiftieth anniversary of the Carnation Revolution — memory, place, and the duty of preserving Portugal\'s democracy.',
  },
];

export const essayBySlug = (slug: string): Essay | undefined =>
  essays.find(essay => essay.slug === slug);
