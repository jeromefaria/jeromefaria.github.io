# Styles

Modular SCSS, all wired through `@use` (no legacy `@import`), enforced by **stylelint** (`npm run lint:css`). Class names follow **BEM** (`block__element--modifier`). Colours are CSS custom properties (themeable); everything else is a Sass token or mixin from `_variables.scss`.

## Files

`main.scss` imports the layers in cascade order:

| Partial | Holds |
|---|---|
| `_variables` | design tokens + mixins (forwarded via `@use "variables" as *`) |
| `_fonts` | `@font-face` (self-hosted, subset Inter) |
| `_base` | resets + **colour custom properties** (light + dark) |
| `_type` | typography |
| `_layout` | footer, containers |
| `_masthead` | header / nav |
| `_release` · `_social-links` · `_pagination` · `_contact` · `_lightbox` · `_accordion` | one component each (split from the old `_components` grab-bag) |
| `_overlays` | command palette, keyboard help, scrims |
| `_player` | audio player bar + expanded screen |
| `_pages` | per-page styles (home, about, press, live, privacy, not-found) |
| `_epk` · `_utilities` · `_transitions` | press kit · helpers/skip-link · shared transitions |

## Colour tokens (custom properties)

Defined on `:root` (light) and overridden under `[data-theme="dark"]` in `_base.scss`. Always reference these — never hard-code a colour (stylelint has the one stray literal on notice).

`--color-bg` · `--color-text` · `--color-text-secondary` · `--color-text-muted` · `--color-border` · `--color-border-subtle` · `--color-link` · `--color-link-hover` · `--color-error` · `--overlay-lightbox` · `--text-overlay-muted` · `--overlay-panel-shadow`

Muted/link-hover values are annotated with their WCAG contrast ratios — keep them AA-compliant on both themes when editing.

## Sass tokens (`_variables.scss`)

**Type** — `$font-sans`, `$font-mono`; sizes `$font-size-xs` (0.6875rem) → `$font-size-2xl` (1.375rem); line-heights `$line-height-snug` (1.4) → `$line-height-prose` (1.8); `$letter-spacing-wide` (0.05em), `$letter-spacing-wider` (0.12em); weights `$font-weight-normal/medium/semibold`.

**Spacing** — a rem scale keyed to a 0.25rem base: `$spacing-1` (0.25rem) → `$spacing-20` (5rem). Prefer these over literal rems.

**Layout** — `$max-width` (33rem, prose) · `$max-width-wide` (72rem) · `$header-height-mobile/desktop` · `$footer-height` (measured — update if footer structure changes) · `$touch-target-min` (2.75rem, WCAG target size).

**Breakpoints** — `$breakpoint-sm` 480 · `-md` 768 · `-lg` 1024 · `-xl` 1280. Use the `respond-to()` mixin, never a raw media query:

```scss
@include respond-to(md) { … }
```

**z-index layers** — the global stacking order, named so overlays slot in without a war. Local, within-component stacking keeps small literal values.

| Token | Value | Layer |
|---|---|---|
| `$z-masthead` | 100 | sticky header |
| `$z-player` | 900 | docked player bar |
| `$z-player-expanded` | 950 | expanded player screen |
| `$z-skip-link` | 1000 | skip-to-content link |
| `$z-overlay` | 10000 | palette · keyboard help · lightbox (full-screen modals) |

**Timing** — `$transition-fast` (120ms) · `$transition-base` (300ms). **Opacity** — `$opacity-20` → `$opacity-90`. **Scrims** — `$overlay-dark`, `$overlay-scrim`.

## Mixins (`_variables.scss`)

Layout/responsive: `respond-to()`, `safe-area-padding()`, `absolute-fill`, `scroll-margin-header`.
Interaction/a11y: `focus-ring()`, `focus-outline-subtle`, `hover-text`, `subtle-link-hover`, `link-underline`.
Components: `label-style`, `form-input-base`, `kbd-key`, `play-triangle()` / `play-triangle-centered()`, `image-reveal`, `loading-dot`.

## Conventions

- **BEM** class names; enforced by stylelint's `selector-class-pattern`.
- **`@use` only** — no `@import`, no legacy `/` math.
- Reference **tokens**, not literals — colours as custom properties, everything else as `$…` Sass tokens.
- Blank lines as visual punctuation between concepts (enforced by stylelint's `*-empty-line-before` rules).
- Run `npm run lint:css` (bundled into `npm run lint`, gated in CI, and in the pre-commit hook).
