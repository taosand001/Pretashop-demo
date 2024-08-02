import { test, expect } from '@playwright/test';
import Shop from '../pages/Shop.page';
import { testData } from '../data/test-data';
import { SortOptions } from '../data/enum';
import ShopDialog from '../pages/dialogs/ShopDialog.page';
import Cart from '../pages/Cart.page';

let shopPage: Shop;
let dialog: ShopDialog;
let cartPage: Cart;

// Shop Test Suite: Test for the Shop page

test.describe('Search For a Product', () => {
	test.beforeEach(async ({ page }) => {
		shopPage = new Shop(page);
		await shopPage.visit();
	});

	test('[TC010]: Search for a product', async () => {
		await test.step('1. Should search for a product in the search bar', async () => {
			await shopPage.searchForProduct(testData.productNames[0]);
		});

		await test.step('2. Should display the search results', async () => {
			await expect(shopPage.productsContainer, 'There is no search result').toBeVisible();
		});

		await test.step('3. Should display the correct product', async () => {
			expect(await shopPage.getProductTitleText(), 'Product title does not match').toEqual(
				testData.productNames[0]
			);
		});
	});
});

test.describe('Filter and Sort Products', () => {
	test.beforeEach(async ({ page }) => {
		shopPage = new Shop(page);
		await shopPage.visit();
	});

	test('[TC011]: Filter and sort products', async () => {
		await test.step('1. Should filter products by category', async () => {
			await shopPage.accessoriesCategoryLink.click();
		});

		await test.step('2. Should filter and sort by parameters', async () => {
			await shopPage.filterPage.homeAccessoriesCheckbox.click();
			expect(
				(await shopPage.productItemsCount.all(), 'The product item length does not match')
					.length
			).toBeGreaterThanOrEqual(8);

			await shopPage.filterPage.homeAccessoriesCheckbox.click();
			await shopPage.filterPage.stationaryCheckbox.click();
			expect(
				(await shopPage.productItemsCount.all()).length,
				'The product item length does not match'
			).toBeGreaterThanOrEqual(3);
			await shopPage.filterPage.stationaryCheckbox.click();
			await shopPage.waitForSpinnerToBeHidden();

			const previousItems = await shopPage.getProductTitles();
			await shopPage.waitForSpinnerToBeHidden();

			await shopPage.filterPage.selectItemFromDropDown(SortOptions.PriceHighToLow);
			await shopPage.waitForSpinnerToBeHidden();

			const currentItems = await shopPage.getProductTitles();
			expect(previousItems).not.toEqual(currentItems);
		});
	});
});

test.describe('Add Products to Cart', () => {
	test.beforeEach(async ({ page }) => {
		shopPage = new Shop(page);
		await shopPage.visit();
	});

	test('[TC012]: Add products to the cart', async ({ page }) => {
		await test.step('1. Select the product from the list', async () => {
			await shopPage.clickOnProductItem(testData.productNames[0]);
			dialog = new ShopDialog(page, 'quickview-modal-1-1');
			await dialog.addTocartButton.click();
			dialog = new ShopDialog(page, 'blockcart-modal');
			await dialog.proceedToCheckoutButton.click();
		});

		await test.step('2. Should display the correct product in the cart', async () => {
			cartPage = new Cart(page);
			expect(
				await cartPage.cartProductsCount.textContent(),
				'The product count does not match'
			).toBe('(1)');

			expect(
				await cartPage.checkValueInProductTitles(testData.productNames[0]),
				'The product name does not match'
			).toBeTruthy();
		});
	});
});
