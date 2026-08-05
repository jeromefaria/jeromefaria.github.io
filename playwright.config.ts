import { defineConfig, devices } from '@playwright/test';

const BASE_URL = 'http://localhost:4173';
const isCI = !!process.env.CI;

/**
 * Playwright E2E configuration. Tests run against the production build served
 * locally by `vite preview`; the webServer block starts it automatically.
 * The three projects are the three real rendering engines — Chromium (also
 * covers Edge), Gecko, and WebKit (Safari/iOS).
 */
export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: isCI,
  // Match the previous Cypress policy: retry on CI to absorb rare load-driven
  // flakes, no retries locally so real flakiness surfaces.
  retries: isCI ? 2 : 0,
  reporter: isCI ? [['github'], ['html', { open: 'never' }]] : [['list']],

  use: {
    baseURL: BASE_URL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },

  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
  ],

  webServer: {
    command: 'npm run preview',
    url: BASE_URL,
    reuseExistingServer: !isCI,
    timeout: 120 * 1000,
  },
});
