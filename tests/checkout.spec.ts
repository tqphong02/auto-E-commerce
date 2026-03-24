import { test, expect, Page } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage";
import { CartPage } from "../pages/CartPage";
import { CheckoutPage } from "../pages/CheckoutPage";
import { OrderCompletePage } from "../pages/OrderCompletePage";
import checkoutSelectors from "../selectors/checkoutSelectors";
import { users } from "../fixtures/users";

async function ensureLoggedIn(page: Page) {
  const login = new LoginPage(page);
  await login.goto();
  if (!(await login.isLoggedIn())) {
    await login.login(users.standard_user, users.password);
    await expect(page).toHaveURL(/.*inventory.html/);
  }
}

async function getItemTotal(page: Page) {
  const el = page.locator(checkoutSelectors.overview.itemTotal).first();
  const text = await el.textContent();
  if (!text) return null;
  const m = text.match(/\$([0-9,.]+)/);
  return m ? parseFloat(m[1].replace(/,/g, "")) : null;
}

test.describe("Checkout flow - happy, validation, and edge cases (page objects)", () => {
  test.beforeEach(async ({ page }) => {
    await ensureLoggedIn(page);
  });

  test("Happy path: add items, checkout and verify UI and totals", async ({
    page,
  }) => {
    const cart = new CartPage(page);
    const checkout = new CheckoutPage(page);
    const complete = new OrderCompletePage(page);

    // Add products to cart using selectors
    await page.click(checkoutSelectors.addToCart.backpack);
    await page.click(checkoutSelectors.addToCart.bikeLight);
    await page.click(checkoutSelectors.addToCart.boltTShirt);
    await page.click(checkoutSelectors.addToCart.fleeceJacket);

    // Open cart
    await cart.open();

    // Verify items present
    await expect(page.locator("text=Sauce Labs Backpack")).toBeVisible();
    await expect(page.locator("text=Sauce Labs Bike Light")).toBeVisible();
    await expect(page.locator("text=Sauce Labs Bolt T-Shirt")).toBeVisible();
    await expect(page.locator("text=Sauce Labs Fleece Jacket")).toBeVisible();

    // Proceed to checkout
    await cart.proceedToCheckout();

    // Fill checkout info and continue
    await checkout.fillCustomer("John", "Doe", "12345");
    await checkout.continueToOverview();

    // Verify payment and shipping information on overview
    await expect(
      page.locator(checkoutSelectors.overview.paymentText),
    ).toBeVisible();
    await expect(
      page.locator(checkoutSelectors.overview.shippingText),
    ).toBeVisible();

    // Verify totals (match provided screenshot values)
    await expect(
      page.locator(checkoutSelectors.overview.itemTotal),
    ).toContainText("$105.96");
    await expect(page.locator(checkoutSelectors.overview.tax)).toContainText(
      "$8.48",
    );
    await expect(page.locator(checkoutSelectors.overview.total)).toContainText(
      "$114.44",
    );

    // Finish and verify completion UI
    await page.click(checkoutSelectors.overview.finishButton);
    await expect(complete.thankYouText).toBeVisible();
    await expect(
      page.locator(checkoutSelectors.overview.backToProducts),
    ).toBeVisible();
  });

  test("Validation: required checkout fields prevent continuing", async ({
    page,
  }) => {
    const cart = new CartPage(page);
    const checkout = new CheckoutPage(page);

    await page.click(checkoutSelectors.addToCart.backpack);
    await cart.open();
    await cart.proceedToCheckout();

    // Try continue without filling fields
    await checkout.continueToOverview();

    // Expect error banner
    const err = page.locator('h3[data-test="error"]');
    await expect(err).toBeVisible();
    await expect(err).toContainText(/Error|required/i);

    // Fill only first name, still should error
    await checkout.fillCustomer("OnlyName", "", "");
    await checkout.continueToOverview();
    await expect(err).toBeVisible();
  });

  test("Edge: remove items from cart and totals update", async ({ page }) => {
    const cart = new CartPage(page);
    const checkout = new CheckoutPage(page);

    // Add items and go to overview
    await page.click(checkoutSelectors.addToCart.backpack);
    await page.click(checkoutSelectors.addToCart.boltTShirt);
    await cart.open();
    await cart.proceedToCheckout();
    await checkout.fillCustomer("A", "B", "1");
    await checkout.continueToOverview();
    const totalBefore = await getItemTotal(page);
    await expect(totalBefore).not.toBeNull();

    // Go back to cart and remove one item
    await checkout.cancel();
    await cart.removeBackpackItem();
    await expect(page.locator("text=Sauce Labs Backpack")).toHaveCount(0);

    // Proceed again to overview and verify item total decreased
    await cart.proceedToCheckout();
    await checkout.fillCustomer("A", "B", "1");
    await checkout.continueToOverview();
    const totalAfter = await getItemTotal(page);
    await expect(totalAfter).not.toBeNull();
    if (totalBefore !== null && totalAfter !== null) {
      await expect(totalAfter).toBeLessThan(totalBefore);
    }
  });

  test("Edge: continue shopping returns to inventory and keeps cart", async ({
    page,
  }) => {
    const cart = new CartPage(page);

    await page.click(checkoutSelectors.addToCart.bikeLight);
    await cart.open();

    // Click continue shopping and verify inventory
    await cart.continueShopping.click();
    await expect(page).toHaveURL(/.*inventory.html/);
    await expect(page.locator(checkoutSelectors.inventoryList)).toBeVisible();

    // Cart badge should still indicate item(s)
    await expect(page.locator(checkoutSelectors.cart.badge)).toBeVisible();
  });

  test("Cancel from overview returns to cart and back home works", async ({
    page,
  }) => {
    const cart = new CartPage(page);
    const checkout = new CheckoutPage(page);
    const complete = new OrderCompletePage(page);

    await page.click(checkoutSelectors.addToCart.backpack);
    await cart.open();
    await cart.proceedToCheckout();
    await checkout.fillCustomer("X", "Y", "00000");
    await checkout.continueToOverview();

    // Cancel should go back to cart
    await checkout.cancel();
    await expect(page).toHaveURL(/.*cart.html/);

    // Finish a purchase to verify Back Home button returns to inventory
    await cart.proceedToCheckout();
    await checkout.fillCustomer("X", "Y", "00000");
    await checkout.continueToOverview();
    await page.click(checkoutSelectors.overview.finishButton);
    await complete.backToProducts();
    await expect(page).toHaveURL(/.*inventory.html/);
  });
});
