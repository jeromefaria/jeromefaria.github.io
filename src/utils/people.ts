import { people } from '@/data/people';
import type { Credit } from '@/types/media';
import type { Person } from '@/types/people';

const byName = new Map<string, Person>();

for (const person of Object.values(people)) byName.set(person.name, person);

export const personUrl = (name: string): string | undefined => byName.get(name)?.url;

export const creditUrl = (credit: Credit): string | undefined => credit.url ?? personUrl(credit.name);

export const personSameAs = (name: string, contextUrl?: string): string[] | undefined => {
  const person = byName.get(name);
  const registryLinks = person?.sameAs ?? (person?.url ? [person.url] : []);
  const links = [...new Set([contextUrl, ...registryLinks].filter((link): link is string => Boolean(link)))];

  return links.length > 0 ? links : undefined;
};
