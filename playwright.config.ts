import { defineConfig, devices } from '@playwright/test';
import { Timeout } from './data/enum';

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// import dotenv from 'dotenv';
// dotenv.config({ path: path.resolve(__dirname, '.env') });

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
	testDir: './tests',
	/* Run tests in files in parallel */
	fullyParallel: true,
	/* Fail the build on CI if you accidentally left test.only in the source code. */
	forbidOnly: !!process.env.CI,
	/* Retry on CI only */
	retries: process.env.CI ? 2 : 0,
	/* Opt out of parallel tests on CI. */
	workers: process.env.CI ? 3 : undefined,
	/* Reporter to use. See https://playwright.dev/docs/test-reporters */
	reporter: [
		['html', { outputFolder: './playwright-report' }],
		['json', { outputFile: './playwright-report/results.json' }],
		['junit', { outputFile: './playwright-report/results.xml' }],
	],

	/* expect timeout options */
	expect: {
		timeout: Timeout.Medium,
	},
	/* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
	use: {
		trace: 'on-first-retry',
		headless: process.env.CI ? true : false,
		launchOptions: {
			slowMo: 500,
		},
		actionTimeout: Timeout.Medium,
	},

	/* Configure projects for major browsers */
	projects: [
		{
			name: 'chromium',
			use: { ...devices['Desktop Chrome'] },
		},
	],
});
