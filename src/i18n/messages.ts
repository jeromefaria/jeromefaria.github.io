import type { RouteMeta } from 'vue-router';

export const SUPPORTED_LOCALES = ['en', 'pt'] as const;

export type Locale = (typeof SUPPORTED_LOCALES)[number];

export const DEFAULT_LOCALE: Locale = 'en';

export const localeFromMeta = (meta: RouteMeta): Locale =>
  SUPPORTED_LOCALES.includes(meta['locale'] as Locale) ? (meta['locale'] as Locale) : DEFAULT_LOCALE;

export const localePath = (path: string, locale: Locale): string => {
  if (locale === DEFAULT_LOCALE) return path;
  return path === '/' ? '/pt' : `/pt${path}`;
};

const en = {
  nav: {
    about: 'About',
    works: 'Works',
    live: 'Live',
    press: 'Press',
    contact: 'Contact',
  },
  footer: {
    privacy: 'Privacy',
    colophon: 'Colophon',
  },
  common: {
    switchLanguage: 'Português',
  },
  media: {
    gallery: 'Gallery',
    photo: 'Photo',
    photos: 'Photos',
    poster: 'Poster',
    posters: 'Posters',
    video: 'Video',
    videos: 'Videos',
    download: 'Download',
    view: 'View {label}',
    downloadAria: 'Download this release from Bandcamp (opens in a new tab)',
  },
  keyboardHelp: {
    title: 'Keyboard shortcuts',
    openPalette: 'Open the command palette',
    moveSelection: 'Move selection',
    moveSelectionVim: 'Move selection (Vim / fzf)',
    jumpHalfPage: 'Jump half a page',
    openCommand: 'Open the selected command',
    openNewTab: 'Open in a new tab',
    close: 'Close',
    showHelp: 'Show this help',
  },
  contact: {
    inquiryLabel: 'Inquiry type',
    inquiryPlaceholder: 'Select one…',
    name: 'Name',
    email: 'Email',
    message: 'Message',
    submit: 'Send Message',
    sending: 'Sending...',
    turnstileNotice: 'Protected by Cloudflare Turnstile',
    requiredError: '{field} is required',
    verifyError: 'Could not verify you are human. Please try again.',
    submitError: 'Something went wrong sending your message. Please try again.',
    success: {
      title: 'Message Sent',
      text: 'Thank you for your message. I will respond as soon as possible.',
    },
    types: {
      booking: { label: 'Booking', blurb: 'For festivals, venues, and performance opportunities.' },
      commission: { label: 'Commission', blurb: 'For film scores, theatre, installations, and original compositions.' },
      licensing: { label: 'Licensing', blurb: 'To license an existing track for film, media, or release.' },
      mastering: { label: 'Mixing & Mastering', blurb: 'For mixing and mastering your release.' },
      other: { label: 'Other', blurb: 'Press, questions, or anything else.' },
    },
    fields: {
      eventVenue: { label: 'Event or venue', placeholder: 'Festival, venue, or promoter' },
      preferredDate: { label: 'Preferred date or timeframe', placeholder: 'e.g. May 2027, or flexible' },
      location: { label: 'Location', placeholder: 'City, country' },
      projectType: { label: 'Project type', placeholder: 'Film, theatre, installation…' },
      commissionTimeline: { label: 'Timeline or deadline', placeholder: 'e.g. delivery by Q1 2027' },
      track: { label: 'Track or release', placeholder: 'Which work to license' },
      intendedUse: { label: 'Intended use', placeholder: 'Film, advertising, game, compilation…' },
      territory: { label: 'Territory & term', placeholder: 'e.g. worldwide, 2 years' },
      project: { label: 'Project or release title', placeholder: 'The release to master' },
      tracksFormat: { label: 'Tracks & format', placeholder: 'e.g. 8 tracks, digital + vinyl' },
      masteringTimeline: { label: 'Timeline', placeholder: 'e.g. masters needed by June' },
      generalSubject: { label: 'Subject', placeholder: 'What is this about?' },
    },
  },
};

