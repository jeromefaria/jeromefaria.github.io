import { localize } from '@/i18n/localized';
import { DEFAULT_LOCALE, type Locale } from '@/i18n/messages';
import type { Act, BillEntry, Format, LiveEvent, Setup } from '@/types/live';
import { safeHref } from '@/utils/html';

interface Phrases {
  solo: string;
  duoWith: (act: string) => string;
  projectMembers: (members: string) => string;
  asPartOf: (band: string) => string;
  ensembleMembers: (members: string) => string;
  theatre: string;
  talkSuffix: string;
  filmScorePremiere: string;
  filmScoreLive: string;
  filmScoreWith: (act: string) => string;
  performedAs: (name: string) => string;
  alongside: (acts: string) => string;
}

const PHRASES: Record<Locale, Phrases> = {
  en: {
    solo: 'Solo performance.',
    duoWith: withAct => `Duo with ${withAct}.`,
    projectMembers: members => ` (with ${members})`,
    asPartOf: band => `As part of ${band}.`,
    ensembleMembers: members => ` Alongside ${members}.`,
    theatre: 'Theatre production. Live music & interpretation.',
    talkSuffix: ' and artist talk.',
    filmScorePremiere: 'Premiere of live score for',
    filmScoreLive: 'Live score for',
    filmScoreWith: withAct => `, with ${withAct}`,
    performedAs: name => `Performed as ${name}.`,
    alongside: acts => `Alongside ${acts}.`,
  },
  pt: {
    solo: 'Actuação a solo.',
    duoWith: withAct => `Em duo com ${withAct}.`,
    projectMembers: members => ` (com ${members})`,
    asPartOf: band => `Integrado em ${band}.`,
    ensembleMembers: members => ` Ao lado de ${members}.`,
    theatre: 'Produção teatral. Música e interpretação ao vivo.',
    talkSuffix: ' e conversa com o artista.',
    filmScorePremiere: 'Estreia da banda sonora ao vivo para',
    filmScoreLive: 'Banda sonora ao vivo para',
    filmScoreWith: withAct => `, com ${withAct}`,
    performedAs: name => `Como ${name}.`,
    alongside: acts => `Ao lado de ${acts}.`,
  },
};

// entry.text is trusted author HTML (some acts embed their own member links), so it
// is not escaped — but entry.url lands in an href attribute, so scheme-allowlist and
// escape it via safeHref (a javascript: or attribute-breaking url can never render).
const act = (entry: Act): string => {
  const href = entry.url ? safeHref(entry.url) : null;
  const named = href ? `<a href="${href}">${entry.text}</a>` : entry.text;
  return entry.suffix ? `${named} ${entry.suffix}` : named;
};

const billEntry = (entry: BillEntry): string => (Array.isArray(entry) ? entry.map(act).join(' & ') : act(entry));

const setupLead = (setup: Setup, phrases: Phrases, locale: Locale): string => {
  switch (setup.kind) {
    case 'solo':
      return phrases.solo;
    case 'duo':
      return phrases.duoWith(act(setup.with));
    case 'project': {
      const members = setup.members?.length ? phrases.projectMembers(setup.members.map(act).join(', ')) : '';
      return `${act(setup.name)}${members}.`;
    }
    case 'band':
      return phrases.asPartOf(act(setup.band));
    case 'ensemble': {
      const members = setup.members?.length ? phrases.ensembleMembers(setup.members.map(act).join(', ')) : '';
      return `${localize(setup.name, locale)}.${members}`;
    }
  }
};

const primary = (setup: Setup, phrases: Phrases, locale: Locale, format?: Format): string => {
  if (!format) return setupLead(setup, phrases, locale);

  switch (format.kind) {
    case 'theatre':
      return phrases.theatre;
    case 'talk':
      return `${setupLead(setup, phrases, locale).replace(/\.$/, '')}${phrases.talkSuffix}`;
    case 'filmScore': {
      const opener = format.premiere ? phrases.filmScorePremiere : phrases.filmScoreLive;
      const collaborator = setup.kind === 'duo' ? phrases.filmScoreWith(act(setup.with)) : '';
      return `${opener} ${format.film}${collaborator}.`;
    }
  }
};

export const buildEventDescription = (event: LiveEvent, locale: Locale = DEFAULT_LOCALE): string => {
  const phrases = PHRASES[locale];
  const parts = [primary(event.setup, phrases, locale, event.format)];

  if (event.performedAs) parts.push(phrases.performedAs(event.performedAs));
  if (event.note) parts.push(localize(event.note, locale));
  if (event.bill?.length) parts.push(phrases.alongside(event.bill.map(billEntry).join(', ')));

  return parts.join(' ');
};
