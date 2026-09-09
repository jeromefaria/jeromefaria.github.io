import { people } from '@/data/people';
import type { Person } from '@/types/people';

const byName = new Map<string, Person>();

for (const person of Object.values(people)) byName.set(person.name, person);

export const personUrl = (name: string): string | undefined => byName.get(name)?.url;
