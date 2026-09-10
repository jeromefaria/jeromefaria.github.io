import { people } from '@/data/people';
import type { Credit } from '@/types/media';
import { orgUrl } from '@/utils/orgs';
import { createNameLookup } from '@/utils/registry';

const findPerson = createNameLookup(people);

export const personUrl = (name: string): string | undefined => findPerson(name)?.url;

export const creditUrl = (credit: Credit): string | undefined =>
  credit.url ?? personUrl(credit.name) ?? orgUrl(credit.name);

export const personSameAs = (name: string, contextUrl?: string): string[] | undefined => {
  const person = findPerson(name);
  const registryLinks = person?.sameAs ?? (person?.url ? [person.url] : []);
  const links = [contextUrl, ...registryLinks].filter((link): link is string => Boolean(link));

  return links.length > 0 ? [...new Set(links)] : undefined;
};
