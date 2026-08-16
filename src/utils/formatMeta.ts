import type { Edition, ReleaseMeta } from '@/types/works';

const formatEdition = (edition: Edition): string =>
  edition.catalog ? `${edition.label}, ${edition.catalog}` : edition.label;

/**
 * Render a structured ReleaseMeta back into its display string.
 * The lead is the appearance, credit, or format (in that order); the format
 * moves into the comma-separated body whenever an appearance or credit takes
 * the lead. An em dash separates the lead from the body and the optional note,
 * and also precedes the year when there is no body (e.g. "Live Score — 2013").
 */
export const formatMeta = (meta: ReleaseMeta): string => {
  const lead = meta.appearance ?? meta.credit ?? meta.format ?? '';

  const bodyParts: string[] = [];
  if ((meta.appearance ?? meta.credit) && meta.format) {
    bodyParts.push(meta.format);
  }

  const editions = meta.editions.map(formatEdition).join(' / ');
  if (editions) {
    bodyParts.push(editions);
  }

  const body = bodyParts.join(', ');
  const base = body ? `${lead} — ${body}, ${meta.year}` : `${lead} — ${meta.year}`;

  return meta.note ? `${base} — ${meta.note}` : base;
};
