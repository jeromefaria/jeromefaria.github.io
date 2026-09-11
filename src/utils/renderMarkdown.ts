import { marked } from 'marked';

import { externalizeLinks } from './externalizeLinks';

marked.setOptions({ gfm: true, breaks: true });

export const renderMarkdown = (markdown: string): string =>
  externalizeLinks(marked.parse(markdown, { async: false }));
