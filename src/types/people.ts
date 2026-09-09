export interface Person {
  name: string;
  url?: string;
  sameAs?: string[];
}

export type PersonId = string;

export type PeopleRegistry = Record<PersonId, Person>;
