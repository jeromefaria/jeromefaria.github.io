import type { Localizable } from '@/i18n/localized';
import type { PtGrammar } from '@/i18n/ptGrammar';

export interface Organization {
  name: string;
  url?: string;
  label?: Localizable<string>;
  pt?: PtGrammar;
}

export type OrgRegistry = Record<string, Organization>;
