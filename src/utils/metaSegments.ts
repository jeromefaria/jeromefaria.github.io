import type { Edition, ReleaseMeta } from '@/types/works';

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

    case 'commission': {
      if (meta.director) {
        return [text(`${meta.work} — dir. `), { kind: 'link', link: meta.director }, text(`, ${meta.year}`)];
      }

      if (meta.venue) {
        return [text(`${meta.work} — `), { kind: 'link', link: meta.venue }, text(`, ${meta.year}`)];
      }

      if (meta.publisher) {
        const catalog = meta.publisher.catalog ? `, ${meta.publisher.catalog}` : '';
        return [text(`${meta.work} — `), { kind: 'link', link: meta.publisher.label }, text(`${catalog}, ${meta.year}`)];
      }

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

    case 'mastering':
      return [
        { kind: 'link', link: meta.artist },
        text(' — '),
        ...editionSegments(meta.editions),
        text(`, ${meta.year}`),
      ];
  }
};
