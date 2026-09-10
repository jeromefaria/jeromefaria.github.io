import { orgs } from '@/data/orgs';
import { createNameLookup } from '@/utils/registry';

const findOrg = createNameLookup(orgs);

export const orgUrl = (name: string): string | undefined => findOrg(name)?.url;
