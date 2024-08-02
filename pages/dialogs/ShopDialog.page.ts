import { Locator, Page } from '@playwright/test';
import Base from '../Base.page';

export default class ShopDialog extends Base {
	page: Page;
	baseElement: Locator;
	addTocartButton: Locator;
	proceedToCheckoutButton: Locator;

	constructor(page: Page, dialogElement: string) {
		super(page);
		this.page = page;
		this.baseElement = this.frame.locator(`#${dialogElement}`);
		this.addTocartButton = this.baseElement.locator('button[data-button-action="add-to-cart"]');
		this.proceedToCheckoutButton = this.baseElement.locator('a', {
			hasText: 'Proceed to checkout',
		});
	}
}
