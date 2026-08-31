import type { Contributor } from '@/types/common';
import type { CreditClause, CreditRole, Credits, StructuredCredits } from '@/types/credits';
import { isStructuredCredits } from '@/types/credits';

const MARKER = /\[\[([^\]]+)\]\]/g;
const SAFE_SCHEME = /^(?:https?:|mailto:)/i;

const HTML_ESCAPES: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
};

const ROLE_TEXT: Record<CreditRole, string> = {
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
};

const CONNECTORS = { by: ' by ', at: ' at ', colon: ': ' } as const;

const composeClause = (clause: CreditClause, style: StructuredCredits['style']): string => {
  const connector = clause.connector ?? style;
  return `${ROLE_TEXT[clause.role]}${CONNECTORS[connector]}${clause.of}${clause.tail ?? ''}`;
};

const compose = (credits: StructuredCredits): string => {
  const lines = credits.clauses.map(clause => composeClause(clause, credits.style));
  const parts = credits.note ? [...lines, credits.note] : lines;
  return `${parts.join('. ')}.`;
};

const toSource = (credits: Credits): string => (isStructuredCredits(credits) ? compose(credits) : credits);

const escapeHtml = (value: string): string =>
  value.replace(/[&<>"']/g, character => HTML_ESCAPES[character] ?? character);

// The data is author-controlled, but escape + scheme-allowlist so a stray
// javascript:/attribute-breaking url can never render as a live link.
const safeHref = (url: string): string | null => {
  const trimmed = url.trim();
  return SAFE_SCHEME.test(trimmed) ? escapeHtml(trimmed) : null;
};

export const renderCredits = (credits: Credits, contributors: Contributor[] = []): string => {
  const linked = new Map<string, string>();

  for (const contributor of contributors) {
    if (contributor.url) linked.set(contributor.name, contributor.url);
  }

  return toSource(credits).replace(MARKER, (_match, name: string) => {
    const href = linked.has(name) ? safeHref(linked.get(name) as string) : null;
    const safeName = escapeHtml(name);
    return href ? `<a href="${href}">${safeName}</a>` : safeName;
  });
};

export const plainCredits = (credits: Credits): string => toSource(credits).replace(MARKER, '$1');
