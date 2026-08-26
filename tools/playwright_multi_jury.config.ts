import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright Multi-Jury Configuration (ADR-0198 Refinada)
 * Executes DOM Jury, ARIA Snapshot Jury, and Visual Regression Jury across the 5 declarative viewports.
 *
 * Viewports:
 * 1. smartwatch: 280x340 (constrained micro display)
 * 2. mobile: 390x844 (touch primary)
 * 3. tablet: 768x1024 (hybrid dashboard)
 * 4. desktop: 1440x900 (b2b primary high-density workspace)
 * 5. ultra-screen: 1920x1080 (multi-panel command center)
 */

export default defineConfig({
  testDir: '../apps/v8-cockpit/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ['html', { outputFolder: '../tools/reports/playwright-html' }],
    ['json', { outputFile: '../tools/reports/playwright-evidence-report.json' }]
  ],
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },

  projects: [
    {
      name: 'smartwatch',
      use: {
        viewport: { width: 280, height: 340 },
        isMobile: true,
        hasTouch: true,
      },
    },
    {
      name: 'mobile',
      use: {
        ...devices['iPhone 13'],
        viewport: { width: 390, height: 844 },
      },
    },
    {
      name: 'tablet',
      use: {
        ...devices['iPad Mini'],
        viewport: { width: 768, height: 1024 },
      },
    },
    {
      name: 'desktop',
      use: {
        viewport: { width: 1440, height: 900 },
        deviceScaleFactor: 1,
      },
    },
    {
      name: 'ultra-screen',
      use: {
        viewport: { width: 1920, height: 1080 },
        deviceScaleFactor: 1,
      },
    },
  ],

  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
    cwd: '../apps/v8-cockpit',
  },
});
