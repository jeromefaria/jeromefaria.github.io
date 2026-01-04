# Jerome Faria - Personal Website

[![CI](https://github.com/jeromefaria/jeromefaria.github.io/actions/workflows/ci.yml/badge.svg)](https://github.com/jeromefaria/jeromefaria.github.io/actions/workflows/ci.yml)
[![codecov](https://codecov.io/gh/jeromefaria/jeromefaria.github.io/branch/master/graph/badge.svg)](https://codecov.io/gh/jeromefaria/jeromefaria.github.io)
[![Deploy](https://github.com/jeromefaria/jeromefaria.github.io/actions/workflows/deploy.yml/badge.svg)](https://github.com/jeromefaria/jeromefaria.github.io/actions/workflows/deploy.yml)

Vue 3 + TypeScript portfolio website for [www.jeromefaria.com](https://www.jeromefaria.com).

## Tech Stack

- **Frontend**: Vue 3 (Composition API), TypeScript (strict mode)
- **Build**: Vite with SSG (Static Site Generation)
- **Styling**: SCSS with BEM methodology
- **Testing**: Vitest (98%+ coverage), Playwright E2E, axe-core accessibility
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

**Coverage Thresholds**: Lines 95%, Statements 95%, Functions 90%, Branches 85%

### E2E Tests

```bash
# Run E2E tests
npm run test:e2e

# Run with UI
npm run test:e2e:ui

# Run in headed mode (see browser)
npm run test:e2e:headed

# Debug mode
npm run test:e2e:debug
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

**Performance Budgets**:
- Performance Score: 90+
- Accessibility Score: 95+
- First Contentful Paint: <1.5s
- Largest Contentful Paint: <2.5s
- Cumulative Layout Shift: <0.1

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

# 2. Build
npm run build

# 3. Performance Audit
npm run lighthouse

# 4. E2E Tests (requires Playwright browsers)
npx playwright install  # First time only
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

Every push to `master` and pull request triggers a comprehensive CI pipeline with the following jobs:

### Quality Checks
- TypeScript type checking
- ESLint code quality
- Unit tests with coverage thresholds
- Coverage reporting to Codecov

### Build
- Production bundle build
- Bundle size checks (JS <200KB, CSS <50KB per file)
- Build artifact generation

### Lighthouse CI
- Performance audits
- Accessibility audits
- SEO and best practices checks
- Performance budget enforcement

### E2E Tests
- Cross-browser testing (Chromium, Firefox, WebKit)
- Mobile device testing (Pixel 5, iPhone 12)
- Accessibility testing with axe-core
- Visual regression prevention

**Quality Gates**: All checks must pass before deployment. Deployment workflow only runs after successful CI completion.

## Deployment

The site automatically deploys to GitHub Pages via GitHub Actions when CI passes on `master`.

## License

Copyright (c) Jerome Faria

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
