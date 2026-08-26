export interface PrivacySection {
  heading: string;
  body: string;
}

export interface PrivacyContent {
  intro: string;
  sections: PrivacySection[];
  updated: string;
}

export const privacyContent: PrivacyContent = {
  intro: 'This site is a personal portfolio. It sets no cookies, runs no analytics, and tracks nothing about your visit.',
  sections: [
    {
      heading: 'Contact form',
      body: 'The information you enter—your name, email address, inquiry type, and message—is sent directly to me by email through <a href="https://resend.com">Resend</a> and is not stored on this site. I use it only to respond to you.',
    },
    {
      heading: 'Spam protection',
      body: 'The contact form is protected by Cloudflare Turnstile, which runs invisibly to confirm you are human. Its use is subject to Cloudflare\'s <a href="https://www.cloudflare.com/privacypolicy/">Privacy Policy</a> and <a href="https://www.cloudflare.com/turnstile-privacy-policy/">Turnstile Privacy Addendum</a>.',
    },
  ],
  updated: 'August 2026',
};
