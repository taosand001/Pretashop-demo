import { Locator, Page } from '@playwright/test';
import Signup from './Signup.page';
import { testData } from '../data/test-data';
import { Gender } from '../data/enum';

export default class PersonalInfomation extends Signup {
	page: Page;
	continueButton: Locator;
	addressInputField: Locator;
	cityInputField: Locator;
	stateDropdownButton: Locator;
	zipCodeInputField: Locator;
	deliveryMessageInputField: Locator;
	approvalCheckbox: Locator;
	placeOrderButton: Locator;

	constructor(page: Page) {
		super(page);
		this.page = page;
		this.continueButton = this.frame.locator('.continue');
		this.saveButton = this.continueButton;
		this.addressInputField = this.frame.locator('#field-address1').first();
		this.cityInputField = this.frame.locator('#field-city').first();
		this.stateDropdownButton = this.frame.locator('#field-id_state').first();
		this.zipCodeInputField = this.frame.locator('#field-postcode');
		this.deliveryMessageInputField = this.frame.locator('#delivery_message').first();
		this.approvalCheckbox = this.frame
			.locator('#conditions-to-approve')
			.locator('span')
			.locator('span')
			.last();
		this.placeOrderButton = this.frame.getByRole('button', { name: 'Place order' });
	}

	async addAdress() {
		await this.createUser(Gender.Male);
		await this.addressInputField.fill(testData.addressInfo.address);
		await this.cityInputField.fill(testData.addressInfo.city);
		await this.stateDropdownButton.click();
		await this.stateDropdownButton.selectOption(testData.addressInfo.state);
		await this.zipCodeInputField.fill(testData.addressInfo.zipCode);
		await this.continueButton.last().click();
	}
}
