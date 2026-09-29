const SAFE_SCHEME = /^(?:https?:|mailto:)/i;

const HTML_ESCAPES: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
};

export const escapeHtml = (value: string): string =>
  value.replace(/[&<>"']/g, character => HTML_ESCAPES[character] ?? character);

export const safeHref = (url: string): string | null => {
  const trimmed = url.trim();
  return SAFE_SCHEME.test(trimmed) ? escapeHtml(trimmed) : null;
};

export const anchor = (inner: string, url?: string): string => {
  const href = url ? safeHref(url) : null;
  return href ? `<a href="${href}">${inner}</a>` : inner;
};
