// Rewrites external anchors in trusted prose HTML (credits, descriptions) so
// they open in a new tab with a safe rel, matching the structured meta links.
// This runs at render time — unlike a mounted directive — so the attributes are
// present in the pre-rendered SSG output, not only after client hydration. The
// content is our own static data, so a targeted string rewrite is safe here.
export const externalizeLinks = (html: string): string =>
  html.replace(/<a href="(https?:\/\/[^"]*)">/gi, '<a href="$1" target="_blank" rel="noopener noreferrer">');
