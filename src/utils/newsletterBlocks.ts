import { liveEvents } from '@/data/live';
import type { IssueBlock } from '@/data/newsletter/types';
import { releaseById } from '@/data/works';
import { essayBySlug } from '@/data/writing';
import { localize } from '@/i18n/localized';
import { isAllowedEmbedUrl } from '@/utils/embedUrl';
import { formatEventDateRange } from '@/utils/formatters';
import { renderMarkdown } from '@/utils/renderMarkdown';

export interface MetaField {
  label: string;
  value: string;
}

export interface FeatureBlock {
  kind: 'feature';
  label: string;
  title: string;
  url: string;
  image: string | null;
  meta: MetaField[];
  note: string | null;
  cta: string;
}

export type RenderBlock =
  | { kind: 'prose'; html: string }
  | { kind: 'image'; src: string; alt: string; label: string | null; caption: string | null; href: string | null }
  | { kind: 'video'; poster: string; alt: string; label: string | null; caption: string | null; href: string; embedUrl: string | null }
  | FeatureBlock;

const monthYear = (iso: string): string =>
  new Date(iso).toLocaleDateString('en-US', { month: 'long', year: 'numeric', timeZone: 'UTC' });

const listenFeature = (ref: string, note?: string): FeatureBlock | null => {
  const release = releaseById.get(ref);
  if (!release) return null;

  const { meta } = release;
  const edition = meta.kind === 'music' ? (meta.editions[0] ?? null) : null;

  return {
    kind: 'feature',
    label: 'Listen',
    title: release.title,
    url: `/works/${release.id}`,
    image: release.coverImage ?? null,
    meta: meta.kind === 'music'
      ? [
        { label: 'Released', value: monthYear(meta.released) },
        { label: 'Format', value: meta.mediums.join(' / ') },
        { label: 'Label', value: edition?.label.text ?? '' },
        { label: 'Catalog', value: edition?.catalog ?? '' },
      ].filter(field => field.value)
      : [],
    note: note ?? null,
    cta: 'Listen',
  };
};

const liveFeature = (ref: string, note?: string): FeatureBlock | null => {
  const event = liveEvents.find(entry => entry.id === ref);
  if (!event) return null;

  const cover = event.images?.find(image => image.cover) ?? event.images?.[0];
  const poster = event.posters?.find(entry => entry.cover) ?? event.posters?.[0];

  return {
    kind: 'feature',
    label: 'Live',
    title: localize(event.title, 'en'),
    url: `/live/${event.id}`,
    image: cover?.src ?? poster?.src ?? null,
    meta: [
      { label: 'Date', value: formatEventDateRange(event.date, event.endDate) },
      { label: 'Venue', value: event.venue.name ?? '' },
      { label: 'City', value: event.venue.city ?? '' },
    ].filter(field => field.value),
    note: note ?? null,
    cta: 'Details',
  };
};

const writingFeature = (ref: string, note?: string): FeatureBlock | null => {
  const essay = essayBySlug(ref);
  if (!essay) return null;

  return {
    kind: 'feature',
    label: 'Writing',
    title: essay.title,
    url: `/writing/${essay.slug}`,
    image: null,
    meta: [],
    note: note ?? essay.tagline ?? null,
    cta: 'Read',
  };
};

const resolveBlock = (block: IssueBlock): RenderBlock | null => {
  if (block.type === 'prose') return { kind: 'prose', html: renderMarkdown(block.markdown) };
  if (block.type === 'image') {
    return { kind: 'image', src: block.src, alt: block.alt, label: block.label ?? null, caption: block.caption ?? null, href: block.href ?? null };
  }
  if (block.type === 'video') {
    const embedUrl = block.embedUrl && isAllowedEmbedUrl(block.embedUrl) ? block.embedUrl : null;
    return { kind: 'video', poster: block.poster, alt: block.alt, label: block.label ?? null, caption: block.caption ?? null, href: block.href, embedUrl };
  }
  if (block.type === 'listen') return listenFeature(block.ref, block.note);
  if (block.type === 'live') return liveFeature(block.ref, block.note);
  return writingFeature(block.ref, block.note);
};

export const resolveIssueBlocks = (blocks: IssueBlock[]): RenderBlock[] =>
  blocks.map(resolveBlock).filter((block): block is RenderBlock => block !== null);
