import type { MetaLink } from '@/types/common';
import type { Act, LiveEvent, Performance } from '@/types/live';

const link = (item: MetaLink): string => (item.url ? `<a href="${item.url}">${item.text}</a>` : item.text);

const lead = (performance: Performance): string => {
  switch (performance.kind) {
    case 'solo':
      return 'Solo performance.';
    case 'duo':
      return `Duo with ${act(performance.with)}.`;
    case 'project': {
      const members = performance.members?.length ? ` (with ${performance.members.map(link).join(', ')})` : '';
      return `${link(performance.name)}${members}.`;
    }
    case 'withBand':
      return `As part of ${link(performance.band)}.`;
    case 'ensemble':
      return `${performance.name}.${performance.note ? ` ${performance.note}` : ''}`;
    case 'theatre':
      return 'Theatre production. Live music & interpretation.';
    case 'filmScore': {
      const opener = performance.premiere ? 'Premiere of live score for ' : 'Live score for ';
      const collaborator = performance.with ? `, with ${act(performance.with)}` : '';
      return `${opener}${performance.film}${collaborator}.`;
    }
    case 'talk':
      return 'Artist talk and performance.';
  }
};

const act = (entry: Act): string => {
  const named = entry.url ? `<a href="${entry.url}">${entry.text}</a>` : entry.text;
  return entry.suffix ? `${named} ${entry.suffix}` : named;
};

export const buildEventDescription = (event: LiveEvent): string => {
  const parts = [lead(event.performance)];

  if (event.note) parts.push(event.note);
  if (event.lineup?.length) parts.push(`Alongside ${event.lineup.map(act).join(', ')}.`);

  return parts.join(' ');
};
