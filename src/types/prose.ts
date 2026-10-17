import type { Localized } from '@/i18n/localized';

export interface ProseSection {
  heading: Localized<string>;
  body: Localized<string>;
}
