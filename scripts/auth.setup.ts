import { test } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage";
import { users } from "../fixtures/users";

// This single test logs in once and saves the authenticated storage state
// Run with: `npm run auth` or `npx playwright test scripts/auth.setup.ts`
test("save auth state", async ({ page }) => {
  const login = new LoginPage(page);
  await login.goto();
  await login.login(users.standard_user, users.password);
  if (!(await login.isLoggedIn())) {
    throw new Error("Login failed — cannot save storage state");
  }
  await page.context().storageState({ path: "storageState.json" });
});
