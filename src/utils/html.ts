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

// Escape + scheme-allowlist so a stray javascript:/attribute-breaking url can
// never render as a live link. Returns null for a disallowed scheme.
export const safeHref = (url: string): string | null => {
  const trimmed = url.trim();
  return SAFE_SCHEME.test(trimmed) ? escapeHtml(trimmed) : null;
};
