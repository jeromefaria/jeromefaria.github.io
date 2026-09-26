export interface NewsletterConfig {
  action: string;
  turnstileSiteKey: string;
}

export const newsletterContent: NewsletterConfig = {
  action: 'https://contact.jeromefaria.workers.dev/newsletter/subscribe',
  turnstileSiteKey: '0x4AAAAAAEdHqOqCP3kQoP_p',
};
