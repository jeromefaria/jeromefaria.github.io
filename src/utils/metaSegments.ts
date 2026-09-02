import { DEFAULT_LOCALE, type Locale } from '@/i18n/messages';
import type { Edition, EngineeringRole, ReleaseMeta } from '@/types/works';

// Canonical order (workflow order), so ['mastering','mixing'] still reads "Mixing & Mastering".
export const engineeringRolesLabel = (roles: EngineeringRole[], locale: Locale = DEFAULT_LOCALE): string => {
  const ordered = (['mixing', 'mastering'] as EngineeringRole[]).filter(role => roles.includes(role));

  if (locale === DEFAULT_LOCALE) {
    return ordered.map(role => (role === 'mixing' ? 'Mixing' : 'Mastering')).join(' and ');
  }

  const parts = ordered.map(role => (role === 'mixing' ? 'mistura' : 'masterização'));
  return parts.map((part, index) => (index === 0 ? part.charAt(0).toUpperCase() + part.slice(1) : part)).join(' e ');
};

export type MetaSegment =
  | { kind: 'text'; text: string }
  | { kind: 'link'; link: { text: string; url?: string } }
  | { kind: 'em'; link: { text: string; url?: string } };

const text = (value: string): MetaSegment => ({ kind: 'text', text: value });

const editionSegments = (editions: Edition[]): MetaSegment[] =>
  editions.flatMap((edition, index) => {
    const segments: MetaSegment[] = [{ kind: 'link', link: edition.label }];

    if (edition.catalog) {
      segments.push(text(`, ${edition.catalog}`));
    }

    if (index < editions.length - 1) {
      segments.push(text(' / '));
    }

    return segments;
  });

const commissionSegments = (meta: Extract<ReleaseMeta, { kind: 'commission' }>, isEn: boolean): MetaSegment[] => {
  switch (meta.work) {
    case 'Film':
      return [text(isEn ? 'Film — dir. ' : 'Filme — realização de '), { kind: 'link', link: meta.director }, text(`, ${meta.year}`)];

    case 'Theatre':
      return [text(`${isEn ? 'Theatre' : 'Teatro'} — `), { kind: 'link', link: meta.venue }, text(`, ${meta.year}`)];

    case 'DVD': {
      const catalog = meta.publisher.catalog ? `, ${meta.publisher.catalog}` : '';
      return [text('DVD — '), { kind: 'link', link: meta.publisher.label }, text(`${catalog}, ${meta.year}`)];
    }

    case 'Live Score':
      return [text(`${isEn ? 'Live Score' : 'Filme-concerto'} — ${meta.year}`)];
  }
};

export const buildMetaSegments = (meta: ReleaseMeta, locale: Locale = DEFAULT_LOCALE): MetaSegment[] => {
  const isEn = locale === DEFAULT_LOCALE;

  switch (meta.kind) {
    case 'music':
      return [
        text(`${meta.mediums.join('/')} — `),
        ...editionSegments(meta.editions),
        text(`, ${meta.year}`),
      ];

    case 'compilation': {
      const lead = isEn
        ? (meta.collaborators ? `with ${meta.collaborators.join(', ')} in ` : 'in ')
        : (meta.collaborators ? `com ${meta.collaborators.join(', ')} em ` : 'em ');
      return [
        text(lead),
        { kind: 'em', link: meta.compilation },
        text(` — ${meta.mediums.join('/')}, `),
        ...editionSegments(meta.editions),
        text(`, ${meta.year}`),
      ];
    }

    case 'commission':
      return commissionSegments(meta, isEn);

    case 'publication': {
      const segments: MetaSegment[] = [
        text(`${isEn ? 'Book' : 'Livro'} — `),
        { kind: 'link', link: meta.publisher },
        text(`, ${meta.year}`),
      ];

      if (meta.isbn) {
        const label = `ISBN ${meta.isbn.value}`;
        const link = meta.isbn.url ? { text: label, url: meta.isbn.url } : { text: label };
        segments.push(text(' — '), { kind: 'link', link });
      }

      return segments;
    }

    case 'engineering':
      return [
        text(`${engineeringRolesLabel(meta.roles, locale)} — `),
        ...editionSegments(meta.editions),
        text(`, ${meta.year}`),
      ];
  }
};
