import type { Contributor } from '@/types/common';

const MARKER = /\[\[([^\]]+)\]\]/g;
const SAFE_SCHEME = /^(?:https?:|mailto:)/i;

const HTML_ESCAPES: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
};

const escapeHtml = (value: string): string =>
  value.replace(/[&<>"']/g, character => HTML_ESCAPES[character] ?? character);

// The data is author-controlled, but escape + scheme-allowlist so a stray
// javascript:/attribute-breaking url can never render as a live link.
const safeHref = (url: string): string | null => {
  const trimmed = url.trim();
  return SAFE_SCHEME.test(trimmed) ? escapeHtml(trimmed) : null;
};

export const renderCredits = (credits: string, contributors: Contributor[] = []): string => {
  const linked = new Map<string, string>();

  for (const contributor of contributors) {
    if (contributor.url) linked.set(contributor.name, contributor.url);
  }

  return credits.replace(MARKER, (_match, name: string) => {
    const href = linked.has(name) ? safeHref(linked.get(name) as string) : null;
    const safeName = escapeHtml(name);
    return href ? `<a href="${href}">${safeName}</a>` : safeName;
  });
};

export const plainCredits = (credits: string): string => credits.replace(MARKER, '$1');
