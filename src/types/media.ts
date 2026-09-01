import type { Localized } from '@/i18n/localized';

export interface Credit {
  name: string;
  url?: string;
}

export interface Video {
  url: string;
  title: string | Localized<string>;
  platform: 'youtube' | 'vimeo';
  author?: Credit;
}
