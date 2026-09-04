import type { WorksSection } from '@/types/works';

export const film: WorksSection = {
  title: { en: 'Scores', pt: 'Composições' },
  id: 'film',
  items: [
    {
      id: 'aragao',
      title: 'ARAGÃO',
      coverImage: '/images/aragao.jpg',
      meta: {
        kind: 'commission',
        work: 'Theatre',
        venue: { text: 'Teatro Municipal Baltazar Dias', url: 'https://teatrobaltazardias.funchal.pt/' },
        year: 2021,
      },
      description: {
        en: 'Theatre production celebrating the centenary of <a href="https://pt.wikipedia.org/wiki/Ant%C3%B3nio_Arag%C3%A3o">António Aragão</a>, a founder of Experimental Poetry in Portugal. Conceived as a performative-sonic-visual event.',
        pt: 'Produção teatral que celebra o centenário de <a href="https://pt.wikipedia.org/wiki/Ant%C3%B3nio_Arag%C3%A3o">António Aragão</a>, um dos fundadores da Poesia Experimental Portuguesa. Concebida como um evento performativo, sonoro e visual.',
      },
      credits: {
        style: 'colon',
        clauses: [
          { role: 'direction', of: 'Sara Gonçalves' },
          { role: 'text', of: '[[Rui Zink]]' },
          { role: 'setDesign', of: '[[José Manuel Castanheira]]' },
          { role: 'video', of: 'Filipe Ferraz' },
          { role: 'musicAndLiveInterpretation', of: 'Jerome Faria' },
        ],
      },
      contributors: [
        { name: 'Rui Zink', url: 'https://pt.wikipedia.org/wiki/Rui_Zink' },
        { name: 'José Manuel Castanheira', url: 'https://pt.wikipedia.org/wiki/Jos%C3%A9_Manuel_Castanheira' },
      ],
      videos: [
        {
          url: 'https://www.youtube-nocookie.com/embed/6LpRJBS7pzg',
          platform: 'youtube',
          title: { en: 'Aragão at Teatro Municipal Baltazar Dias, Funchal, 2021', pt: 'Aragão no Teatro Municipal Baltazar Dias, Funchal, 2021' },
          author: { name: 'TRANSLOCAL Culturas Contemporâneas Locais e Urbanas', url: 'https://www.youtube.com/@translocalculturascontempo3938' },
        },
      ],
    },
    {
      id: 'invisible-other',
      title: 'Invisible Other',
      coverImage: '/images/invisible-other.jpg',
      meta: {
        kind: 'commission',
        work: 'Film',
        director: { text: 'Margarida Paiva', url: 'https://margaridapaiva.net/' },
        year: 2016,
      },
      description: {
        en: 'Original score for film by Portuguese-Norwegian visual artist Margarida Paiva. The film depicts a park as a closed world where anonymous characters drift past one another, bound only by gestures and glances.',
        pt: 'Banda sonora original para o filme da artista visual luso-norueguesa Margarida Paiva. O filme retrata um parque como um mundo fechado onde personagens anónimas deslizam umas pelas outras, ligadas apenas por gestos e olhares.',
      },
      credits: {
        style: 'colon',
        clauses: [
          { role: 'producer', of: 'Rune Sandnes' },
          { role: 'cinematography', of: '[[Diogo Castro]]' },
          { role: 'music', of: 'Jerome Faria' },
          { role: 'soundDesign', of: '[[Duarte Ferreira]]' },
          { role: 'soundEditor', of: '[[Pedro Anacleto]]' },
          { role: 'editing', of: 'Margarida Paiva' },
          { role: 'cast', of: '[[Susana Chiocca]], Alexandre Osório, Helena Carneiro, [[João Pamplona]], [[Susana Madeira]], Mariana L. Ferreira' },
          { role: 'shot', of: '[[Jardim Botânico do Porto]]', connector: 'at' },
        ],
      },
      contributors: [
        { name: 'Diogo Castro', url: 'https://www.instagram.com/diogocastrofilm/' },
        { name: 'Duarte Ferreira', url: 'https://www.linkedin.com/in/dvarte/' },
        { name: 'Pedro Anacleto', url: 'https://www.instagram.com/ochocobogordo/' },
        { name: 'Susana Chiocca', url: 'https://chiocca.wixsite.com/susanachiocca' },
        { name: 'João Pamplona', url: 'https://agenteanorte.com/en/atores-exclusivos/joao-pamplona/' },
        { name: 'Susana Madeira', url: 'https://agenteanorte.com/en/atores-exclusivos/susana-madeira/' },
        { name: 'Jardim Botânico do Porto', url: 'https://mhnc.up.pt/pt/jardim-botanico-da-universidade-do-porto/' },
      ],
    },
    {
      id: 'caligari',
      title: 'The Cabinet of Dr. Caligari',
      coverImage: '/images/caligari-live.jpg',
      meta: {
        kind: 'commission',
        work: 'Live Score',
        year: 2013,
      },
      description: {
        en: 'Live score for <a href="https://en.wikipedia.org/wiki/Robert_Wiene">Robert Wiene</a>\'s 1920 expressionist silent film. Working against Wiene\'s angular expressionist nightmare, the score creates a dialogue spanning a century of sonic possibility—honouring the film\'s unease while exploring territories the original could never have envisioned.',
        pt: 'Banda sonora ao vivo para o filme mudo expressionista de <a href="https://en.wikipedia.org/wiki/Robert_Wiene">Robert Wiene</a> (1920). Ao trabalhar contra o pesadelo expressionista e angular de Wiene, a peça cria um diálogo que percorre um século de possibilidades sonoras e honra a inquietação do filme enquanto explora territórios que o original nunca poderia ter vislumbrado.',
      },
      credits: {
        style: 'by',
        clauses: [
          { role: 'music', of: 'Jerome Faria' },
          { role: 'performed', of: 'Jerome Faria and [[Nuno Filipe]]' },
        ],
      },
      contributors: [
        { name: 'Nuno Filipe', url: 'https://nunoandtheend.bandcamp.com/' },
      ],
    },
    {
      id: 'hyphema',
      title: 'Hyphema',
      coverImage: '/images/hyphema.jpg',
      meta: {
        kind: 'commission',
        work: 'DVD',
        publisher: { label: { text: 'Pixelnerve' }, catalog: 'PXN001' },
        year: 2008,
      },
      description: {
        en: 'A collaborative effort between sound artist Jerome Faria and programmer <a href="https://pixelnerve.com/">Victor Martins</a>, documenting experiments in audiovisual composition. The project was presented both as a live performance and as this DVD release.',
        pt: 'Uma colaboração entre o artista sonoro Jerome Faria e o programador <a href="https://pixelnerve.com/">Victor Martins</a>, que documenta experiências de composição audiovisual. O projecto foi apresentado tanto ao vivo como nesta edição em DVD.',
      },
      tracklist: [
        { title: '0x00' },
        { title: '0x01' },
        { title: '0x02' },
        { title: '0x03' },
        { title: '0x04' },
        { title: '0xFF' },
      ],
      credits: {
        style: 'by',
        clauses: [
          { role: 'music', of: 'Jerome Faria' },
          { role: 'visuals', of: '[[Victor Martins]]' },
          { role: 'artwork', of: '[[Frederico Cunha]]' },
        ],
      },
      contributors: [
        { name: 'Victor Martins', url: 'https://pixelnerve.com/' },
        { name: 'Frederico Cunha', url: 'https://fredericodiz.wixsite.com' },
      ],
    },
  ],
};