const pt: typeof en = {
  nav: {
    about: 'Sobre',
    works: 'Obras',
    live: 'Concertos',
    press: 'Imprensa',
    contact: 'Contacto',
  },
  footer: {
    privacy: 'Privacidade',
    colophon: 'Colophon',
  },
  common: {
    switchLanguage: 'English',
  },
  media: {
    gallery: 'Galeria',
    photo: 'Foto',
    photos: 'Fotos',
    poster: 'Cartaz',
    posters: 'Cartazes',
    video: 'Vídeo',
    videos: 'Vídeos',
    download: 'Descarregar',
    view: 'Ver {label}',
    downloadAria: 'Descarregar esta edição do Bandcamp (abre num novo separador)',
  },
  keyboardHelp: {
    title: 'Atalhos de teclado',
    openPalette: 'Abrir a paleta de comandos',
    moveSelection: 'Mover a selecção',
    moveSelectionVim: 'Mover a selecção (Vim / fzf)',
    jumpHalfPage: 'Saltar meia página',
    openCommand: 'Abrir o comando seleccionado',
    openNewTab: 'Abrir num novo separador',
    close: 'Fechar',
    showHelp: 'Mostrar esta ajuda',
  },
  contact: {
    inquiryLabel: 'Tipo de pedido',
    inquiryPlaceholder: 'Seleccione uma opção…',
    name: 'Nome',
    email: 'Email',
    message: 'Mensagem',
    submit: 'Enviar mensagem',
    sending: 'A enviar...',
    turnstileNotice: 'Protegido por Cloudflare Turnstile',
    requiredError: 'Este campo é obrigatório',
    verifyError: 'Não foi possível confirmar a verificação. Tente novamente.',
    submitError: 'Ocorreu um erro ao enviar a mensagem. Tente novamente.',
    success: {
      title: 'Mensagem enviada',
      text: 'Obrigado pela mensagem. Responderei assim que possível.',
    },
    types: {
      booking: { label: 'Actuações', blurb: 'Para festivais, salas e oportunidades de actuação.' },
      commission: { label: 'Encomenda', blurb: 'Para bandas sonoras, teatro, instalações e composições originais.' },
      licensing: { label: 'Licenciamento', blurb: 'Para licenciar uma faixa existente para cinema, media ou edição.' },
      mastering: { label: 'Mistura & Masterização', blurb: 'Para mistura e masterização de edições.' },
      other: { label: 'Outro', blurb: 'Imprensa, questões ou qualquer outro assunto.' },
    },
    fields: {
      eventVenue: { label: 'Evento ou sala', placeholder: 'Festival, sala ou promotor' },
      preferredDate: { label: 'Data ou período preferido', placeholder: 'ex.: Maio de 2027, ou flexível' },
      location: { label: 'Localização', placeholder: 'Cidade, país' },
      projectType: { label: 'Tipo de projecto', placeholder: 'Cinema, teatro, instalação…' },
      commissionTimeline: { label: 'Prazo', placeholder: 'ex.: entrega até ao 1.º trimestre de 2027' },
      track: { label: 'Faixa ou edição', placeholder: 'Que obra licenciar' },
      intendedUse: { label: 'Utilização pretendida', placeholder: 'Cinema, publicidade, jogo, colectânea…' },
      territory: { label: 'Território & período', placeholder: 'ex.: mundial, 2 anos' },
      project: { label: 'Projecto ou título da edição', placeholder: 'A edição a masterizar' },
      tracksFormat: { label: 'Faixas & formato', placeholder: 'ex.: 8 faixas, digital + vinil' },
      masteringTimeline: { label: 'Prazo', placeholder: 'ex.: masters necessários até Junho' },
      generalSubject: { label: 'Assunto', placeholder: 'De que se trata?' },
    },
  },
};

export type MessageSchema = typeof en;

export const messages: Record<Locale, MessageSchema> = { en, pt };
