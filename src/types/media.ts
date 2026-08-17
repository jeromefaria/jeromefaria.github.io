// A credited contributor (name + optional link). Used as both a photo credit
// (photographer) and a video credit (author).
export interface Photographer {
  name: string;
  url?: string;
}

export interface Video {
  url: string;
  title: string;
  platform: 'youtube' | 'vimeo';
  author?: Photographer;
}
