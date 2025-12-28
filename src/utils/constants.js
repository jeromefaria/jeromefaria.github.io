// Animation timing constants (in milliseconds)
// Keep in sync with $transition-base in _variables.scss (300ms)
export const TIMING = {
  NAV_ANIMATION: 300,
  ACCORDION_ANIMATION: 320,
};

// Layout constants (in pixels)
// Keep in sync with _variables.scss
export const LAYOUT = {
  BREAKPOINT_MD: 768,           // $breakpoint-md
  HEADER_HEIGHT_MOBILE: 57,     // $header-height-mobile
  HEADER_HEIGHT_DESKTOP: 77,    // $header-height-desktop
  SPACING_4: 16,                // $spacing-4
};

// ID prefixes used for accordion sections
export const ID_PREFIX = {
  SECTION: 'section-',
  TRIGGER: 'trigger-',
  CONTENT: 'content-',
};

// Touch/swipe interaction constants
export const TOUCH = {
  MIN_SWIPE_DISTANCE: 50,   // Minimum distance in pixels for a valid swipe
  MAX_SWIPE_TIME: 300,      // Maximum time in milliseconds for a swipe gesture
};

// FormSubmit.co hidden field names
export const FORM_SUBMIT = {
  SUBJECT: '_subject',
  CAPTCHA: '_captcha',
  HONEYPOT: '_honey',
  REPLY_TO: '_replyto',
};
