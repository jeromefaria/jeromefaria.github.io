import { DEFAULT_LOCALE, type Locale } from '@/i18n/messages';
import type { CreditRef } from '@/types/media';
import type { Edition, EngineeringRole, ReleaseMeta } from '@/types/works';
import { orgUrl } from '@/utils/orgs';
import { resolveCredit } from '@/utils/people';
import { releaseYear } from '@/utils/releaseDate';

const resolveLabel = (link: { text: string; url?: string }): { text: string; url?: string } => {
  const url = link.url ?? orgUrl(link.text);
  return url ? { text: link.text, url } : { text: link.text };
};

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
    const segments: MetaSegment[] = [{ kind: 'link', link: resolveLabel(edition.label) }];

    if (edition.catalog) {
      segments.push(text(`, ${edition.catalog}`));
    }

    if (index < editions.length - 1) {
      segments.push(text(' / '));
    }

    return segments;
  });

const collaboratorSegments = (collaborators: CreditRef[] | undefined, isEn: boolean): MetaSegment[] => {
  if (!collaborators?.length) return [text(isEn ? 'in ' : 'em ')];

  const links = collaborators.flatMap((ref, index): MetaSegment[] => {
    const { name, url } = resolveCredit(ref);
    const link: MetaSegment = { kind: 'link', link: url ? { text: name, url } : { text: name } };

    return index < collaborators.length - 1 ? [link, text(', ')] : [link];
  });

  return [text(isEn ? 'with ' : 'com '), ...links, text(isEn ? ' in ' : ' em ')];
};

const commissionSegments = (meta: Extract<ReleaseMeta, { kind: 'commission' }>, isEn: boolean, year: number): MetaSegment[] => {
  switch (meta.work) {
    case 'Film':
      return [text(isEn ? 'Film — dir. ' : 'Filme — realização de '), { kind: 'link', link: meta.director }, text(`, ${year}`)];

    case 'Theatre':
      return [text(`${isEn ? 'Theatre' : 'Teatro'} — `), { kind: 'link', link: meta.venue }, text(`, ${year}`)];

    case 'DVD': {
      const catalog = meta.publisher.catalog ? `, ${meta.publisher.catalog}` : '';
      return [text('DVD — '), { kind: 'link', link: resolveLabel(meta.publisher.label) }, text(`${catalog}, ${year}`)];
    }

    case 'Live Score':
      return [text(`${isEn ? 'Live Score' : 'Filme-concerto'} — ${year}`)];
  }
};

export const buildMetaSegments = (meta: ReleaseMeta, locale: Locale = DEFAULT_LOCALE): MetaSegment[] => {
  const isEn = locale === DEFAULT_LOCALE;
  const year = releaseYear(meta.released);

  switch (meta.kind) {
    case 'music':
      return [
        text(`${meta.mediums.join('/')} — `),
        ...editionSegments(meta.editions),
        text(`, ${year}`),
      ];

    case 'compilation':
      return [
        ...collaboratorSegments(meta.collaborators, isEn),
        { kind: 'em', link: meta.compilation },
        text(` — ${meta.mediums.join('/')}, `),
        ...editionSegments(meta.editions),
        text(`, ${year}`),
      ];

    case 'commission':
      return commissionSegments(meta, isEn, year);

    case 'publication': {
      const segments: MetaSegment[] = [
        text(`${isEn ? 'Book' : 'Livro'} — `),
        { kind: 'link', link: meta.publisher },
        text(`, ${year}`),
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
        text(`, ${year}`),
      ];
  }
};
