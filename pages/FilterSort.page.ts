import { Locator, Page } from '@playwright/test';
import Home from './Home.page';
import { SortOptions } from '../data/enum';

export default class FilterSort extends Home {
	page: Page;
	homeAccessoriesCheckbox: Locator;
	stationaryCheckbox: Locator;
	whiteColorCheckBox: Locator;
	blackColorCheckBox: Locator;
	availableCheckbox: Locator;
	inStockCheckbox: Locator;
	graphicCornerCheckBox: Locator;
	studioDesignCheckBox: Locator;
	sortDropDownButton: Locator;
	selectOptions: (item: SortOptions) => Locator;

	constructor(page: Page) {
		super(page);
		this.page = page;
		this.homeAccessoriesCheckbox = this.frame
			.locator('label', { hasText: 'Home accessories' })
			.locator('span')
			.first();
		this.stationaryCheckbox = this.frame
			.locator('label', { hasText: 'Stationery' })
			.locator('span')
			.first();
		this.whiteColorCheckBox = this.frame
			.locator('label', { hasText: 'White' })
			.locator('span')
			.first();
		this.blackColorCheckBox = this.frame
			.locator('label', { hasText: 'Black' })
			.locator('span')
			.first();
		this.availableCheckbox = this.frame
			.locator('label', { hasText: 'Available' })
			.locator('span')
			.first();
		this.inStockCheckbox = this.frame
			.locator('label', { hasText: 'In stock' })
			.locator('span')
			.first();
		this.graphicCornerCheckBox = this.frame
			.locator('label', { hasText: 'Graphic corner' })
			.locator('span')
			.first();
		this.studioDesignCheckBox = this.frame
			.locator('label', { hasText: 'Studio design' })
			.locator('span')
			.first();
		this.sortDropDownButton = this.frame.locator('.products-sort-order');
		this.selectOptions = (item: SortOptions) =>
			this.frame.locator('.select-list', { hasText: item });
	}

	async selectItemFromDropDown(item: SortOptions): Promise<void> {
		await this.page.mouse.move(100, 0);
		await this.sortDropDownButton.click();
		await this.selectOptions(item).click();
	}
}
