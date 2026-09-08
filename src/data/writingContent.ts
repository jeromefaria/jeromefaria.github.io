import type { Essay } from '@/types/writing';
import { parseFrontmatter } from '@/utils/frontmatter';

import { essayBySlug, essays } from './writing';

const publishedRaw = import.meta.glob('../../content/writing/*.md', { query: '?raw', import: 'default', eager: true }) as Record<string, string>;

const isDevServer = import.meta.env.MODE === 'development';

const draftRaw = isDevServer
  ? import.meta.glob('../../content/writing/_drafts/*.md', { query: '?raw', import: 'default', eager: true }) as Record<string, string>
  : {};

const slugFromPath = (path: string): string => (path.split('/').pop() ?? '').replace(/\.md$/, '');

export const buildDrafts = (rawByPath: Record<string, string>): { drafts: Essay[]; bodies: Record<string, string> } => {
  const bodies: Record<string, string> = {};

  const drafts = Object.entries(rawByPath).map(([path, raw]): Essay => {
    const slug = slugFromPath(path);
    const { meta, body } = parseFrontmatter(raw);
    bodies[slug] = body;

    return {
      slug,
      title: meta['title'] ?? slug,
      date: meta['date'] ?? '',
      tagline: meta['tagline'] ?? '',
      description: meta['description'] ?? '',
      ...(meta['release'] ? { release: meta['release'] } : {}),
    };
  }).sort((a, b) => b.date.localeCompare(a.date));

  return { drafts, bodies };
};

const bodyBySlug: Record<string, string> = {};

for (const [path, raw] of Object.entries(publishedRaw)) {
  bodyBySlug[slugFromPath(path)] = parseFrontmatter(raw).body;
}

const { drafts, bodies } = buildDrafts(draftRaw);
Object.assign(bodyBySlug, bodies);

export const draftEssays: Essay[] = drafts;

export const draftSlugs = new Set(draftEssays.map(essay => essay.slug));

export const listedEssays: Essay[] = [...draftEssays, ...essays].sort((a, b) => b.date.localeCompare(a.date));

export const essayBodyBySlug = (slug: string): string | undefined => bodyBySlug[slug];

export const essayMetaBySlug = (slug: string): Essay | undefined =>
  essayBySlug(slug) ?? draftEssays.find(essay => essay.slug === slug);
