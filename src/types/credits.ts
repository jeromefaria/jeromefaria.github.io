import type { Localized } from '@/i18n/localized';

export type CreditRole =
  | 'music'
  | 'artwork'
  | 'musicAndArtwork'
  | 'photography'
  | 'visuals'
  | 'performed'
  | 'recordedMixedMastered'
  | 'direction'
  | 'text'
  | 'setDesign'
  | 'video'
  | 'musicAndLiveInterpretation'
  | 'producer'
  | 'cinematography'
  | 'soundDesign'
  | 'soundEditor'
  | 'editing'
  | 'cast'
  | 'shot'
  | 'editingAndCuration'
  | 'additionalCuration'
  | 'design';

export interface CreditClause {
  role: CreditRole;
  of: string;
  connector?: 'at';
  tail?: Localized<string>;
}

export interface StructuredCredits {
  style: 'by' | 'colon';
  clauses: CreditClause[];
  note?: Localized<string>;
}

export type Credits = string | StructuredCredits;

export const isStructuredCredits = (credits: Credits): credits is StructuredCredits =>
  typeof credits !== 'string';
