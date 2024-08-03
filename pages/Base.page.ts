import { FrameLocator, Locator, Page } from '@playwright/test';
import { testData } from '../data/test-data';

export default abstract class Base {
	page: Page;
	loadingMessagSpinner: Locator;
	getText: (text: string) => Locator;
	getAllTextContents: (searchElement: string) => Locator;
	spinner: Locator;
	frame: FrameLocator;

	constructor(page: Page) {
		this.page = page;
		this.frame = this.page.frameLocator('#framelive')!;
		this.getText = (text: string) => this.frame.getByText(text, { exact: true });
		this.loadingMessagSpinner = this.page.locator('#loadingMessage');
		this.getAllTextContents = (searchElement: string) => this.frame.locator(searchElement);
		this.spinner = this.frame.locator('.spinner');
	}

	// method to visit the page
	async visit(url: string = testData.testUrl) {
		await this.page.goto(url);
		await this.page.waitForLoadState('domcontentloaded');
		await this.loadingMessagSpinner.waitFor({ state: 'hidden' });
	}

	// method to wait for the spinner to be hidden
	async waitForSpinnerToBeHidden() {
		await this.spinner.waitFor({ state: 'detached' });
	}
}
