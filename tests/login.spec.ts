import { test, expect } from '@playwright/test';
import Home from '../pages/Home.page';
import { testData } from '../data/test-data';
import Login from '../pages/Login.page';
import Signup from '../pages/Signup.page';
import { Gender } from '../data/enum';

let homePage: Home;
let loginPage: Login;
let signupPage: Signup;

// Test cases for the Login page
test.describe('[TC001]: Login with non existing credentials', () => {
	test.beforeEach(async ({ page }) => {
		homePage = new Home(page);
		await homePage.visit();
	});

	test('1. Should navigate to the login page', async ({ page }) => {
		await homePage.clickSignInButton();
		loginPage = new Login(page);
		await expect(loginPage.emailInputField, `email input is not valid`).toBeVisible();

		await test.step('2. Should login with non existing credentials', async () => {
			await loginPage.login(false);
		});

		await test.step('3. Should display error message', async () => {
			expect(
				await loginPage.errorText.textContent(),
				`${testData.errorMesage} does not match the shown error`
			).toBe(testData.errorMesage);
		});
	});
});

test.describe('[TC002]: Login with existing credentials', () => {
	test.beforeEach(async ({ page }) => {
		homePage = new Home(page);
		await homePage.visit();
		await homePage.clickSignInButton();
		loginPage = new Login(page);
		await loginPage.clickSignupTextButton();
		signupPage = new Signup(page);
		await signupPage.createUser(Gender.Male);
		await homePage.signoutLink.click();
	});

	test('1. Should navigate to the login page', async ({ page }) => {
		await homePage.clickSignInButton();
		loginPage = new Login(page);
		await expect(loginPage.emailInputField, `email input is not valid`).toBeVisible();

		await test.step('2. Should login with existing credentials', async () => {
			await loginPage.login(true);
		});

		await test.step('3. Should navigate to the account page', async () => {
			await expect(homePage.accountLink, 'Account link is not visible').toBeVisible();
		});
	});
});
