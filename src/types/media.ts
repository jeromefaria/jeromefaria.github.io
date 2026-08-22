export interface Credit {
  name: string;
  url?: string;
}

export interface Video {
  url: string;
  title: string;
  platform: 'youtube' | 'vimeo';
  author?: Credit;
}
