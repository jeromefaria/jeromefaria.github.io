import type { RouteMeta } from 'vue-router';

export const SUPPORTED_LOCALES = ['en', 'pt'] as const;

export type Locale = (typeof SUPPORTED_LOCALES)[number];

export const DEFAULT_LOCALE: Locale = 'en';

export const BCP47_LOCALE: Record<Locale, string> = { en: 'en-US', pt: 'pt-PT' };

export const localeFromMeta = (meta: RouteMeta): Locale =>
  SUPPORTED_LOCALES.includes(meta['locale'] as Locale) ? (meta['locale'] as Locale) : DEFAULT_LOCALE;

export const localePath = (path: string, locale: Locale): string => {
  if (locale === DEFAULT_LOCALE) return path;
  return path === '/' ? '/pt' : `/pt${path}`;
};

export const stripLocale = (path: string): string =>
  path === '/pt' || path.startsWith('/pt/') ? path.slice(3) || '/' : path;

export const localizeInternalLinks = (html: string, locale: Locale): string => {
  if (locale === DEFAULT_LOCALE) return html;
  return html.replace(/href="(\/[^/"][^"]*)"/g, (_match, path: string) => `href="${localePath(path, locale)}"`);
};

const en = {
  nav: {
    about: 'About',
    works: 'Works',
    live: 'Live',
    press: 'Press',
    contact: 'Contact',
    mainLabel: 'Main navigation',
    footerLabel: 'Footer navigation',
    toggleMenu: 'Toggle menu',
  },
  footer: {
    privacy: 'Privacy',
    colophon: 'Colophon',
  },
  privacy: {
    lastUpdated: 'Last updated {date}.',
  },
  epk: {
    shortBio: 'Short bio',
    download: 'Download',
    fullKit: 'Full press kit (ZIP)',
    oneSheet: 'One-sheet (PDF)',
    rider: 'Technical rider (PDF)',
    biography: 'Biography',
    photography: 'Photography',
    photo: 'Photo',
    selectedPerformances: 'Selected performances',
    selectedWorks: 'Selected works',
    press: 'Selected press',
  },
  common: {
    switchLanguage: 'PT',
    switchLanguageLabel: 'Switch to Portuguese (PT)',
    newTabCue: '(opens in a new tab)',
    externalSiteAria: '{name} website (opens in a new tab)',
    skipToMain: 'Skip to main content',
    loadingPage: 'Loading page',
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
    photoBy: 'Photo by',
    posterBy: 'Poster by',
    videoBy: 'Video by',
  },
  player: {
    label: 'Audio player',
    expand: 'Expand player',
    collapse: 'Collapse player',
    close: 'Close player',
    nowPlaying: 'Now playing',
    queue: 'Queue',
    previous: 'Previous track',
    next: 'Next track',
    play: 'Play',
    pause: 'Pause',
    playTitle: 'Play {title}',
    pauseTitle: 'Pause {title}',
    seek: 'Seek within {title}',
    seekGeneric: 'Seek',
    loading: 'Loading player',
    loadingShort: 'Loading...',
    statusPlaying: 'Playing: {title}',
    statusLoading: 'Loading: {title}',
    statusPaused: 'Paused: {title}',
    bandcampTitle: '{title} — Bandcamp player',
  },
  lightbox: {
    imageLabel: 'Image {index} of {total}',
    videoLabel: 'Video {index} of {total}',
    imageViewer: 'Image viewer',
    videoViewer: 'Video viewer',
    previous: 'Previous image',
    close: 'Close lightbox',
    next: 'Next item',
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
  palette: {
    ariaLabel: 'Command palette',
    searchLabel: 'Search, navigate, or run a command',
    empty: 'No matches',
    result: 'result',
    results: 'results',
    hint: { navigate: 'navigate', open: 'open', close: 'close' },
    groups: {
      Navigate: 'Navigate',
      Works: 'Works',
      Live: 'Live',
      Press: 'Press',
      Actions: 'Actions',
      'Now Playing': 'Now Playing',
      Recent: 'Recent',
    },
    home: 'Home',
    pressKit: 'Press Kit',
    worksSection: 'Works — {title}',
    downloadKitPdf: 'Download press kit (PDF)',
    downloadRiderPdf: 'Download technical rider (PDF)',
    downloadKitZip: 'Download press kit (ZIP)',
    toggleTheme: 'Toggle theme',
    matchSystemTheme: 'Match system theme',
    copyEmail: 'Copy contact email',
    clearRecents: 'Clear recents',
    openSocial: 'Open {name}',
    openOnPlatform: 'Open \'{title}\' on {platform}',
    playRelease: 'Play \'{title}\'',
    play: 'Play',
    pause: 'Pause',
    nextTrack: 'Next track',
    previousTrack: 'Previous track',
    expandPlayer: 'Expand player',
    collapsePlayer: 'Collapse player',
    stopPlayback: 'Stop playback',
    kw: {
      home: 'start index',
      worksSection: 'works',
      works: 'discography releases music albums',
      live: 'shows concerts performances gigs',
      press: 'quotes reviews reception',
      about: 'bio biography',
      contact: 'email message reach booking',
      privacy: 'policy data',
      colophon: 'tech stack built source code',
      pressQuote: 'press review quote',
      pressKit: 'epk downloads photos',
      shortcuts: 'help keys bindings cheatsheet',
      downloadKitPdf: 'epk pdf press',
      downloadRiderPdf: 'rider tech pdf stage',
      downloadKitZip: 'epk zip photos assets',
      toggleTheme: 'dark light mode appearance colour color',
      matchSystemTheme: 'system os auto preference appearance theme',
      copyEmail: 'email clipboard contact',
      clearRecents: 'clear reset history forget',
      social: 'social link',
      releaseLink: 'listen play',
      playToggle: 'pause play resume music audio playback',
      nextTrack: 'next skip forward',
      previousTrack: 'previous back prev',
      player: 'expand collapse now playing minimise minimize',
      stopPlayback: 'stop close dismiss end',
      playRelease: 'play listen audio music',
    },
  },
};

export type MessageSchema = typeof en;

// Only the English catalog is eager. The Portuguese catalog lives in messagesPt.ts
// and is loaded on demand (loadLocaleMessages) so an EN visitor never downloads it.
export const messages = { en } satisfies Partial<Record<Locale, MessageSchema>>;

export const loadLocaleMessages = async (locale: Locale): Promise<MessageSchema> => {
  if (locale === 'pt') return (await import('./messagesPt')).pt;
  return en;
};
