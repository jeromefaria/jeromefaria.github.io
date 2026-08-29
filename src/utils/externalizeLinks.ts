// Runs at render time (not a mounted directive) so target/rel land in the pre-rendered SSG HTML.
export const externalizeLinks = (html: string): string =>
  html.replace(/<a href="(https?:\/\/[^"]*)">/gi, '<a href="$1" target="_blank" rel="noopener noreferrer">');
