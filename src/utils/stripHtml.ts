export const stripHtml = (html = ''): string => {
  let text = String(html);
  let previous: string;

  // eslint-disable-next-line local/no-comments -- static-analysis constraint
  // Strip to a fixed point: CodeQL flags a single-pass tag removal as incomplete sanitization, and looping stays correct if the pattern is ever narrowed to specific tags. Don't collapse to one replace.
  do {
    previous = text;
    text = text.replace(/<[^>]+>/g, '');
  } while (text !== previous);

  return text.replace(/\s+/g, ' ').trim();
};
