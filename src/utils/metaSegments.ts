import type { Edition, EngineeringRole, ReleaseMeta } from '@/types/works';

// Canonical order (workflow order), so ['mastering','mixing'] still reads "Mixing & Mastering".
export const engineeringRolesLabel = (roles: EngineeringRole[]): string =>
  (['mixing', 'mastering'] as EngineeringRole[])
    .filter(role => roles.includes(role))
    .map(role => (role === 'mixing' ? 'Mixing' : 'Mastering'))
    .join(' & ');

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

export const buildMetaSegments = (meta: ReleaseMeta): MetaSegment[] => {
  switch (meta.kind) {
    case 'music':
      return [
        text(`${meta.mediums.join('/')} — `),
        ...editionSegments(meta.editions),
        text(`, ${meta.year}`),
      ];

    case 'compilation': {
      const lead = meta.collaborators ? `with ${meta.collaborators.join(', ')} in ` : 'in ';
      return [
        text(lead),
        { kind: 'em', link: meta.compilation },
        text(` — ${meta.mediums.join('/')}, `),
        ...editionSegments(meta.editions),
        text(`, ${meta.year}`),
      ];
    }

    case 'commission':
      switch (meta.work) {
        case 'Film':
          return [text(`${meta.work} — dir. `), { kind: 'link', link: meta.director }, text(`, ${meta.year}`)];

        case 'Theatre':
          return [text(`${meta.work} — `), { kind: 'link', link: meta.venue }, text(`, ${meta.year}`)];

        case 'DVD': {
          const catalog = meta.publisher.catalog ? `, ${meta.publisher.catalog}` : '';
          return [text(`${meta.work} — `), { kind: 'link', link: meta.publisher.label }, text(`${catalog}, ${meta.year}`)];
        }

        case 'Live Score':
          return [text(`${meta.work} — ${meta.year}`)];
      }

    case 'publication': {
      const segments: MetaSegment[] = [
        text('Book — '),
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
        text(`${engineeringRolesLabel(meta.roles)} — `),
        ...editionSegments(meta.editions),
        text(`, ${meta.year}`),
      ];
  }
};
