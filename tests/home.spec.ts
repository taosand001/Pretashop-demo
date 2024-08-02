import { test, expect } from '@playwright/test';
import Home from '../pages/Home.page';
import { testData } from '../data/test-data';

// Home Test Suite: Test for the Home page
test.describe('Home Test Suite', () => {
	let HomeTest: Home;

	test.beforeEach(async ({ page }) => {
		HomeTest = new Home(page);
		await HomeTest.visit();
	});

	test('should have the correct page title', async () => {
		expect(await HomeTest.page.title()).toBe(testData.pageTitleText);
	});
});
