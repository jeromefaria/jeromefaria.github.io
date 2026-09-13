import type { Localizable } from '@/i18n/localized';
import type { PtGrammar } from '@/i18n/ptGrammar';

export interface Venue {
  name: string;
  url?: string;
  label?: Localizable<string>;
  pt?: PtGrammar;
}

export type VenueRegistry = Record<string, Venue>;
