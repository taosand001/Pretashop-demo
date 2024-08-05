import { Locator, Page } from '@playwright/test';
import Base from './Base.page';

export default class Cart extends Base {
	page: Page;
	proceedToCheckoutButton: Locator;
	deleteItemIndex: (index: number) => Locator;
	deleteAllItems: Locator;
	increaseCartQuantityButtonAtIndex: (index: number) => Locator;
	decreaseCartQuantityButtonAtIndex: (index: number) => Locator;
	cartProductsCount: Locator;
	cartQuantityInputValueAtIndex: (index: number) => Locator;
	productNames: Locator;

	constructor(page: Page) {
		super(page);
		this.page = page;
		this.proceedToCheckoutButton = this.frame.locator('a', {
			hasText: 'Proceed to checkout',
		});
		this.deleteItemIndex = (index: number) =>
			this.frame.locator('.remove-from-cart').nth(index);
		this.deleteAllItems = this.frame.locator('.remove-from-cart');
		this.increaseCartQuantityButtonAtIndex = (index: number) =>
			this.frame.locator('.js-increase-product-quantity').nth(index);
		this.decreaseCartQuantityButtonAtIndex = (index: number) =>
			this.frame.locator('.js-decrease-product-quantity').nth(index);
		this.cartProductsCount = this.frame.locator('.cart-products-count').first();
		this.cartQuantityInputValueAtIndex = (index: number) =>
			this.frame.locator('.js-cart-line-product-quantity').nth(index);
		this.productNames = this.frame.locator('.product-line-info');
	}

	async deleteAllProductsFromCart(): Promise<void> {
		(await this.deleteAllItems.all()).forEach(async (item: Locator) => {
			await item.click();
		});
	}

	async deleteProductFromCartAtIndex(index: number): Promise<void> {
		await this.deleteItemIndex(index).click();
	}

	async getProductNames(): Promise<string[]> {
		const productNames = await this.productNames.all();
		let names: string[] = [];
		for (const name of productNames) {
			names.push((await name.textContent()) as string);
		}
		return names;
	}

	async checkValueInProductTitles(value: string): Promise<boolean> {
		const productNames = await this.getProductNames();
		return productNames.some((name) => name.includes(value));
	}
}
