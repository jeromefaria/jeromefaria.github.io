import type { NewsletterIssue } from '../types.ts';

export const issue: NewsletterIssue = {
  id: '2026-05',
  date: '2026-05-12',
  subject: 'Contraplacado, and a night in Porto',
  blocks: [
    {
      type: 'prose',
      markdown: 'A short note to open — no grand announcements, just where things are and one or two things worth your ears.',
    },
    {
      type: 'listen',
      ref: 'contraplacado',
      note: 'A record built almost entirely from a single prepared piano, dissolved and rebuilt. Out now.',
    },
    {
      type: 'live',
      ref: 'jejum-45',
      note: 'One night, a solo set among friends. If you are anywhere near Castelo Branco.',
    },
    {
      type: 'image',
      src: '/images/performance.jpg',
      alt: 'Jerome Faria performing live',
      caption: 'A standalone image block — a photo, a poster, anything visual.',
    },
    {
      type: 'video',
      poster: '/images/about-2009-madeiradig.jpg',
      href: 'https://www.youtube.com/@jeromefaria',
      alt: 'Live performance video',
      caption: 'A video block — a poster that links out to where it plays.',
    },
    {
      type: 'writing',
      ref: 'orchestration',
    },
  ],
};
