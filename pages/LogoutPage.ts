import { Page, Locator } from "@playwright/test";
import logoutSelectors from "../selectors/logoutSelectors";

export class LogoutPage {
  readonly page: Page;
  readonly menuButton: Locator;
  readonly logoutLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.menuButton = page.locator(logoutSelectors.menu.button);
    this.logoutLink = page.locator(logoutSelectors.menu.logoutLink);
  }

  async openMenu() {
    await this.menuButton.click();
  }

  async logout() {
    await this.logoutLink.click();
  }
}
