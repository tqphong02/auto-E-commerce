import { Page, Locator } from "@playwright/test";
import { loginSelectors } from "../selectors/loginSelectors";

export class LoginPage {
  readonly page: Page;
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.usernameInput = page.locator(loginSelectors.username);
    this.passwordInput = page.locator(loginSelectors.password);
    this.loginButton = page.locator(loginSelectors.loginButton);
    this.errorMessage = page.locator(loginSelectors.errorMessage);
  }

  async goto() {
    await this.page.goto("https://www.saucedemo.com/");
  }

  async login(username?: string, password?: string) {
    if (username !== undefined) await this.usernameInput.fill(username);
    if (password !== undefined) await this.passwordInput.fill(password);
    // Click login and wait for successful navigation to inventory page by default
    await Promise.all([
      this.page
        .waitForURL("**/inventory.html", { timeout: 3000 })
        .catch(() => {}),
      this.loginButton.click(),
    ]);
  }

  async getErrorText(): Promise<string | null> {
    return this.errorMessage.textContent();
  }

  async isLoggedIn(): Promise<boolean> {
    await this.page.waitForLoadState("networkidle");
    return (
      this.page.url().includes("/inventory.html") ||
      (await this.page.locator(".inventory_list").count()) > 0
    );
  }
}
