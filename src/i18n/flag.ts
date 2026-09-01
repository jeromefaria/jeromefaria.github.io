// Build-time i18n toggle, shared by the runtime consumers (router, usePageHead,
// SiteFooter). main.ts deliberately does NOT use this: its dynamic import('./i18n')
// gate is only dead-code-eliminated — dropping vue-i18n from the flag-off bundle —
// when the `VITE_I18N === 'true'` comparison is folded inline at the `if` site.
// An imported const defeats that DCE (empirically verified), so main.ts keeps the
// literal check inline.
export const i18nEnabled = import.meta.env.VITE_I18N === 'true';
