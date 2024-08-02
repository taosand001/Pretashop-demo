import { FrameLocator, Locator, Page } from '@playwright/test';
import Signup from './Signup.page';
import Base from './Base.page';
import { userExistingInformation, userInformation } from '../data/test-data';

export default class Login extends Base {
	// locating elements
	page: Page;
	emailInputField: Locator;
	passwordInputField: Locator;
	submitLoginButton: Locator;
	signupTextButton: Locator;
	errorText: Locator;
	frame: FrameLocator;

	constructor(page: Page) {
		super(page);
		this.page = page;
		this.frame = this.page.frameLocator('#framelive')!;
		this.emailInputField = this.frame.locator('#field-email');
		this.passwordInputField = this.frame.locator('#field-password');
		this.submitLoginButton = this.frame.locator('#submit-login');
		this.signupTextButton = this.frame.locator('a[data-link-action="display-register-form"]');
		this.errorText = this.frame.locator('.alert-danger');
	}

	// login method with either existing or non-existing credentials
	async login(existingCred: boolean): Promise<void> {
		return existingCred
			? await this.loginWithExistingCredentials()
			: await this.loginWithNonExistingCredentials();
	}

	private async loginWithExistingCredentials(): Promise<void> {
		await this.emailInputField.fill(userExistingInformation.email);
		await this.passwordInputField.fill(userExistingInformation.password);
		await this.submitLoginButton.click();
	}

	private async loginWithNonExistingCredentials(): Promise<void> {
		await this.emailInputField.fill(userInformation.email);
		await this.passwordInputField.fill(userInformation.password);
		await this.submitLoginButton.click();
	}

	// method to click on the signup text button
	async clickSignupTextButton(): Promise<Signup> {
		await this.signupTextButton.click();
		return new Signup(this.page);
	}
}
