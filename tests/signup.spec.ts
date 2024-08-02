import { test, expect } from '@playwright/test';
import Home from '../pages/Home.page';
import { testData } from '../data/test-data';
import Login from '../pages/Login.page';
import Signup from '../pages/Signup.page';
import { Gender } from '../data/enum';

let HomeTest: Home;
let loginPage: Login;
let signupPage: Signup;

test.describe('[TC006]: Sign up with valid credentials', () => {
	test.beforeEach(async ({ page }) => {
		HomeTest = new Home(page);
		await HomeTest.visit();
	});

	test('1. Should navigate to the login page', async ({ page }) => {
		await HomeTest.clickSignInButton();
		loginPage = new Login(page);
		await expect(loginPage.emailInputField, `email input is not valid`).toBeVisible();

		await test.step('2. Should click on the signup text button', async () => {
			signupPage = await loginPage.clickSignupTextButton();
		});

		await test.step('3. Should sign up with valid credentials', async () => {
			await signupPage.createUser(Gender.Male);
		});

		test.skip(
			await signupPage.getText(testData.existingEmailMessage).isVisible(),
			'Email already exists'
		);

		await test.step('4. Should navigate to the Home page', async () => {
			await expect(HomeTest.accountLink, 'Account link is not visible').toBeVisible();
		});
	});
});
