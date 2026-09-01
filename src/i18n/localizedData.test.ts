import { describe, expect, it } from 'vitest';

import { bios } from '@/data/bios';
import { colophonContent } from '@/data/colophon';
import { liveEvents } from '@/data/live';
import { siteConfig } from '@/data/navigation';
import { pageMeta } from '@/data/pageMeta';
import { pressQuotes } from '@/data/press';
import { privacyContent } from '@/data/privacy';
import { techRider } from '@/data/techRider';
import { worksData } from '@/data/works';

interface LeafNode {
  path: string;
  en: string;
  pt: string;
}

const collect = (value: unknown, path: string, out: LeafNode[]): void => {
  if (!value || typeof value !== 'object') return;

  const record = value as Record<string, unknown>;
  if (typeof record['en'] === 'string' && typeof record['pt'] === 'string') {
    out.push({ path, en: record['en'], pt: record['pt'] });
    return;
  }

  if (Array.isArray(value)) {
    value.forEach((item, index) => collect(item, `${path}[${index}]`, out));
    return;
  }

  for (const [key, nested] of Object.entries(record)) {
    collect(nested, path ? `${path}.${key}` : key, out);
  }
};

const sources: Record<string, unknown> = {
  siteConfig: { tagline: siteConfig.tagline, description: siteConfig.description },
  pageMeta,
  colophonContent,
  privacyContent,
  bios: { short: bios.short, long: bios.long, press: bios.press },
  worksData,
  liveEvents,
  pressQuotes,
  techRider,
};

const nodes: LeafNode[] = [];
for (const [name, source] of Object.entries(sources)) collect(source, name, nodes);

// Values that are intentionally identical across locales (proper terms kept as-is).
const SAME_ACROSS_LOCALES = new Set([
  'pageMeta.colophon.title',
  'worksData.solo.title',
  'worksData.nny.title',
  'worksData.solo.items[1].credits.note',
  'techRider.sections[5].title',
]);

describe('localized data', () => {
  it('traverses the expected localized surface', () => {
    expect(nodes.length).toBeGreaterThan(30);
  });

  it('defines a non-blank en and pt for every localized value', () => {
    const blanks = nodes.filter(node => !node.en.trim() || !node.pt.trim()).map(node => node.path);
    expect(blanks).toEqual([]);
  });

  it('translates every value unless intentionally kept identical', () => {
    const untranslated = nodes
      .filter(node => node.en === node.pt && !SAME_ACROSS_LOCALES.has(node.path))
      .map(node => node.path);
    expect(untranslated).toEqual([]);
  });
});
