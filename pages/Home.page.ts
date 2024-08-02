import { Frame, FrameLocator, Locator, Page } from '@playwright/test';
import Base from './Base.page';
import { testData } from '../data/test-data';

export default class Home extends Base {
	page: Page;
	signInButton: Locator;
	searchWidgetInputField: Locator;
	accountLink: Locator;
	signoutLink: Locator;
	frame: FrameLocator;

	constructor(page: Page) {
		super(page);
		this.page = page;
		this.frame = this.page.frameLocator('#framelive')!;
		this.accountLink = this.frame.locator('a[title="View my customer account"]');
		this.signoutLink = this.frame.locator('a', { hasText: 'Sign out' }).first();
		this.signInButton = this.frame
			.getByTitle('Log in to your customer account', {
				exact: true,
			})
			.first();
		this.searchWidgetInputField = this.frame.locator('input[name="s"]');
	}

	// click on the sign in button
	async clickSignInButton() {
		await this.signInButton.waitFor();
		await this.signInButton.click();
	}
}
