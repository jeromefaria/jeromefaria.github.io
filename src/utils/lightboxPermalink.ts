export type LightboxMediaKind = 'photo' | 'poster' | 'video';

export interface LightboxSource {
  id: string;
  kind: LightboxMediaKind;
}

export interface ParsedMediaFragment extends LightboxSource {
  index: number;
}

const FRAGMENT = /^(.+)\/(photo|poster|video)\/(\d+)$/;

export const mediaFragment = (source: LightboxSource, index: number): string =>
  `${source.id}/${source.kind}/${index + 1}`;

export const parseMediaFragment = (fragment: string): ParsedMediaFragment | null => {
  const match = FRAGMENT.exec(fragment);
  if (!match) return null;

  const [, id, kind, rawIndex] = match;
  if (!id || !kind || !rawIndex) return null;

  const index = Number(rawIndex) - 1;
  if (index < 0) return null;

  return { id, kind: kind as LightboxMediaKind, index };
};

export const baseFragment = (fragment: string): string =>
  parseMediaFragment(fragment)?.id ?? fragment;
