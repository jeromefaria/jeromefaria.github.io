import type { Localized } from '@/i18n/localized';

export interface PrivacySection {
  heading: Localized<string>;
  body: Localized<string>;
}

export interface PrivacyContent {
  intro: Localized<string>;
  sections: PrivacySection[];
  updated: Localized<string>;
}

export const privacyContent: PrivacyContent = {
  intro: {
    en: 'This site is a personal portfolio. It sets no cookies, runs no analytics, and tracks nothing about your visit. The only time it collects anything about you is when you use the contact form. The rest of this page explains, plainly, where your data can go when you interact with the site.',
    pt: 'Este site é um portefólio pessoal. Não usa cookies, não recolhe estatísticas e não regista nada sobre a sua visita. A única altura em que recolhe alguma informação sobre si é quando utiliza o formulário de contacto. O resto desta página explica, de forma clara, para onde podem ir os seus dados quando interage com o site.',
  },
  sections: [
    {
      heading: { en: 'Contact form', pt: 'Formulário de contacto' },
      body: {
        en: 'The information you enter—your name, email address, inquiry type, and message—is sent directly to me by email through <a href="https://resend.com">Resend</a>, the service that delivers it. It is not stored on this site or in any database. I use it only to reply to you, and I keep our correspondence only as long as I need to handle your inquiry.',
        pt: 'As informações que introduz — o seu nome, endereço de email, tipo de pedido e mensagem — são-me enviadas directamente por email através do <a href="https://resend.com">Resend</a>, o serviço que as entrega. Não são guardadas neste site nem em qualquer base de dados. Uso-as apenas para lhe responder e guardo a nossa correspondência só durante o tempo necessário para tratar do seu pedido.',
      },
    },
    {
      heading: { en: 'Spam protection', pt: 'Protecção contra spam' },
      body: {
        en: 'The contact form is protected by Cloudflare Turnstile, which runs invisibly to confirm you are a person rather than a bot. To do that it may read basic signals from your browser; Cloudflare states it is not used for advertising. Its use is subject to Cloudflare\'s <a href="https://www.cloudflare.com/privacypolicy/">Privacy Policy</a> and <a href="https://www.cloudflare.com/turnstile-privacy-policy/">Turnstile Privacy Addendum</a>.',
        pt: 'O formulário de contacto é protegido pelo Cloudflare Turnstile, que funciona de forma invisível para confirmar que é uma pessoa e não um bot. Para isso, pode ler sinais básicos do seu navegador; a Cloudflare afirma que não os usa para publicidade. A sua utilização está sujeita à <a href="https://www.cloudflare.com/privacypolicy/">Política de Privacidade</a> e ao <a href="https://www.cloudflare.com/turnstile-privacy-policy/">Adendo de Privacidade do Turnstile</a> da Cloudflare.',
      },
    },
    {
      heading: { en: 'Embedded players', pt: 'Leitores incorporados' },
      body: {
        en: 'Some releases and live entries embed players from <a href="https://bandcamp.com/privacy">Bandcamp</a>, <a href="https://policies.google.com/privacy">YouTube</a>, or <a href="https://vimeo.com/privacy">Vimeo</a>. Nothing from these services loads until you choose to open a player; once you do, that service receives the request and its own privacy policy applies. YouTube embeds use its privacy-enhanced no-cookie mode.',
        pt: 'Algumas edições e concertos incorporam leitores do <a href="https://bandcamp.com/privacy">Bandcamp</a>, <a href="https://policies.google.com/privacy">YouTube</a> ou <a href="https://vimeo.com/privacy">Vimeo</a>. Nada destes serviços é carregado até que decida abrir um leitor; a partir daí, esse serviço recebe o pedido e passa a aplicar-se a sua própria política de privacidade. Os leitores do YouTube usam o modo sem cookies, com privacidade reforçada.',
      },
    },
    {
      heading: { en: 'Hosting', pt: 'Alojamento' },
      body: {
        en: 'The site is served by <a href="https://docs.github.com/site-policy/privacy-policies/github-privacy-statement">GitHub Pages</a>, and the contact form, its spam check, and the audio streaming run through <a href="https://www.cloudflare.com/privacypolicy/">Cloudflare</a>. As with any web host, these providers keep standard server logs—such as your IP address—to deliver the site and protect it from abuse. I have no separate access to that data.',
        pt: 'O site é alojado pelo <a href="https://docs.github.com/site-policy/privacy-policies/github-privacy-statement">GitHub Pages</a> e o formulário de contacto, a sua verificação de spam e a transmissão de áudio funcionam através da <a href="https://www.cloudflare.com/privacypolicy/">Cloudflare</a>. Como qualquer serviço de alojamento web, estes fornecedores mantêm registos de servidor habituais — como o seu endereço IP — para disponibilizar o site e protegê-lo de utilização abusiva. Não tenho acesso separado a esses dados.',
      },
    },
    {
      heading: { en: 'Your preferences', pt: 'As suas preferências' },
      body: {
        en: 'Your theme choice, whether the audio player is on, and your recent <button type="button" class="palette-cue">command palette</button> searches are saved in your browser\'s local storage. They stay on your device, are never sent anywhere, and clearing your browser data removes them.',
        pt: 'A sua escolha de tema, se o leitor de áudio está activo e as suas pesquisas recentes na <button type="button" class="palette-cue">paleta de comandos</button> são guardadas no armazenamento local do seu navegador. Ficam no seu dispositivo, nunca são enviadas para lado nenhum, e limpar os dados do navegador remove-as.',
      },
    },
    {
      heading: { en: 'Your data and rights', pt: 'Os seus dados e direitos' },
      body: {
        en: 'For anything you send me, I am the data controller. You can ask me to see, correct, or delete what you have shared at any time—just <a href="/contact">get in touch</a>. If you are in the EU, you also have the right to lodge a complaint with your national data-protection authority.',
        pt: 'Relativamente a tudo o que me envia, sou o responsável pelo tratamento dos dados. Pode pedir-me para consultar, corrigir ou apagar o que partilhou, a qualquer momento — basta <a href="/contact">entrar em contacto</a>. Se estiver na UE, tem também o direito de apresentar uma reclamação junto da autoridade nacional de protecção de dados.',
      },
    },
  ],
  updated: { en: 'August 2026', pt: 'Agosto de 2026' },
};
