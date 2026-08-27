# Jerome Faria — Personal Website

[![CI/CD](https://github.com/jeromefaria/jeromefaria.github.io/actions/workflows/deploy.yml/badge.svg?branch=master)](https://github.com/jeromefaria/jeromefaria.github.io/actions/workflows/deploy.yml)
[![codecov](https://codecov.io/gh/jeromefaria/jeromefaria.github.io/branch/master/graph/badge.svg)](https://codecov.io/gh/jeromefaria/jeromefaria.github.io)

A production-grade **Vue 3 + TypeScript** frontend for [www.jeromefaria.com](https://www.jeromefaria.com) — statically generated, hydrated, and built to the standard I'd hold professional work to: strict typing, accessibility gated in CI, performance budgets, and a test suite spanning unit, cross-browser E2E, and visual regression. A deliberate frontend-engineering exercise, owned end to end — down to the small serverless backend behind the contact form.

> **For reviewers:** this repository is meant to stand in for a live-coding round — a durable artifact you can read to see how I build, test, and ship a frontend. The sections below lead with *what it demonstrates* and *why it's built this way*; the run-book follows.

## What this demonstrates

- **Modern Vue 3 + strict TypeScript.** Composition API with `<script setup>`, a focused composable layer (accordion + hash routing, image loading, page head/schema), and content modelled as typed data with discriminated unions.
- **Accessibility as a first-class concern.** WCAG 2.1 AA gated by `axe-core` in CI — plus keyboard and focus management (focus-trapped lightbox, skip link, hash-routed accordion), `prefers-reduced-motion`, per-link "opens in a new tab" cues, and a light/dark theme that keeps its contrast ratios.
- **Performance engineering.** SSG pre-render + hydrate, Lighthouse budgets enforced in CI, responsive `<picture>`/WebP srcsets generated at build, subsetted self-hosted fonts, and non-render-blocking CSS.
- **Testing rigor.** ~99% coverage behind a **ratcheting floor**, cross-browser E2E on three engines (Chromium, Firefox, WebKit), and per-route **visual-regression** snapshots.
- **Component & styling architecture.** Single-responsibility components, reusable composables, and SCSS design tokens driving a themable, BEM-structured stylesheet.
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

- **Site:** static data → Vite-SSG pre-renders every route → hydrated Vue app on GitHub Pages. No CMS, API, or database behind the site itself.
- **Contact:** the browser solves an invisible Turnstile challenge, POSTs to the Worker, which verifies the token server-side, then sends the message through Resend. Decoupled from the app — the frontend resolves the inquiry taxonomy and posts already-labelled fields, which the Worker validates and forwards.

## Key decisions & trade-offs

- **SSG, not SPA or SSR.** Pre-rendering gives fast first paint, clean SEO, and free static hosting; hydration restores interactivity. The cost — no server runtime for the site — is deliberate, and pushed the one genuinely dynamic need (the contact form) into its own serverless function rather than compromising the static model.
- **Accessibility gated, not aspirational.** `axe-core` runs in the E2E suite against every route and fails CI on violations, so a11y can't silently regress — which in turn drove concrete choices: a focus-trapped lightbox, a skip link, hash-routed accordion state, reduced-motion handling, and per-link new-tab cues.
- **A coverage *floor* that only ratchets up.** CI enforces a minimum that rises as coverage climbs (`scripts/check-coverage.js`), preventing regressions without the busywork of chasing 100%.
- **Per-route visual regression.** Screenshot snapshots catch unintended visual change that unit and E2E assertions miss; they gate pull requests (never a deploy) and are regenerated deliberately when a visual change is intended.
- **Data-driven content, typed, no CMS.** Content is TypeScript data with discriminated unions — type-safe and versioned in git — and the same data drives both the rendered views and PDF generation (press kit, technical rider).
- **Own the contact backend.** A Cloudflare Worker + Turnstile + Resend keeps spam handling, delivery, and data under my control instead of a form-SaaS embed — and shows the frontend focus doesn't stop at the network boundary. (Choosing the *invisible* Turnstile challenge also carried a disclosure obligation, which is why the site has a `/privacy` page — a technical choice driving a product requirement.)

## Project structure

```
src/
  components/    Reusable UI components
  composables/   Reusable logic (accordion + hash routing, image loading, page head/schema)
  data/          Typed content — works, live events, press, about (no CMS)
  router/        Vue Router route table
  styles/        Modular SCSS with design tokens (_variables.scss)
  types/         Shared TypeScript types (discriminated unions)
  utils/         Formatters, schema builders, adapters
  views/         One component per route
worker/          Cloudflare Worker — Turnstile verification + Resend relay
scripts/         Build tooling — PDF generation, responsive images, font subsetting, CI checks
e2e/             Playwright specs (navigation, accordion, contact, lightbox, a11y, visual)
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

**Coverage**: The whole `src` tree is instrumented (`all: true`), so the reported percentage reflects the entire codebase rather than only the files a test imports. The logic layer (composables, utils) is ~100% covered; the view and component tests assert behaviour (hash-driven accordion opening, link processing, focus trapping, image load/error fallbacks) rather than render counts, and UI paths are also exercised by the Playwright E2E suite. CI enforces a regression **floor** (`scripts/check-coverage.js`) that ratchets upward as coverage climbs. Current coverage is ~99% lines / 98% statements / 97% functions / 92% branches, with the floor set just below at Lines 99%, Statements 97%, Functions 96%, Branches 91%.

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

The site deploys to GitHub Pages via GitHub Actions on push to `master`. The deploy workflow (`deploy.yml`) first runs the full CI pipeline as its gate, then repackages the **exact `dist` the E2E suite exercised** as a Pages artifact and publishes it — so what ships is what was tested, and the checks aren't duplicated between the two workflows. The Cloudflare Worker deploys separately (`cd worker && npm run deploy`) and only when its code changes.

## License

The source code is released under the [MIT License](LICENSE.md), © 2026 Jerome Faria.

Site content — photographs, poster and cover artwork, audio and video, and written text — is **not** covered by the MIT License and may not be reused without permission. Third-party media is credited to its authors in the site data and remains their property. See [`LICENSE.md`](LICENSE.md) for the full terms.
