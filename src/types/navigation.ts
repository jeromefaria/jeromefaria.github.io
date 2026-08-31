export interface SiteConfig {
  title: string;
  tagline: string;
  description: string;
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
