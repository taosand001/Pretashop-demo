import { Locator, Page } from '@playwright/test';
import Home from './Home.page';
import FilterSort from './FilterSort.page';
import ShopDialog from './dialogs/ShopDialog.page';
import Cart from './Cart.page';

export default class Shop extends Home {
	page: Page;
	clothesCateogryLink: Locator;
	accessoriesCategoryLink: Locator;
	artCategoryLink: Locator;
	menSubCategoryLink: Locator;
	womenSubCategoryLink: Locator;
	stationarySubCategoryLink: Locator;
	homeAccessoriesSubCategoryLink: Locator;
	productItemsCount: Locator;
	getProductItem: (itemText: string) => Locator;
	productTitleText: Locator;
	productsContainer: Locator;
	filterPage: FilterSort;
	wishListButton: (itemName: string) => Locator;
	wishListLink: Locator;
	wishListIconText: (itemName: string) => Locator;

	constructor(page: Page) {
		super(page);
		this.page = page;
		this.clothesCateogryLink = this.frame.locator('#category-3');
		this.accessoriesCategoryLink = this.frame.locator('#category-6');
		this.artCategoryLink = this.frame.locator('#category-9');
		this.menSubCategoryLink = this.frame.locator('#subcategory-4');
		this.womenSubCategoryLink = this.frame.locator('#subcategory-5');
		this.stationarySubCategoryLink = this.frame.locator('#subcategory-7');
		this.homeAccessoriesSubCategoryLink = this.frame.locator('#subcategory-8');
		this.productItemsCount = this.frame.locator('.js-product');
		this.getProductItem = (itemText: string) =>
			this.frame
				.locator('.js-product', { has: this.page.getByText(itemText, { exact: true }) })
				.locator('a[data-link-action="quickview"]');
		this.productTitleText = this.frame.locator('.product-title');
		this.productsContainer = this.frame.locator('#content-wrapper');
		this.wishListButton = (itemName: string) =>
			this.frame
				.locator('.js-product', { has: this.page.getByText(itemName, { exact: true }) })
				.locator('.wishlist-button-add')
				.first();
		this.wishListLink = this.frame.locator('.wishlist-list-item');
		this.filterPage = new FilterSort(page);
		this.wishListIconText = (itemName: string) =>
			this.frame
				.locator('.js-product', { has: this.page.getByText(itemName, { exact: true }) })
				.locator('.wishlist-button-add')
				.locator('i');
	}

	async getProductTitleText(): Promise<string | null> {
		return this.productTitleText.first().textContent();
	}

	async getProductTitles() {
		const productTitles = await this.productTitleText.all();
		let titles: string[] = [];
		for (const title of productTitles) {
			titles.push((await title.textContent()) as string);
		}
		return titles;
	}

	async clickOnProductItem(itemText: string) {
		await this.getProductItem(itemText).first().hover();
		await this.getProductItem(itemText).first().click();
	}

	async addProductToCart(itemText: string) {
		await this.clickOnProductItem(itemText);
		let dialog = new ShopDialog(this.page, 'quickview-modal-1-1');
		await dialog.addTocartButton.click();
		dialog = new ShopDialog(this.page, 'blockcart-modal');
		await dialog.proceedToCheckoutButton.click();
		let cart = new Cart(this.page);
		await cart.proceedToCheckoutButton.click();
	}

	async clickWishListButton(itemName: string) {
		await this.wishListButton(itemName).click();
	}

	async getWishListIconText(itemName: string) {
		return this.wishListIconText(itemName).first().textContent();
	}
}
