// Keep in sync with $transition-base in _variables.scss (300ms)
export const TIMING = {
  NAV_ANIMATION: 300,
  ACCORDION_ANIMATION: 320,
} as const;

// Keep in sync with _variables.scss
export const LAYOUT = {
  BREAKPOINT_MD: 768,           // $breakpoint-md
  HEADER_HEIGHT_MOBILE: 57,     // $header-height-mobile
  HEADER_HEIGHT_DESKTOP: 77,    // $header-height-desktop
  SPACING_4: 16,                // $spacing-4
} as const;

export const ID_PREFIX = {
  SECTION: 'section-',
  TRIGGER: 'trigger-',
  CONTENT: 'content-',
} as const;

export const TOUCH = {
  MIN_SWIPE_DISTANCE: 50,
  MAX_SWIPE_TIME: 300,
} as const;

export const TURNSTILE = {
  ONLOAD_CALLBACK: 'onloadTurnstileCallback',
  SCRIPT_URL: 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit&onload=onloadTurnstileCallback',
} as const;
