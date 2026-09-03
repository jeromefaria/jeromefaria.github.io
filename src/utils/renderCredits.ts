import { localize } from '@/i18n/localized';
import { DEFAULT_LOCALE, type Locale } from '@/i18n/messages';
import type { CreditClause, CreditRole, Credits, StructuredCredits } from '@/types/credits';
import { isStructuredCredits } from '@/types/credits';
import type { Credit } from '@/types/media';
import { escapeHtml, safeHref } from '@/utils/html';

const MARKER = /\[\[([^\]]+)\]\]/g;

const ROLE_TEXT: Record<Locale, Record<CreditRole, string>> = {
  en: {
    music: 'Music',
    artwork: 'Artwork',
    musicAndArtwork: 'Music and artwork',
    photography: 'Photography',
    visuals: 'Visuals',
    performed: 'Performed',
    recordedMixedMastered: 'Recorded, mixed, and mastered',
    direction: 'Direction',
    text: 'Text',
    setDesign: 'Set design',
    video: 'Video',
    musicAndLiveInterpretation: 'Music and live interpretation',
    producer: 'Producer',
    cinematography: 'Cinematography',
    soundDesign: 'Sound design',
    soundEditor: 'Sound editor',
    editing: 'Editing',
    cast: 'Cast',
    shot: 'Shot',
    editingAndCuration: 'Editing and curation',
    additionalCuration: 'Additional curation',
    design: 'Design',
  },
  pt: {
    music: 'Música',
    artwork: 'Grafismo',
    musicAndArtwork: 'Música e grafismo',
    photography: 'Fotografia',
    visuals: 'Visuais',
    performed: 'Interpretação',
    recordedMixedMastered: 'Gravado, misturado e masterizado',
    direction: 'Encenação',
    text: 'Texto',
    setDesign: 'Cenografia',
    video: 'Vídeo',
    musicAndLiveInterpretation: 'Música e interpretação ao vivo',
    producer: 'Produção',
    cinematography: 'Imagem',
    soundDesign: 'Sonoplastia',
    soundEditor: 'Montagem de som',
    editing: 'Montagem',
    cast: 'Elenco',
    shot: 'Filmado',
    editingAndCuration: 'Montagem e curadoria',
    additionalCuration: 'Curadoria adicional',
    design: 'Design',
  },
};

const CONNECTORS_EN = { by: ' by ', at: ' at ', colon: ': ' } as const;

const PARTICIPLE_ROLES = new Set<CreditRole>(['recordedMixedMastered', 'shot']);

const ptConnector = (clause: CreditClause, style: StructuredCredits['style']): string => {
  const connector = clause.connector ?? style;
  if (connector === 'colon') return ': ';
  if (connector === 'at') return ' no ';
  return PARTICIPLE_ROLES.has(clause.role) ? ' por ' : ' de ';
};

const composeClause = (clause: CreditClause, style: StructuredCredits['style'], locale: Locale): string => {
  const connector = locale === DEFAULT_LOCALE ? CONNECTORS_EN[clause.connector ?? style] : ptConnector(clause, style);
  const of = locale === DEFAULT_LOCALE ? clause.of : clause.of.replace(/ and /g, ' e ');
  const tail = clause.tail ? localize(clause.tail, locale) : '';
  return `${ROLE_TEXT[locale][clause.role]}${connector}${of}${tail}`;
};

const compose = (credits: StructuredCredits, locale: Locale): string => {
  const lines = credits.clauses.map(clause => composeClause(clause, credits.style, locale));
  const parts = credits.note ? [...lines, localize(credits.note, locale)] : lines;
  return `${parts.join('. ')}.`;
};

const toSource = (credits: Credits, locale: Locale): string =>
  (isStructuredCredits(credits) ? compose(credits, locale) : credits);

export const renderCredits = (credits: Credits, contributors: Credit[] = [], locale: Locale = DEFAULT_LOCALE): string => {
  const linked = new Map<string, string>();

  for (const contributor of contributors) {
    if (contributor.url) linked.set(contributor.name, contributor.url);
  }

  return toSource(credits, locale).replace(MARKER, (_match, name: string) => {
    const url = linked.get(name);
    const href = url ? safeHref(url) : null;
    const safeName = escapeHtml(name);
    return href ? `<a href="${href}">${safeName}</a>` : safeName;
  });
};

export const plainCredits = (credits: Credits, locale: Locale = DEFAULT_LOCALE): string =>
  toSource(credits, locale).replace(MARKER, '$1');
