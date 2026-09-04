export const externalizeLinks = (html: string): string =>
  html.replace(/<a href="(https?:\/\/[^"]*)">/gi, '<a href="$1" target="_blank" rel="noopener noreferrer">');
