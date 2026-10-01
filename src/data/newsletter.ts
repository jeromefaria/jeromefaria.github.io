export interface NewsletterConfig {
  action: string;
  confirm: string;
  unsubscribe: string;
  turnstileSiteKey: string;
}

const base = import.meta.env.VITE_NEWSLETTER_API ?? 'https://contact.jeromefaria.workers.dev/newsletter';

export const newsletterContent: NewsletterConfig = {
  action: `${base}/subscribe`,
  confirm: `${base}/confirm`,
  unsubscribe: `${base}/unsubscribe`,
  turnstileSiteKey: '0x4AAAAAAEdHqOqCP3kQoP_p',
};
