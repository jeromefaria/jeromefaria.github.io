// A credited contributor: a name and an optional link. Serves as a photo
// (photographer), poster (artist), or video (author) credit.
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
