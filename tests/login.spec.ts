import { test, expect } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage";
import { users } from "../fixtures/users";

test.describe("Sauce Demo - Login (TypeScript POM)", () => {
  test("Happy path - standard_user logs in", async ({ page }) => {
    const login = new LoginPage(page);
    await login.goto();
    await login.login(users.standard_user, users.password);
    await expect(page).toHaveURL(/.*inventory.html/);
    await expect(page.locator(".inventory_list")).toBeVisible();
  });

  test("Locked out user shows locked out error", async ({ page }) => {
    const login = new LoginPage(page);
    await login.goto();
    await login.login(users.locked_out_user, users.password);
    await expect(login.errorMessage).toContainText("locked out");
  });

  test("Missing username validation", async ({ page }) => {
    const login = new LoginPage(page);
    await login.goto();
    await login.login("", users.password);
    await expect(login.errorMessage).toBeVisible();
  });

  test("Missing password validation", async ({ page }) => {
    const login = new LoginPage(page);
    await login.goto();
    await login.login(users.standard_user, "");
    await expect(login.errorMessage).toBeVisible();
  });

  test("Performance glitch user eventually logs in", async ({ page }) => {
    test.setTimeout(120000);
    const login = new LoginPage(page);
    await login.goto();
    await login.login(users.performance_glitch_user, users.password);
    await expect(page).toHaveURL(/.*inventory.html/);
  });

  test("Problem user - UI sanity (capture screenshot)", async ({ page }) => {
    const login = new LoginPage(page);
    await login.goto();
    await login.login(users.problem_user, users.password);
    // product list presence is the main indicator; capture screenshot for manual review if needed
    await expect(page.locator(".inventory_list")).toBeVisible();
    await page.screenshot({
      path: "artifacts/problem_user.png",
      fullPage: true,
    });
  });

  test("Edge cases: long username and SQL injection", async ({ page }) => {
    const login = new LoginPage(page);
    await login.goto();
    await login.login(users.long_username, users.password);
    await expect(login.errorMessage).toBeVisible();

    await login.goto();
    await login.login(users.sql_injection, users.password);
    await expect(login.errorMessage).toBeVisible();
  });
});
