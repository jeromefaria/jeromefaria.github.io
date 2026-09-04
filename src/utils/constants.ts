// eslint-disable-next-line local/no-comments -- cross-file coupling
// Keep in sync with $transition-base in _variables.scss; changing one side without the other desyncs the JS animation from the CSS.
export const TIMING = {
  NAV_ANIMATION: 300,
  ACCORDION_ANIMATION: 320,
} as const;

// eslint-disable-next-line local/no-comments -- cross-file coupling
// Keep in sync with _variables.scss; changing one side without the other desyncs the JS layout math from the CSS.
export const LAYOUT = {
  BREAKPOINT_MD: 768,
  HEADER_HEIGHT_MOBILE: 57,
  HEADER_HEIGHT_DESKTOP: 77,
  SPACING_4: 16,
} as const;

export const ID_PREFIX = {
  SECTION: 'section-',
  TRIGGER: 'trigger-',
  CONTENT: 'content-',
} as const;

export const TOUCH = {
  MIN_SWIPE_DISTANCE: 50,
  MIN_DISMISS_DISTANCE: 80,
  MAX_SWIPE_TIME: 300,
} as const;

export const TURNSTILE = {
  SCRIPT_URL: 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit&onload=onloadTurnstileCallback',
} as const;
