import type { Localizable } from '@/i18n/localized';

export interface Credit {
  name: string;
  url?: string;
}

export interface Video {
  url: string;
  title: Localizable<string>;
  platform: 'youtube' | 'vimeo';
  author?: Credit;
}
