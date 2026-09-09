export interface Venue {
  name: string;
  url: string;
}

export type VenueRegistry = Record<string, Venue>;
