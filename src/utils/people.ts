import { orgs } from '@/data/orgs';
import { people } from '@/data/people';
import { localize } from '@/i18n/localized';
import { DEFAULT_LOCALE } from '@/i18n/messages';
import type { Credit, CreditRef } from '@/types/media';
import { orgUrl } from '@/utils/orgs';
import { createNameLookup } from '@/utils/registry';

const findPerson = createNameLookup(people);

export const personUrl = (name: string): string | undefined => findPerson(name)?.url;

export const resolveCredit = (ref: CreditRef): Credit => {
  const person = people[ref];
  if (person) return person.url ? { name: person.name, url: person.url } : { name: person.name };

  const org = orgs[ref];
  if (org) {
    const name = org.label ? localize(org.label, DEFAULT_LOCALE) : org.name;

    return org.url ? { name, url: org.url } : { name };
  }

  throw new Error(`Unknown credit ref: "${ref}"`);
};

export const creditUrl = (credit: Credit): string | undefined =>
  credit.url ?? personUrl(credit.name) ?? orgUrl(credit.name);

export const personSameAs = (name: string, contextUrl?: string): string[] | undefined => {
  const person = findPerson(name);
  const registryLinks = person?.sameAs ?? (person?.url ? [person.url] : []);
  const links = [contextUrl, ...registryLinks].filter((link): link is string => Boolean(link));

  return links.length > 0 ? [...new Set(links)] : undefined;
};
