export interface ProseBlock {
  type: 'prose';
  markdown: string;
}

export interface ImageBlock {
  type: 'image';
  src: string;
  alt: string;
  label?: string;
  caption?: string;
  href?: string;
}

export interface VideoBlock {
  type: 'video';
  poster: string;
  href: string;
  embedUrl?: string;
  alt: string;
  label?: string;
  caption?: string;
}

export interface WritingBlock {
  type: 'writing';
  ref: string;
  note?: string;
}

export interface ListenBlock {
  type: 'listen';
  ref: string;
  note?: string;
}

export interface LiveBlock {
  type: 'live';
  ref: string;
  note?: string;
}

export interface CtaBlock {
  type: 'cta';
  label: string;
  href: string;
}

export type IssueBlock =
  | ProseBlock
  | ImageBlock
  | VideoBlock
  | WritingBlock
  | ListenBlock
  | LiveBlock
  | CtaBlock;

export interface NewsletterIssue {
  id: string;
  date: string;
  subject: string;
  blocks: IssueBlock[];
}
