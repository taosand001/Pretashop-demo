import { Locator, Page } from '@playwright/test';
import Home from './Home.page';
import FilterSort from './FilterSort.page';

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
		this.filterPage = new FilterSort(page);
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
}
