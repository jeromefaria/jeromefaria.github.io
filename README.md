# Jerome Faria - Personal Website

[![CI/CD](https://github.com/jeromefaria/jeromefaria.github.io/actions/workflows/deploy.yml/badge.svg?branch=master)](https://github.com/jeromefaria/jeromefaria.github.io/actions/workflows/deploy.yml)
[![codecov](https://codecov.io/gh/jeromefaria/jeromefaria.github.io/branch/master/graph/badge.svg)](https://codecov.io/gh/jeromefaria/jeromefaria.github.io)

Vue 3 + TypeScript portfolio website for [www.jeromefaria.com](https://www.jeromefaria.com).

## Tech Stack

- **Frontend**: Vue 3 (Composition API), TypeScript (strict mode)
- **Build**: Vite with SSG (Static Site Generation)
- **Styling**: SCSS with BEM methodology
- **Testing**: Vitest (unit — ~99% coverage across the whole `src` tree), Playwright E2E (Chromium, Firefox, WebKit), axe-core accessibility
- **CI/CD**: GitHub Actions with quality gates
- **Performance**: Lighthouse CI with performance budgets

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
- Accessibility (WCAG 2.1 AA compliance)
- Keyboard navigation
- Mobile responsiveness

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

# 4. E2E Tests (first run: npx playwright install --with-deps)
npm run test:e2e
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

The CI pipeline (`ci.yml`) runs on every pull request, and is reused as the deploy gate on `master` (via `workflow_call`) so the checks are defined in exactly one place. It has the following jobs:

### Quality Checks
- TypeScript type checking
- ESLint code quality
- Unit tests with coverage thresholds
- Coverage reporting to Codecov

### Build
- Production bundle build
- Bundle size budget — **enforced**: fails CI if any JS file exceeds 200KB or CSS 50KB (uncompressed, per file)
- Build artifact generation

### Lighthouse CI
- Accessibility and best-practices audits (**enforced**)
- Console-error and resource-size (JS/CSS) checks (**enforced**)
- Performance, SEO, timing, and image-weight budgets (advisory — reported, not gating)

### E2E Tests
- Cross-browser testing across all three engines (Chromium, Firefox, WebKit)
- Accessibility testing with axe-core (`@axe-core/playwright`)
- Specs: `accessibility`, `accordion`, `contact-form`, `lightbox`, `navigation`

**Quality Gates**: All four CI jobs (Quality Checks, Build, Lighthouse, E2E) must pass for the pipeline to be green.

## Deployment

The site deploys to GitHub Pages via GitHub Actions on push to `master`. The deploy workflow (`deploy.yml`) first runs the full CI pipeline as its gate, then repackages the **exact `dist` the E2E suite exercised** as a Pages artifact and publishes it — so what ships is what was tested, and the checks aren't duplicated between the two workflows.

## License

The source code is released under the [MIT License](LICENSE.md), © 2026 Jerome Faria.

Site content — photographs, poster and cover artwork, audio and video, and written text — is **not** covered by the MIT License and may not be reused without permission. Third-party media is credited to its authors in the site data and remains their property. See [`LICENSE.md`](LICENSE.md) for the full terms.
