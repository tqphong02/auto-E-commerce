import { Page, Locator } from "@playwright/test";
import checkoutSelectors from "../selectors/checkoutSelectors";

export class CartPage {
  readonly page: Page;
  readonly checkoutButton: Locator;
  readonly continueShopping: Locator;
  readonly removeBackpack: Locator;
  readonly cartLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.checkoutButton = page.locator(
      checkoutSelectors.cartPage.checkoutButton,
    );
    this.continueShopping = page.locator(
      checkoutSelectors.cartPage.continueShopping,
    );
    this.removeBackpack = page.locator(
      checkoutSelectors.removeFromCart.backpack,
    );
    this.cartLink = page.locator(checkoutSelectors.cart.link);
  }

  async goto() {
    await this.page.click(checkoutSelectors.cart.link);
  }

  async open() {
    await this.goto();
  }

  async removeBackpackItem() {
    await this.page.click(checkoutSelectors.removeFromCart.backpack);
  }

  async proceedToCheckout() {
    await this.checkoutButton.click();
  }
}
