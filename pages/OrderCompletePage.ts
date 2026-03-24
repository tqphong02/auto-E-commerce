import { Page, Locator } from "@playwright/test";
import checkoutSelectors from "../selectors/checkoutSelectors";

export class OrderCompletePage {
  readonly page: Page;
  readonly thankYouText: Locator;
  readonly backToProductsButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.thankYouText = page.locator("text=Thank you for your order!");
    this.backToProductsButton = page.locator(
      checkoutSelectors.overview.backToProducts,
    );
  }

  async isCompleted(): Promise<boolean> {
    return (await this.thankYouText.count()) > 0;
  }

  async backToProducts() {
    await this.backToProductsButton.click();
  }
}
