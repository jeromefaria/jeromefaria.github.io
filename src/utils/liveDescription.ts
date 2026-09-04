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

// eslint-disable-next-line local/no-comments -- security asymmetry
// entry.text is trusted author HTML (intentionally unescaped), but entry.url must stay wrapped in safeHref so a javascript:/attribute-breaking url can never render.
const act = (entry: Act, locale: Locale): string => {
  const href = entry.url ? safeHref(entry.url) : null;
  const named = href ? `<a href="${href}">${entry.text}</a>` : entry.text;
  return entry.suffix ? `${named} ${localize(entry.suffix, locale)}` : named;
};

const billEntry = (entry: BillEntry, locale: Locale): string =>
  (Array.isArray(entry) ? entry.map(item => act(item, locale)).join(' & ') : act(entry, locale));

const setupLead = (setup: Setup, phrases: Phrases, locale: Locale): string => {
  switch (setup.kind) {
    case 'solo':
      return phrases.solo;
    case 'duo':
      return phrases.duoWith(act(setup.with, locale));
    case 'project': {
      const members = setup.members?.length ? phrases.projectMembers(setup.members.map(member => act(member, locale)).join(', ')) : '';
      return `${act(setup.name, locale)}${members}.`;
    }
    case 'band':
      return phrases.asPartOf(act(setup.band, locale));
    case 'ensemble': {
      const members = setup.members?.length ? phrases.ensembleMembers(setup.members.map(member => act(member, locale)).join(', ')) : '';
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
      const collaborator = setup.kind === 'duo' ? phrases.filmScoreWith(act(setup.with, locale)) : '';
      return `${opener} ${localize(format.film, locale)}${collaborator}.`;
    }
  }
};

export const buildEventDescription = (event: LiveEvent, locale: Locale = DEFAULT_LOCALE): string => {
  const phrases = PHRASES[locale];
  const parts = [primary(event.setup, phrases, locale, event.format)];

  if (event.performedAs) parts.push(phrases.performedAs(event.performedAs));
  if (event.note) parts.push(localize(event.note, locale));
  if (event.bill?.length) parts.push(phrases.alongside(event.bill.map(entry => billEntry(entry, locale)).join(', ')));

  return parts.join(' ');
};
