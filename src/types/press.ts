import type { Localized } from '@/i18n/localized';

export interface PressQuote {
  id: string;
  quote: Localized<string>;
  source: string;
  url?: string;
}
