# Jerome Faria — Personal Website

[![CI/CD](https://github.com/jeromefaria/jeromefaria.github.io/actions/workflows/deploy.yml/badge.svg?branch=master)](https://github.com/jeromefaria/jeromefaria.github.io/actions/workflows/deploy.yml)
[![codecov](https://codecov.io/gh/jeromefaria/jeromefaria.github.io/branch/master/graph/badge.svg)](https://codecov.io/gh/jeromefaria/jeromefaria.github.io)

**My portfolio site as a composer and sound artist — and a public engineering showcase I own end to end.** A production-grade **Vue 3 + TypeScript** frontend ([www.jeromefaria.com](https://www.jeromefaria.com)): discography with a **built-in streaming audio player**, live history, press, and a downloadable press kit — statically generated and hydrated, built to professional standards (strict typing, CI-gated accessibility, performance budgets, unit + cross-browser E2E + visual-regression tests), from a from-scratch audio engine down to the serverless backend behind the contact form.

> The sections below lead with *what the project demonstrates* and *why it's built this way*; the run-book follows.

## What this demonstrates

- **Modern Vue 3 + strict TypeScript.** Composition API with `<script setup>`, a focused composable layer (accordion + hash routing, image loading, page head/schema, the audio player), and content modelled as typed data with discriminated unions.
- **A from-scratch audio player.** A singleton state machine over one `HTMLAudioElement` — cover-as-play, per-track and *chaptered* (a single file presented as timed movements) playback, a docked bar that expands to a now-playing view, **Media Session** lock-screen integration (metadata, artwork, media-key handlers), a generation-token guard against the classic media race, and best-effort autoplay that degrades to *cued-and-paused* when the browser blocks it. Audio is AAC streamed from **Cloudflare R2** over HTTP range requests.
- **Shareable, rich-preview deep-links.** Every release is pre-rendered at `/works/:id` with album-specific Open Graph (`music.album`, cover art, canonical) and *plays on open*; `?track=` / `?t=` refine the starting point, and release and track titles are right-click-copyable permalinks.
- **Accessibility as a first-class concern.** WCAG 2.1 AA gated by `axe-core` in CI — plus keyboard and focus management (focus-trapped lightbox, skip link, hash-routed accordion), `prefers-reduced-motion`, per-link "opens in a new tab" cues, and a light/dark theme that keeps its contrast ratios.
- **Performance engineering.** SSG pre-render + hydrate, Lighthouse budgets (desktop + mobile) enforced in CI, responsive `<picture>`/WebP srcsets with intrinsic dimensions, subsetted self-hosted fonts, and a zero-CLS first paint verified across every route.
- **Testing rigor.** ~99% coverage behind a **ratcheting floor**, cross-browser E2E on three engines (Chromium, Firefox, WebKit), and per-route **visual-regression** snapshots.
- **Component & styling architecture.** Single-responsibility components, reusable composables, and SCSS design tokens driving a themable, BEM-structured stylesheet.
- **A bilingual layer (EN/PT), now live.** Content typed as `Localized<{ en; pt }>`, every route mirrored under `/pt`, and a lightweight `useT` translate layer backed by vue-i18n. A single build flag (`VITE_I18N`) gates the whole i18n path — vue-i18n included — so an English-only build **tree-shakes it out entirely**; built and tested complete, held through EU-PT review, and now flipped on to ship both languages.
- **A hidden ⌘K command palette.** Keyboard-summoned search, navigation, and actions across the whole site — a typed command registry, a hand-rolled fuzzy ranker, a full combobox/listbox ARIA contract, and fzf-style keybindings. No visible affordance; it's an easter egg for those who reach for `⌘K` / `Ctrl+K`.
- **Full-stack when it's warranted.** Even the contact form is a real backend I own — a **Cloudflare Worker** doing server-side Turnstile verification + Resend, not a form-SaaS embed.

## Architecture

Two independent deploy targets from one repository: the **static site** (GitHub Pages) and the **contact Worker** (Cloudflare).

```text
Repository
  • Typed content        src/data/*.ts
  • Views + composables  Vue 3 / TS (strict)
  • Contact Worker       worker/src

Build (static)
  data + views  ──▶  Vite-SSG (pre-render + hydrate)   ──▶  GitHub Pages
                     · every route + one page per release (/works/:id, rich OG)
  data          ──▶  Headless-Chromium PDF generation  ──▶  GitHub Pages

Audio (runtime)
  Player (HTMLAudioElement)
        │  HTTP range GET
        ▼
  Cloudflare R2  ──▶  AAC (.m4a) stream

Contact (runtime)
  Contact form (invisible Turnstile)
        │  POST
        ▼
  Cloudflare Worker  ──▶  Turnstile siteverify
        │
        └──▶  Resend  ──▶  email

  GitHub Pages serves the contact form.
```

- **Site:** no CMS, API, or database — static data is pre-rendered to every route (and to a shareable page per release) and hydrated on GitHub Pages.
- **Audio:** encoded to AAC ahead of time and served from Cloudflare R2; the player streams it over HTTP range requests, so nothing large ships in the bundle.
- **Contact:** the frontend posts already-labelled fields to the Worker, which verifies the Turnstile token server-side and relays the message through Resend — decoupled from the app.

## Key decisions & trade-offs

- **SSG, not SPA or SSR.** Pre-rendering gives fast first paint, clean SEO, and free static hosting; hydration restores interactivity. The trade-off — no server runtime for the site — is deliberate, so the one genuinely dynamic need, the contact form, became a small serverless function.
- **Own the contact backend.** A Cloudflare Worker + Turnstile + Resend keeps spam handling, delivery, and data under my control rather than a form-SaaS embed. (The invisible Turnstile challenge carries a disclosure obligation — hence the `/privacy` page.)
- **A built-in player, not an embed.** Streaming the catalogue in-page — cover-as-play, lock-screen controls, deep-linkable — makes the *first listen* frictionless: a visitor clicks a release and hears music, no "open this / click there," and the experience stays on-brand rather than handed to a third-party iframe. The cost is real audio engineering (a media state machine, autoplay-policy handling, range-streamed R2 hosting), taken on deliberately.
- **A coverage *floor* that only ratchets up.** CI enforces a minimum that rises as coverage climbs (`scripts/check-coverage.js`) — regression protection without chasing 100%.
- **Typed content, no CMS.** The catalog is TypeScript with discriminated unions — a release is `music | compilation | commission | publication | mastering`, a live event has its own shape — versioned in git. The same data renders the site *and* generates the PDF press kit and technical rider that bookers and press ask for.
- **Bilingual as opt-in infrastructure.** The EN/PT layer was built and tested complete, but shipping it half-translated would have read worse than not shipping it — so it lived behind an inline build flag that tree-shakes the whole i18n path (vue-i18n included) out of an English-only bundle, which downloads nothing extra. Once the Portuguese copy cleared EU-PT review, going live was a one-line flag flip — not a rebuild-the-plumbing project.

## Audio player

The catalogue plays in-page — a built-in player, not a third-party embed. Press a release cover (or any track title) and music starts within a click; a docked player bar appears, expands to a full now-playing view, and drives the OS lock screen.

**What it does**

- **Play from anywhere** — the cover art is the play/pause control, individual tracks play from the listing, and a release opened by permalink plays on arrival.
- **Chaptered single files** — a continuous piece presented as movements (e.g. *2504*, one 25:04 file) seeks to any movement's exact offset; the current movement highlights as the playhead crosses it.
- **OS integration** — the **Media Session API** wires the lock screen and media keys with title, artist, album, and artwork, plus play / pause / next / previous / seek handlers.
- **Expand & dismiss** — tap the bar for a full now-playing view (large artwork, seek, queue); a close control stops playback and clears the bar.

**Under the hood**

- A singleton **state machine** over one `HTMLAudioElement` (`src/composables/usePlayer.ts`) with a **monotonic generation token** — a late event or retry from a track the user already skipped past is recognised as stale and ignored, the classic media race handled rather than hoped away.
- **Best-effort autoplay that degrades gracefully:** a shared link opened without a prior user gesture can't legally autoplay, so a blocked `play()` leaves the player *cued and paused* (one tap starts it) instead of churning into an error.
- Audio is **AAC (`.m4a`, faststart)** hosted on **Cloudflare R2** and streamed over **HTTP range requests**, so seeking fetches only the bytes it needs.
- A per-release-item playback layer (`src/composables/useReleasePlayback.ts`) sits on top of the player, so the release/track/chaptered logic is testable without mounting a component. Shipped behind a feature flag during rollout — `?audioPlayer=0` still opts out.

**Shareable permalinks.** Every release is pre-rendered at `/works/:id` with its own Open Graph (`music.album`, album art, canonical URL), so a shared link unfurls with the cover and plays on open. `?track=` (1-based) or `?t=` (seconds) pin the starting point — for a chaptered piece, `?t=572` opens straight into a movement — and album/track titles are anchors, so a right-click **Copy Link Address** shares the exact spot with no on-screen share button.

## Command palette

A hidden command palette — no on-screen affordance, summoned with **⌘K** (macOS) or **Ctrl+K**. It searches, navigates, and acts across the whole site from the keyboard; press **?** anywhere (outside a text field) for the shortcuts cheat-sheet.

**What it does**

- **Navigate** — every route, plus each Works section.
- **Jump to content** — any release, live date, or press quote, deep-linked to its entry (the owning accordion opens on arrival).
- **Actions** — download the press kit (PDF/ZIP) or technical rider, copy the contact email, switch the theme (light / dark / match system), open any social profile or a release on Bandcamp, or bring up the shortcuts help.

An empty query surfaces recents (persisted in `localStorage`) followed by curated navigation; typing fuzzy-ranks the whole command set by title and keywords.

| Key | Action |
| --- | --- |
| `⌘K` / `Ctrl+K` | Open / close |
| `↑` `↓` · `Ctrl+P` `Ctrl+N` · `Ctrl+K` `Ctrl+J` | Move selection (arrows, Emacs, or Vim / fzf) |
| `Ctrl+U` / `Ctrl+D` | Jump half a page |
| `↵` | Open the selected command |
| `⌘↵` / `Ctrl+↵` | Open in a new tab |
| `Esc` / `Ctrl+C` | Close |
| `?` | Show the shortcuts help |

Desktop-only and strictly additive — the site is fully usable without it. Under the hood: a typed command registry (`src/data/commands.ts`) over a discriminated `navigate | result | action` union, a hand-rolled fuzzy ranker (`src/utils/fuzzy.ts`), a full combobox/listbox ARIA contract with a live region, and shared focus-trap + scroll-lock (`useOverlay`). The palette and its help modal are lazy-loaded behind a tiny always-on hotkey layer, so none of that code ships in the main bundle.

## Internationalization (EN/PT)

A complete bilingual architecture — English and Portuguese — built end to end behind a single build flag (`VITE_I18N`). Held English-only through EU-PT review, then flipped on: the site now ships both languages, every route mirrored under `/pt`.

**How it's built**

- **Typed content, both languages.** Localizable strings are modelled as `Localized<{ en; pt }>` and resolved at render time, so the content model — not scattered template conditionals — carries the translation.
- **Locale-routed.** Every route is mirrored under `/pt` (`buildRoutes` clones the table with a `locale` meta tag); a router guard sets the active locale and internal links rewrite to stay in-locale, with a footer control to switch language on the current page.
- **Locale-correct previews.** Each `/pt` route is pre-rendered with its own `hreflang` alternates and `og:locale` (`pt_PT` / `en_GB`), so search engines pair the two language variants and a shared Portuguese link unfurls its social card in Portuguese — the same rich-preview treatment the English release pages get.
- **A lightweight translate layer.** Components call a small `useT()` (`src/i18n/useT.ts`) — dotted-key lookup with `{param}` interpolation — provided via `inject` and backed by **vue-i18n** at runtime, with a standalone fallback that keeps it SSG-safe and trivial to unit-test.
- **Zero cost when off.** The flag is an inline `import.meta.env` literal at the single `import('./i18n')` site, so with `VITE_I18N` unset the **entire i18n path — vue-i18n included — is dead-code-eliminated** from the bundle. The i18n path is opt-in at the bundle level — an English-only build carries none of it.

## Project structure

```
src/
  components/    Reusable UI components (incl. the player bar / now-playing view / playable cover)
  composables/   Reusable logic (accordion + hash routing, image loading, page head/schema, the audio player, command palette + overlays)
  data/          Typed content — works, live events, press, about, audio manifest (no CMS)
  i18n/          EN/PT messages, locale routing, and the useT translate layer
  router/        Vue Router route table
  styles/        Modular SCSS with design tokens (_variables.scss)
  types/         Shared TypeScript types (discriminated unions)
  utils/         Formatters, schema builders, adapters
  views/         One component per route
worker/          Cloudflare Worker — Turnstile verification + Resend relay
scripts/         Build tooling — PDF generation, responsive images, font subsetting, CI checks
e2e/             Playwright specs (navigation, accordion, contact, lightbox, command palette, audio player, language switch, trailing-slash, not-found, a11y, visual)
public/          Static assets
```

## Tech Stack

- **Frontend:** Vue 3 (Composition API, `<script setup>`), TypeScript (strict mode)
- **Build:** Vite with SSG (Static Site Generation) + hydration — every route plus a shareable page per release
- **i18n:** vue-i18n behind a lightweight `useT` layer; EN/PT, routed under `/pt`, flag-gated (`VITE_I18N`) and tree-shaken from the default build
- **Audio:** `HTMLAudioElement` state machine + Media Session API; AAC (`.m4a`) hosted on Cloudflare R2, streamed over HTTP range requests
- **Backend:** Cloudflare Worker (`wrangler`) — server-side Turnstile verification, Resend email relay
- **Styling:** SCSS with BEM and design tokens, lint-enforced with stylelint (BEM selector pattern)
- **Testing:** Vitest (unit — ~99% coverage across the whole `src` tree), Playwright E2E (Chromium, Firefox, WebKit), `axe-core` accessibility, per-route visual regression
- **CI/CD:** GitHub Actions — one pipeline reused as the deploy gate
- **Performance:** Lighthouse CI with performance budgets

## Development

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Type checking
npm run type-check

# Linting
npm run lint
npm run lint:fix
```

## Testing

### Unit & Integration Tests

```bash
# Run tests
npm test

# Run tests with UI
npm run test:ui

# Generate coverage report
npm run test:coverage
```

**Coverage** instruments the whole `src` tree (`all: true`), not just the files a test imports. The logic layer is ~100% covered; component and view tests assert behaviour (accordion hash-opening, link processing, focus trapping, image fallbacks) rather than render counts, with UI paths also covered by E2E. A **ratcheting floor** (`scripts/check-coverage.js`) holds the current ~99% lines / 98% statements / 97% functions / 92% branches and only moves up.

### E2E Tests

```bash
# Build, then run the E2E suite across all browsers (Chromium, Firefox, WebKit)
npm run test:e2e

# Run a single engine
npx playwright test --project=webkit

# Open the Playwright UI runner
npm run test:e2e:ui

# Open the last HTML report
npm run test:e2e:report
```

**E2E Test Coverage**:
- Navigation and routing
- Accordion functionality with hash navigation
- Command palette (⌘K) search, keybindings, and rendering
- Form validation and submission
- Lightbox open/close and keyboard navigation
- Audio player deep-link permalinks (`/works/:id?t=`) and transport controls
- Language switch (EN ↔ PT) round trip and persistence
- Trailing-slash URL normalization
- Not-found (404) page handling and SPA fallback
- Accessibility (WCAG 2.1 AA compliance, `axe-core`)
- Keyboard navigation and mobile responsiveness
- Visual regression — per-route screenshot snapshots on desktop and a mobile Safari viewport (`@visual`)

### Performance Testing

```bash
# Run Lighthouse CI (desktop profile)
npm run lighthouse

# Mobile profile (Moto G4 + slow-4G emulation)
npm run lighthouse:mobile
```

**Performance Budgets** (`.lighthouserc.json`). The **enforced** assertions fail CI:
- Accessibility ≥ 95 and Best Practices ≥ 90
- No browser-console errors
- Script ≤ 250KB and stylesheet ≤ 75KB (transfer), text compression enabled

The following are **advisory** (reported as warnings, not gating) because they vary with the CI runner or with image-rich portfolio content:
- Performance and SEO category scores
- Timing metrics: FCP < 1.5s, LCP < 2.5s, CLS < 0.1, TBT < 300ms, Speed Index < 3s
- Image and total transfer weight

A second **mobile** profile (`.lighthouserc.mobile.json`) runs alongside the desktop one in CI; its Core Web Vitals are advisory so a variable runner never hard-fails on mobile timings, while it still surfaces regressions the desktop profile misses.

### Contact Worker

The Cloudflare Worker backing the contact form lives in [`worker/`](worker/), with its own tests and deploy notes.

```bash
cd worker
npm install
npm test            # unit tests (mocked Turnstile + Resend)
npm run type-check
npm run dev         # local Worker at http://localhost:8787
```

See [`worker/README.md`](worker/README.md) for the request contract, configuration, and deploy procedure.

## Running CI Locally

Replicate GitHub Actions workflows on your local machine before pushing.

### Complete Pipeline

Run all checks in order (matches CI exactly):

```bash
# 1. Quality Checks
npm run type-check
npm run lint
npm run test:coverage
node scripts/check-coverage.js

# 2. Build (check-anchors validates internal hash anchors + [[credit]] markers; then generates sitemap.xml)
npm run build

# 3. Performance Audit
npm run lighthouse

# 4. E2E + Visual Regression (first run: npx playwright install --with-deps)
npm run test:e2e

# 5. Worker checks
cd worker && npm run type-check && npm test
```

### Git hooks

Husky enforces a subset of these automatically, so a broken commit never leaves the machine:
- **pre-commit** runs `lint-staged` — ESLint + stylelint `--fix` on staged files only.
- **pre-push** runs the type-check.

### Quick Pre-Commit Check

Fast validation before committing (~30 seconds):

```bash
npm run lint && npm run type-check && npm run test
```

### Pre-Push Check

Ensure CI will pass before pushing:

```bash
npm run lint:fix && npm run type-check && npm run test:coverage && npm run build
```

## CI/CD Pipeline

The CI pipeline (`ci.yml`) runs on every pull request, and is reused as the deploy gate on `master` (via `workflow_call`) so the checks are defined in exactly one place. Its jobs:

### Quality Checks
- TypeScript type checking
- ESLint (JS/TS) and stylelint (SCSS, BEM-enforced) code quality
- Unit tests with coverage thresholds
- Coverage reporting to Codecov

### Build
- Production bundle build
- Bundle size budget — **enforced**: fails CI if any JS file exceeds 200KB or CSS 50KB (uncompressed, per file)
- `sitemap.xml` generated from the routes actually pre-rendered (never drifts from the site)
- Build artifact generation (reused downstream — no rebuild)

### Lighthouse
- Accessibility and best-practices audits (**enforced**)
- Console-error and resource-size (JS/CSS) checks (**enforced**)
- Performance, SEO, timing, and image-weight budgets (advisory — reported, not gating)

### E2E Tests
- Cross-browser testing across all three engines (Chromium, Firefox, WebKit)
- Accessibility testing with `@axe-core/playwright`
- Specs: `accessibility`, `accordion`, `audio-player`, `command-palette`, `contact-form`, `epk`, `home-hero`, `language-switch`, `lightbox`, `navigation`, `not-found`, `trailing-slash`

### Visual Regression
- Per-route screenshot snapshots across desktop Chromium/Firefox/WebKit plus a mobile Safari viewport, compared against committed Linux baselines
- Runs on pull requests only (never blocks a deploy); baselines are regenerated via the **Update Visual Snapshots** workflow when a visual change is intended

### Worker
- Type checking and unit tests for the Cloudflare Worker (`worker/`)

**Quality gate:** the pull-request pipeline is green only when Quality Checks, Build, Lighthouse, E2E, Visual Regression, and Worker all pass. `master` is branch-protected: Quality Checks, Build, E2E (all three engines), Visual Regression, and Worker are **required status checks** that must pass before a PR can merge.

## Deployment

On push to `master`, the deploy workflow (`deploy.yml`) runs the full CI pipeline as its gate, then publishes the **exact `dist` the E2E suite exercised** to GitHub Pages — so what ships is what was tested. The Cloudflare Worker deploys separately (`cd worker && npm run deploy`), only when its code changes.

## About

I'm Jerome Faria — a senior frontend engineer (15+ years, Vue / TypeScript) and a sound artist. I've built and owned greenfield products end to end across music tech ([Linkfire](https://www.linkfire.com/)), automotive ([Mercedes-Benz.io](https://www.mercedes-benz.io)), and energy ([Smart Energy Lab](https://www.smartenergylab.com/)). I work as an AI-augmented engineer — high velocity behind the enforced quality gates you can see in this repo's CI — and this repo is a public instance of that.

- **Website** · [jeromefaria.com](https://jeromefaria.com)
- **LinkedIn** · [linkedin.com/in/jeromefaria](https://www.linkedin.com/in/jeromefaria)
- **Contact** · [the form](https://jeromefaria.com/contact) — yes, the one with the real backend

## License

The source code is released under the [MIT License](LICENSE.md), © 2026 Jerome Faria.

Site content — photographs, poster and cover artwork, audio and video, and written text — is **not** covered by the MIT License and may not be reused without permission. Third-party media is credited to its authors in the site data and remains their property. See [`LICENSE.md`](LICENSE.md) for the full terms.
