import { people } from '@/data/people';
import type { Person } from '@/types/people';

const byName = new Map<string, Person>();

for (const person of Object.values(people)) byName.set(person.name, person);

export const personUrl = (name: string): string | undefined => byName.get(name)?.url;

export const personSameAs = (name: string, fallbackUrl?: string): string[] | undefined => {
  const person = byName.get(name);
  const links = person?.sameAs ?? [person?.url ?? fallbackUrl].filter((link): link is string => Boolean(link));

  return links.length > 0 ? links : undefined;
};
