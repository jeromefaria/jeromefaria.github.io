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
  intro: 'This site is a personal portfolio. It sets no cookies, runs no analytics, and tracks nothing about your visit. The only time it collects anything about you is when you use the contact form. The rest of this page explains, plainly, where your data can go when you interact with the site.',
  sections: [
    {
      heading: 'Contact form',
      body: 'The information you enter—your name, email address, inquiry type, and message—is sent directly to me by email through <a href="https://resend.com">Resend</a>, the service that delivers it. It is not stored on this site or in any database. I use it only to reply to you, and I keep our correspondence only as long as I need to handle your inquiry.',
    },
    {
      heading: 'Spam protection',
      body: 'The contact form is protected by Cloudflare Turnstile, which runs invisibly to confirm you are a person rather than a bot. To do that it may read basic signals from your browser; Cloudflare states it is not used for advertising. Its use is subject to Cloudflare\'s <a href="https://www.cloudflare.com/privacypolicy/">Privacy Policy</a> and <a href="https://www.cloudflare.com/turnstile-privacy-policy/">Turnstile Privacy Addendum</a>.',
    },
    {
      heading: 'Embedded players',
      body: 'Some releases and live entries embed players from <a href="https://bandcamp.com/privacy">Bandcamp</a>, <a href="https://policies.google.com/privacy">YouTube</a>, or <a href="https://vimeo.com/privacy">Vimeo</a>. Nothing from these services loads until you choose to open a player; once you do, that service receives the request and its own privacy policy applies. YouTube embeds use its privacy-enhanced no-cookie mode.',
    },
    {
      heading: 'Hosting',
      body: 'The site is served by <a href="https://docs.github.com/site-policy/privacy-policies/github-privacy-statement">GitHub Pages</a>, and the contact form, its spam check, and the audio streaming run through <a href="https://www.cloudflare.com/privacypolicy/">Cloudflare</a>. As with any web host, these providers keep standard server logs—such as your IP address—to deliver the site and protect it from abuse. I have no separate access to that data.',
    },
    {
      heading: 'Your preferences',
      body: 'Your theme choice, whether the audio player is on, and your recent <button type="button" class="palette-cue">command palette</button> searches are saved in your browser\'s local storage. They stay on your device, are never sent anywhere, and clearing your browser data removes them.',
    },
    {
      heading: 'Your data and rights',
      body: 'For anything you send me, I am the data controller. You can ask me to see, correct, or delete what you have shared at any time—just <a href="/contact">get in touch</a>. If you are in the EU, you also have the right to lodge a complaint with your national data-protection authority.',
    },
  ],
  updated: 'August 2026',
};
