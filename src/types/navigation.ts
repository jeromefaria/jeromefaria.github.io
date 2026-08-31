import type { Localized } from '@/i18n/localized';

export interface SiteConfig {
  title: string;
  tagline: Localized<string>;
  description: Localized<string>;
  url: string;
  image: string;
  author: {
    name: string;
    email: string;
    bio: string;
  };
}

export interface NavItem {
  labelKey: string;
  url: string;
}

export interface SocialLink {
  name: string;
  url: string;
}
