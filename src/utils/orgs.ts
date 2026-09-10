import { orgs } from '@/data/orgs';

const byName = new Map<string, string>();

for (const org of Object.values(orgs)) if (org.url) byName.set(org.name, org.url);

export const orgUrl = (name: string): string | undefined => byName.get(name);
