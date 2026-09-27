import { type Credits, isStructuredCredits } from '@/types/credits';
import type { LiveImage, Poster } from '@/types/live';
import { escapeHtml, safeHref } from '@/utils/html';
import { orgUrl } from '@/utils/orgs';
import { creditUrl, personUrl, resolveCredit } from '@/utils/people';
import { resolveMarkers } from '@/utils/renderCredits';

export interface PhotoCredit {
  prefix: string;
  html: string;
}

const linkedName = (name: string, url: string | undefined): string => {
  const href = url ? safeHref(url) : null;
  const safeName = escapeHtml(name);

  return href ? `<a href="${href}">${safeName}</a>` : safeName;
};

export const releasePhotoCredit = (credits: Credits | undefined): PhotoCredit | null => {
  if (!credits || !isStructuredCredits(credits)) return null;

  const clause = credits.clauses.find(entry => entry.role === 'photography');
  if (!clause) return null;

  return { prefix: 'Photo by', html: resolveMarkers(clause.of, name => personUrl(name) ?? orgUrl(name)) };
};

export const eventPhotoCredit = (cover: LiveImage | undefined, poster: Poster | undefined): PhotoCredit | null => {
  if (cover?.src && cover.photographer) {
    const credit = resolveCredit(cover.photographer);

    return { prefix: 'Photo by', html: linkedName(credit.name, creditUrl(credit)) };
  }

  if (!cover?.src && poster?.artist) {
    return { prefix: 'Poster by', html: linkedName(poster.artist.name, creditUrl(poster.artist)) };
  }

  return null;
};
