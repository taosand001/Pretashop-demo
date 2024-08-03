import { test, expect } from '@playwright/test';
import Shop from '../pages/Shop.page';
import { testData } from '../data/test-data';
import { Gender, SortOptions, Timeout } from '../data/enum';
import ShopDialog from '../pages/dialogs/ShopDialog.page';
import Cart from '../pages/Cart.page';
import PersonalInfomation from '../pages/PersonalInfomation.page';
import Login from '../pages/Login.page';
import Signup from '../pages/Signup.page';

let shopPage: Shop;
let dialog: ShopDialog;
let cartPage: Cart;
let personalInformationPage: PersonalInfomation;
let loginPage: Login;
let signupPage: Signup;

// Shop Test Suite: Test for the Shop page

test.describe('[TC010]: Search For a Product', () => {
	test.beforeEach(async ({ page }) => {
		shopPage = new Shop(page);
		await shopPage.visit();
	});

	test('Search for a product', async () => {
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

test.describe('[TC011]: Filter and Sort Products', () => {
	test.beforeEach(async ({ page }) => {
		shopPage = new Shop(page);
		await shopPage.visit();
	});

	test('Filter and sort products', async () => {
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

test.describe('[TC012]: Add Products to Cart', () => {
	test.beforeEach(async ({ page }) => {
		shopPage = new Shop(page);
		await shopPage.visit();
	});

	test('Add products to the cart', async ({ page }) => {
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

test.describe('[TC013]: Procceed to Checkout and Payment page', () => {
	test.setTimeout(Timeout.LongTest);
	test.beforeEach(async ({ page }) => {
		shopPage = new Shop(page);
		await shopPage.visit();
	});

	test('Proceed to checkout and payment page', async ({ page }) => {
		await test.step('1. Add product to cart and procceed to checkout', async () => {
			await shopPage.addProductToCart(testData.productNames[0]);
		});

		await test.step('2. Should proceed to the payment page', async () => {
			personalInformationPage = new PersonalInfomation(page);
			await personalInformationPage.addAdress();
			await personalInformationPage.continueButton.last().click();
			await personalInformationPage.continueButton.last().click();
			await personalInformationPage.approvalCheckbox.click({ force: true });
			await expect(
				personalInformationPage.placeOrderButton,
				'Place order button is visible'
			).toBeVisible();
			await expect(
				personalInformationPage.placeOrderButton,
				'Place order button is enabled'
			).toBeDisabled();
		});
	});
});

test.describe('[TC014]: Add Product to Wishlist without sign in', () => {
	test.beforeEach(async ({ page }) => {
		shopPage = new Shop(page);
		await shopPage.visit();
	});

	test('Add product to wishlist', async () => {
		await test.step('1. Add product to wishlist', async () => {
			await shopPage.clickWishListButton(testData.productNames[0]);
		});

		await test.step('2. Should display a popup with sign in information', async () => {
			await expect(
				shopPage.getText(testData.signInText),
				'Sign in text is not visible'
			).toBeVisible();
		});
	});
});

test.describe('[TC015]: Add Product to Wishlist after sign in', () => {
	test.beforeEach(async ({ page }) => {
		shopPage = new Shop(page);
		await shopPage.visit();
		await shopPage.signInButton.click();
		loginPage = new Login(page);
		await loginPage.clickSignupTextButton();
		signupPage = new Signup(page);
		await signupPage.createUser(Gender.Male);
	});

	test('Add product to wishlist after sign in', async () => {
		await test.step('1. Add product to wishlist after sign in', async () => {
			expect(
				await shopPage.getWishListIconText(testData.productNames[0]),
				'The product is already favorite'
			).toEqual(testData.favoriteBorder);
			await shopPage.clickWishListButton(testData.productNames[0]);
			await shopPage.wishListLink.click();
		});

		await test.step('2. Should display the product in the wishlist', async () => {
			expect(
				await shopPage.getWishListIconText(testData.productNames[0]),
				'The product is not favorited'
			).toEqual(testData.favorite);
		});
	});
});
