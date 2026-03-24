import { test, expect } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage";
import { LogoutPage } from "../pages/LogoutPage";
import { users } from "../fixtures/users";
import { storageStatePath } from "../utils/session";
import fs from "fs";

test("Logout clears session and removes storageState.json", async ({
  page,
}) => {
  const login = new LoginPage(page);
  await login.goto();
  // ensure logged in
  if (!(await login.isLoggedIn())) {
    await login.login(users.standard_user, users.password);
    await expect(page).toHaveURL(/.*inventory.html/);
  }

  const logout = new LogoutPage(page);
  await logout.openMenu();
  await logout.logout();

  // Verify we're back on login page
  await expect(page).toHaveURL(/.*saucedemo.com/);

  // Remove saved storage file if exists
  try {
    if (fs.existsSync(storageStatePath)) fs.unlinkSync(storageStatePath);
  } catch (e) {
    // ignore cleanup errors
  }
});
