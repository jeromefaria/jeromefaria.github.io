# Jerome Faria — Personal Website

[![CI/CD](https://github.com/jeromefaria/jeromefaria.github.io/actions/workflows/deploy.yml/badge.svg?branch=master)](https://github.com/jeromefaria/jeromefaria.github.io/actions/workflows/deploy.yml)
[![codecov](https://codecov.io/gh/jeromefaria/jeromefaria.github.io/branch/master/graph/badge.svg)](https://codecov.io/gh/jeromefaria/jeromefaria.github.io)

A production-grade **Vue 3 + TypeScript** frontend for [www.jeromefaria.com](https://www.jeromefaria.com) — the portfolio of a composer and sound artist (discography, live history, press, and a downloadable press kit), statically generated and hydrated, built to professional standards: strict typing, CI-gated accessibility, performance budgets, and unit + cross-browser E2E + visual-regression tests. Owned end to end, down to the serverless backend behind the contact form.

> The sections below lead with *what the project demonstrates* and *why it's built this way*; the run-book follows.

## What this demonstrates

- **Modern Vue 3 + strict TypeScript.** Composition API with `<script setup>`, a focused composable layer (accordion + hash routing, image loading, page head/schema), and content modelled as typed data with discriminated unions.
- **Accessibility as a first-class concern.** WCAG 2.1 AA gated by `axe-core` in CI — plus keyboard and focus management (focus-trapped lightbox, skip link, hash-routed accordion), `prefers-reduced-motion`, per-link "opens in a new tab" cues, and a light/dark theme that keeps its contrast ratios.
- **Performance engineering.** SSG pre-render + hydrate, Lighthouse budgets enforced in CI, responsive `<picture>`/WebP srcsets generated at build, subsetted self-hosted fonts, and non-render-blocking CSS.
- **Testing rigor.** ~99% coverage behind a **ratcheting floor**, cross-browser E2E on three engines (Chromium, Firefox, WebKit), and per-route **visual-regression** snapshots.
- **Component & styling architecture.** Single-responsibility components, reusable composables, and SCSS design tokens driving a themable, BEM-structured stylesheet.
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
  data          ──▶  Headless-Chromium PDF generation  ──▶  GitHub Pages

Contact (runtime)
  Contact form (invisible Turnstile)
        │  POST
        ▼
  Cloudflare Worker  ──▶  Turnstile siteverify
        │
        └──▶  Resend  ──▶  email

  GitHub Pages serves the contact form.
```

- **Site:** no CMS, API, or database — static data is pre-rendered to every route and hydrated on GitHub Pages.
- **Contact:** the frontend posts already-labelled fields to the Worker, which verifies the Turnstile token server-side and relays the message through Resend — decoupled from the app.

## Key decisions & trade-offs

- **SSG, not SPA or SSR.** Pre-rendering gives fast first paint, clean SEO, and free static hosting; hydration restores interactivity. The trade-off — no server runtime for the site — is deliberate, so the one genuinely dynamic need, the contact form, became a small serverless function.
- **Own the contact backend.** A Cloudflare Worker + Turnstile + Resend keeps spam handling, delivery, and data under my control rather than a form-SaaS embed. (The invisible Turnstile challenge carries a disclosure obligation — hence the `/privacy` page.)
- **A coverage *floor* that only ratchets up.** CI enforces a minimum that rises as coverage climbs (`scripts/check-coverage.js`) — regression protection without chasing 100%.
- **Typed content, no CMS.** The catalog is TypeScript with discriminated unions — a release is `music | compilation | commission | publication | mastering`, a live event has its own shape — versioned in git. The same data renders the site *and* generates the PDF press kit and technical rider that bookers and press ask for.

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

## Project structure

```
src/
  components/    Reusable UI components
  composables/   Reusable logic (accordion + hash routing, image loading, page head/schema, command palette + overlays)
  data/          Typed content — works, live events, press, about (no CMS)
  router/        Vue Router route table
  styles/        Modular SCSS with design tokens (_variables.scss)
  types/         Shared TypeScript types (discriminated unions)
  utils/         Formatters, schema builders, adapters
  views/         One component per route
worker/          Cloudflare Worker — Turnstile verification + Resend relay
scripts/         Build tooling — PDF generation, responsive images, font subsetting, CI checks
e2e/             Playwright specs (navigation, accordion, contact, lightbox, command palette, a11y, visual)
public/          Static assets
```

## Tech Stack

- **Frontend:** Vue 3 (Composition API, `<script setup>`), TypeScript (strict mode)
- **Build:** Vite with SSG (Static Site Generation) + hydration
- **Backend:** Cloudflare Worker (`wrangler`) — server-side Turnstile verification, Resend email relay
- **Styling:** SCSS with BEM and design tokens
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
- Form validation and submission
- Lightbox open/close and keyboard navigation
- Accessibility (WCAG 2.1 AA compliance, `axe-core`)
- Keyboard navigation and mobile responsiveness
- Visual regression — per-route screenshot snapshots (`@visual`)

### Performance Testing

```bash
# Run Lighthouse CI
npm run lighthouse
```

**Performance Budgets** (`.lighthouserc.json`). The **enforced** assertions fail CI:
- Accessibility ≥ 95 and Best Practices ≥ 90
- No browser-console errors
- Script ≤ 250KB and stylesheet ≤ 75KB (transfer), text compression enabled

The following are **advisory** (reported as warnings, not gating) because they vary with the CI runner or with image-rich portfolio content:
- Performance and SEO category scores
- Timing metrics: FCP < 1.5s, LCP < 2.5s, CLS < 0.1, TBT < 300ms, Speed Index < 3s
- Image and total transfer weight

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

# 2. Build (also runs scripts/check-anchors.js to validate internal hash anchors)
npm run build

# 3. Performance Audit
npm run lighthouse

# 4. E2E + Visual Regression (first run: npx playwright install --with-deps)
npm run test:e2e

# 5. Worker checks
cd worker && npm run type-check && npm test
```

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
- ESLint code quality
- Unit tests with coverage thresholds
- Coverage reporting to Codecov

### Build
- Production bundle build
- Bundle size budget — **enforced**: fails CI if any JS file exceeds 200KB or CSS 50KB (uncompressed, per file)
- Build artifact generation (reused downstream — no rebuild)

### Lighthouse
- Accessibility and best-practices audits (**enforced**)
- Console-error and resource-size (JS/CSS) checks (**enforced**)
- Performance, SEO, timing, and image-weight budgets (advisory — reported, not gating)

### E2E Tests
- Cross-browser testing across all three engines (Chromium, Firefox, WebKit)
- Accessibility testing with `@axe-core/playwright`
- Specs: `accessibility`, `accordion`, `contact-form`, `lightbox`, `navigation`, `epk`, `home-hero`

### Visual Regression
- Per-route screenshot snapshots, compared against committed Linux baselines
- Runs on pull requests only (never blocks a deploy); baselines are regenerated via the **Update Visual Snapshots** workflow when a visual change is intended

### Worker
- Type checking and unit tests for the Cloudflare Worker (`worker/`)

**Quality gate:** the pull-request pipeline is green only when Quality Checks, Build, Lighthouse, E2E, Visual Regression, and Worker all pass.

## Deployment

On push to `master`, the deploy workflow (`deploy.yml`) runs the full CI pipeline as its gate, then publishes the **exact `dist` the E2E suite exercised** to GitHub Pages — so what ships is what was tested. The Cloudflare Worker deploys separately (`cd worker && npm run deploy`), only when its code changes.

## License

The source code is released under the [MIT License](LICENSE.md), © 2026 Jerome Faria.

Site content — photographs, poster and cover artwork, audio and video, and written text — is **not** covered by the MIT License and may not be reused without permission. Third-party media is credited to its authors in the site data and remains their property. See [`LICENSE.md`](LICENSE.md) for the full terms.
