import { liveEvents } from '@/data/live';
import type { ImageBlock, IssueBlock, VideoBlock } from '@/data/newsletter/types';
import { releaseById } from '@/data/works';
import { essayBySlug } from '@/data/writing';
import { localize } from '@/i18n/localized';
import { isAllowedEmbedUrl } from '@/utils/embedUrl';
import { formatEventDateRange, formatMonthYear } from '@/utils/formatters';
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
  | { kind: 'quote'; quote: string; source: string; url: string | null }
  | { kind: 'cta'; label: string; href: string }
  | FeatureBlock;

const releaseMeta = (release: NonNullable<ReturnType<typeof releaseById.get>>): MetaField[] => {
  const { meta } = release;
  if (meta.kind !== 'music') return [];

  const edition = meta.editions[0] ?? null;

  return [
    { label: 'Released', value: formatMonthYear(meta.released) },
    { label: 'Format', value: meta.mediums.join(' / ') },
    { label: 'Label', value: edition?.label.text ?? '' },
    { label: 'Catalog', value: edition?.catalog ?? '' },
  ].filter(field => field.value);
};

const worksFeature = (ref: string, note?: string, hideMeta?: boolean): FeatureBlock | null => {
  const release = releaseById.get(ref);
  if (!release) return null;

  return {
    kind: 'feature',
    label: 'Works',
    title: release.title,
    url: `/works/${release.id}`,
    image: release.coverImage ?? null,
    meta: hideMeta ? [] : releaseMeta(release),
    note: note ?? null,
    cta: 'View',
  };
};

const eventMeta = (event: (typeof liveEvents)[number]): MetaField[] =>
  [
    { label: 'Date', value: formatEventDateRange(event.date, event.endDate) },
    { label: 'Venue', value: event.venue.name ?? '' },
    { label: 'City', value: event.venue.city ?? '' },
  ].filter(field => field.value);

const liveFeature = (ref: string, note?: string, hideMeta?: boolean): FeatureBlock | null => {
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
    meta: hideMeta ? [] : eventMeta(event),
    note: note ?? null,
    cta: 'View',
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
    cta: 'View',
  };
};

const resolveImage = (block: ImageBlock): RenderBlock =>
  ({ kind: 'image', src: block.src, alt: block.alt, label: block.label ?? null, caption: block.caption ?? null, href: block.href ?? null });

const resolveVideo = (block: VideoBlock): RenderBlock => {
  const embedUrl = block.embedUrl && isAllowedEmbedUrl(block.embedUrl) ? block.embedUrl : null;
  return { kind: 'video', poster: block.poster, alt: block.alt, label: block.label ?? null, caption: block.caption ?? null, href: block.href, embedUrl };
};

const resolveBlock = (block: IssueBlock): RenderBlock | null => {
  if (block.type === 'prose') return { kind: 'prose', html: renderMarkdown(block.markdown) };
  if (block.type === 'image') return resolveImage(block);
  if (block.type === 'video') return resolveVideo(block);
  if (block.type === 'works') return worksFeature(block.ref, block.note, block.hideMeta);
  if (block.type === 'live') return liveFeature(block.ref, block.note, block.hideMeta);
  if (block.type === 'quote') return { kind: 'quote', quote: block.quote, source: block.source, url: block.url ?? null };
  if (block.type === 'cta') return { kind: 'cta', label: block.label, href: block.href };
  return writingFeature(block.ref, block.note);
};

export const resolveIssueBlocks = (blocks: IssueBlock[]): RenderBlock[] =>
  blocks.map(resolveBlock).filter((block): block is RenderBlock => block !== null);
