import { Locator, Page, Frame, FrameLocator } from '@playwright/test';
import Login from './Login.page';
import Base from './Base.page';
import { Gender } from '../data/enum';
import { userExistingInformation, userInformation } from '../data/test-data';

export default class Signup extends Base {
	page: Page;
	loginTextButton: Locator;
	mrRadioButton: Locator;
	mrsRadioButton: Locator;
	firstNameInputField: Locator;
	lastNameInputField: Locator;
	emailInputField: Locator;
	passwordInputField: Locator;
	birthDateInputField: Locator;
	recieveOffersCheckbox: Locator;
	privacyPolicyCheckbox: Locator;
	customerPrivacyPolicyCheckbox: Locator;
	saveButton: Locator;
	frame: FrameLocator;

	constructor(page: Page) {
		super(page);
		this.page = page;
		this.frame = this.page.frameLocator('#framelive')!;
		this.loginTextButton = this.frame.locator('a', { hasText: 'Log in instead!' });
		this.mrRadioButton = this.frame.locator('#field-id_gender-1');
		this.mrsRadioButton = this.frame.locator('#field-id_gender-2');
		this.firstNameInputField = this.frame.locator('#field-firstname');
		this.lastNameInputField = this.frame.locator('#field-lastname');
		this.emailInputField = this.frame.locator('#field-email').first();
		this.passwordInputField = this.frame.locator('#field-password').first();
		this.birthDateInputField = this.frame.locator('#field-birthday').first();
		this.recieveOffersCheckbox = this.frame.locator('input[name="optin"]').first();
		this.privacyPolicyCheckbox = this.frame.locator('input[name="psgdpr"]').first();
		this.customerPrivacyPolicyCheckbox = this.frame
			.locator('input[name="customer_privacy"]')
			.first();
		this.saveButton = this.frame.locator('button[data-link-action="save-customer"]').first();
	}

	async clickLoginTextButton(): Promise<Login> {
		await this.loginTextButton.click();
		return new Login(this.page);
	}

	async createUser(gender: Gender): Promise<void> {
		if (gender === Gender.Male) {
			await this.mrRadioButton.click();
		} else {
			await this.mrsRadioButton.click();
		}
		await this.firstNameInputField.fill(userExistingInformation.firstName);
		await this.lastNameInputField.fill(userExistingInformation.lastName);
		await this.emailInputField.fill(userExistingInformation.email);
		await this.passwordInputField.fill(userExistingInformation.password);
		await this.birthDateInputField.fill(userExistingInformation.birthDate);
		await this.recieveOffersCheckbox.check();
		await this.privacyPolicyCheckbox.check();
		await this.customerPrivacyPolicyCheckbox.check();
		await this.saveButton.first().click();
	}
}
