import { defineConfig, devices } from '@playwright/test';
declare const process: { env: Record<string, string | undefined> };

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// import dotenv from 'dotenv';
// import path from 'path';
// dotenv.config({ path: path.resolve(__dirname, '.env') });

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './tests',
  /*
   * Per-test budget. DemoQA is a single-page app whose first (cold) page load took
   * 14-45s when measured on this machine, because every new connection costs ~6s
   * (warm requests take 0.2-0.6s). The default 30s cannot cover that cold start.
   * Only the first navigation is slow; expect() timeouts are left at their defaults.
   */
  timeout: 120_000,
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: 'html',
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('')`. */
    // baseURL: 'http://localhost:3000',

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
   headless:false, 
  },

  /* Configure projects for major browsers */
  projects: [
   
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'],


       },
 },
 ],

 
});