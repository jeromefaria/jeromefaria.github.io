export interface Organization {
  name: string;
  url: string;
}

export type OrgRegistry = Record<string, Organization>;
