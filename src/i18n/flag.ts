// eslint-disable-next-line local/no-comments -- irreducible build constraint
// Do NOT route main.ts through this const: its import() gate is only dead-code-eliminated (dropping vue-i18n) when the VITE_I18N literal is folded inline, and an imported const defeats that DCE.
export const i18nEnabled = import.meta.env.VITE_I18N === 'true';
