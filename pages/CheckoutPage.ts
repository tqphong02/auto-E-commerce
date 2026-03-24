import { Page, Locator } from "@playwright/test";
import checkoutSelectors from "../selectors/checkoutSelectors";

export class CheckoutPage {
  readonly page: Page;
  readonly firstName: Locator;
  readonly lastName: Locator;
  readonly postalCode: Locator;
  readonly cancelButton: Locator;
  readonly continueButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.firstName = page.locator(checkoutSelectors.checkout.firstName);
    this.lastName = page.locator(checkoutSelectors.checkout.lastName);
    this.postalCode = page.locator(checkoutSelectors.checkout.postalCode);
    this.cancelButton = page.locator(checkoutSelectors.checkout.cancel);
    this.continueButton = page.locator(checkoutSelectors.checkout.continue);
  }

  async fillCustomer(first: string, last: string, postal: string) {
    await this.firstName.fill(first);
    await this.lastName.fill(last);
    await this.postalCode.fill(postal);
  }

  async continueToOverview() {
    await this.continueButton.click();
  }

  async cancel() {
    await this.cancelButton.click();
  }
}
