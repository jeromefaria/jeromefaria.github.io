const ALLOWED_EMBED_DOMAINS = ['youtube-nocookie.com', 'youtube.com', 'vimeo.com'];

export const isAllowedEmbedUrl = (url: string): boolean => {
  try {
    const { protocol, hostname } = new URL(url);
    if (protocol !== 'https:') return false;

    return ALLOWED_EMBED_DOMAINS.some(domain => hostname === domain || hostname.endsWith(`.${domain}`));
  } catch {
    return false;
  }
};
