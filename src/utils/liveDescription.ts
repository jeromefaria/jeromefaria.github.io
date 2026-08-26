import type { Act, Format, LiveEvent, Setup } from '@/types/live';

const act = (entry: Act): string => {
  const named = entry.url ? `<a href="${entry.url}">${entry.text}</a>` : entry.text;
  return entry.suffix ? `${named} ${entry.suffix}` : named;
};

const setupLead = (setup: Setup): string => {
  switch (setup.kind) {
    case 'solo':
      return 'Solo performance.';
    case 'duo':
      return `Duo with ${act(setup.with)}.`;
    case 'project': {
      const members = setup.members?.length ? ` (with ${setup.members.map(act).join(', ')})` : '';
      return `${act(setup.name)}${members}.`;
    }
    case 'band':
      return `As part of ${act(setup.band)}.`;
    case 'ensemble': {
      const members = setup.members?.length ? ` Alongside ${setup.members.map(act).join(', ')}.` : '';
      return `${setup.name}.${members}`;
    }
  }
};

const primary = (setup: Setup, format?: Format): string => {
  if (!format) return setupLead(setup);

  switch (format.kind) {
    case 'theatre':
      return 'Theatre production. Live music & interpretation.';
    case 'talk':
      return `${setupLead(setup).replace(/\.$/, '')} and artist talk.`;
    case 'filmScore': {
      const opener = format.premiere ? 'Premiere of live score for' : 'Live score for';
      const collaborator = setup.kind === 'duo' ? `, with ${act(setup.with)}` : '';
      return `${opener} ${format.film}${collaborator}.`;
    }
  }
};

export const buildEventDescription = (event: LiveEvent): string => {
  const parts = [primary(event.setup, event.format)];

  if (event.note) parts.push(event.note);
  if (event.bill?.length) parts.push(`Alongside ${event.bill.map(act).join(', ')}.`);

  return parts.join(' ');
};
