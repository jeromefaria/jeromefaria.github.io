import type { Localized } from '@/i18n/localized';

export interface CopyrightContent {
  paragraphs: Localized<string>[];
}

export const copyrightContent: CopyrightContent = {
  paragraphs: [
    {
      en: 'Everything on this site is © 2004–{year} Jerome Faria — all rights reserved, and may not be reused, redistributed, or adapted without written permission. Anything credited to someone else remains the property of its author, or, where noted, is in the public domain.',
      pt: 'Tudo neste site é © 2004–{year} Jerome Faria — todos os direitos reservados; não pode ser reutilizado, redistribuído ou adaptado sem autorização por escrito. Tudo o que é creditado a terceiros permanece propriedade do respectivo autor ou, quando indicado, é de domínio público.',
    },
    {
      en: 'If anything appears here uncredited or credited in error, please <a href="/contact">get in touch</a> — I\'ll put it right.',
      pt: 'Se algo aqui surgir sem crédito ou creditado incorrectamente, <a href="/contact">entre em contacto</a> — corrijo-o de imediato.',
    },
    {
      en: 'The source code that runs this site is open-source under the MIT License, on <a href="https://github.com/jeromefaria/jeromefaria.github.io">GitHub</a>.',
      pt: 'O código-fonte deste site é de código aberto, sob a licença MIT, no <a href="https://github.com/jeromefaria/jeromefaria.github.io">GitHub</a>.',
    },
  ],
};
