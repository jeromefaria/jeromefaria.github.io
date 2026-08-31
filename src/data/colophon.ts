import type { Localized } from '@/i18n/localized';

export interface ColophonSection {
  heading: Localized<string>;
  body: Localized<string>;
}

export interface ColophonContent {
  intro: Localized<string>;
  sections: ColophonSection[];
  source: Localized<string>;
}

export const colophonContent: ColophonContent = {
  intro: {
    en: 'This is a portfolio, but it is also a made thing — put together with the same care I bring to the music. Here is what it runs on, and the thinking behind it.',
    pt: 'Isto é um portefólio, mas é também um objecto trabalhado — feito com o mesmo cuidado que ponho na música. Aqui fica o que o faz funcionar, e o pensamento por detrás dele.',
  },
  sections: [
    {
      heading: { en: 'The stack', pt: 'A tecnologia' },
      body: {
        en: 'Vue 3 and TypeScript throughout, pre-rendered to static HTML with Vite-SSG so every page arrives as plain, fast markup and works before a line of JavaScript runs. Served from GitHub Pages.',
        pt: 'Vue 3 e TypeScript de ponta a ponta, pré-renderizado para HTML estático com Vite-SSG, para que cada página chegue como marcação simples, carregue depressa e funcione antes de correr uma única linha de JavaScript. Alojado no GitHub Pages.',
      },
    },
    {
      heading: { en: 'By design', pt: 'Por opção' },
      body: {
        en: 'Keyboard-first — press <button type="button" class="palette-cue">⌘K</button> anywhere to jump between pages, search, or play a release. The theme follows your system and can be toggled. Every screen targets WCAG AA contrast, honours reduced-motion, and sets no cookies and no analytics.',
        pt: 'Feito para o teclado — prima <button type="button" class="palette-cue">⌘K</button> em qualquer lado para saltar entre páginas, pesquisar ou reproduzir uma edição. O tema segue o do seu sistema e pode ser alternado. Todos os ecrãs cumprem o contraste WCAG AA, respeitam o movimento reduzido e não usam cookies nem estatísticas.',
      },
    },
    {
      heading: { en: 'Kept honest', pt: 'Posto à prova' },
      body: {
        en: 'The interface is covered by unit, end-to-end, and visual-regression tests that run on every change, so a stray style or a broken link fails the build instead of the page. Even the controls you can barely see are checked for contrast.',
        pt: 'A interface está coberta por testes unitários, ponta a ponta e de regressão visual que correm a cada alteração, para que um estilo desgarrado ou uma ligação partida falhe na compilação e não na página. Até os controlos que mal se vêem são verificados quanto ao contraste.',
      },
    },
    {
      heading: { en: 'Contact, privately', pt: 'Contacto, em privado' },
      body: {
        en: 'The contact form runs on a Cloudflare Worker with spam protection and no third-party trackers. The <a href="/privacy">privacy page</a> has the details.',
        pt: 'O formulário de contacto corre num Cloudflare Worker com protecção contra spam e sem rastreadores de terceiros. A <a href="/privacy">página de privacidade</a> tem os pormenores.',
      },
    },
  ],
  source: {
    en: 'The whole thing is open source — read it on <a href="https://github.com/jeromefaria/jeromefaria.github.io">GitHub</a>.',
    pt: 'Tudo isto é de código aberto — pode lê-lo no <a href="https://github.com/jeromefaria/jeromefaria.github.io">GitHub</a>.',
  },
};
