import { Locator, Page } from '@playwright/test';
import { testData } from '../data/test-data';

export default abstract class Base {
	page: Page;
	loadingMessagSpinner: Locator;
	getText: (text: string) => Locator;

	constructor(page: Page) {
		this.page = page;
		this.getText = (text: string) => this.page.getByText(text, { exact: true });
		this.loadingMessagSpinner = this.page.locator('#loadingMessage');
	}

	// method to visit the page
	async visit(url: string = testData.testUrl) {
		await this.page.goto(url);
		await this.page.waitForLoadState('domcontentloaded');
		await this.loadingMessagSpinner.waitFor({ state: 'hidden' });
	}
}
