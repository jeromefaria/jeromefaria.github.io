export interface ColophonSection {
  heading: string;
  body: string;
}

export interface ColophonContent {
  intro: string;
  sections: ColophonSection[];
  source: string;
}

export const colophonContent: ColophonContent = {
  intro: 'This is a portfolio, but it is also a made thing — put together with the same care I bring to the music. Here is what it runs on, and the thinking behind it.',
  sections: [
    {
      heading: 'The stack',
      body: 'Vue 3 and TypeScript throughout, pre-rendered to static HTML with Vite-SSG so every page arrives as plain, fast markup and works before a line of JavaScript runs. Served from GitHub Pages.',
    },
    {
      heading: 'By design',
      body: 'Keyboard-first — press <button type="button" class="palette-cue">⌘K</button> anywhere to jump between pages, search, or play a release. The theme follows your system and can be toggled. Every screen targets WCAG AA contrast, honours reduced-motion, and sets no cookies and no analytics.',
    },
    {
      heading: 'Kept honest',
      body: 'The interface is covered by unit, end-to-end, and visual-regression tests that run on every change, so a stray style or a broken link fails the build instead of the page. Even the controls you can barely see are checked for contrast.',
    },
    {
      heading: 'Contact, privately',
      body: 'The contact form runs on a Cloudflare Worker with spam protection and no third-party trackers. The <a href="/privacy">privacy page</a> has the details.',
    },
  ],
  source: 'The whole thing is open source — read it on <a href="https://github.com/jeromefaria/jeromefaria.github.io">GitHub</a>.',
};
