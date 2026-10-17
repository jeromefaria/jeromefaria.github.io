import { orgs } from '@/data/orgs';
import type { MetaLink } from '@/types/common';
import type { OrgRef } from '@/types/orgs';
import { createNameLookup } from '@/utils/registry';

const findOrg = createNameLookup(orgs);

export const orgUrl = (name: string): string | undefined => findOrg(name)?.url;

export const resolveEditionLabel = (label: OrgRef | MetaLink): MetaLink => {
  if (typeof label === 'string') {
    const org = orgs[label];
    if (!org) throw new Error(`Unknown org ref: "${label}"`);

    return org.url ? { text: org.name, url: org.url } : { text: org.name };
  }

  const url = label.url ?? orgUrl(label.text);
  return url ? { text: label.text, url } : { text: label.text };
};
