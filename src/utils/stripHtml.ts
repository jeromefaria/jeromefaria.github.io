export const stripHtml = (html = ''): string =>
  html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
