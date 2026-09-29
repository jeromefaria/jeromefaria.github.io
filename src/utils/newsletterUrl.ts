const SAFE_SCHEME = /^(?:https?:|mailto:|\/|#)/i;

export const safeNewsletterUrl = (url: string | null | undefined): string | null => {
  if (!url) return null;

  const trimmed = url.trim();
  return SAFE_SCHEME.test(trimmed) ? trimmed : null;
};
