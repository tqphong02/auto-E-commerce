export const checkoutSelectors = {
  addToCart: {
    backpack: "#add-to-cart-sauce-labs-backpack",
    bikeLight: "#add-to-cart-sauce-labs-bike-light",
    boltTShirt: "#add-to-cart-sauce-labs-bolt-t-shirt",
    fleeceJacket: "#add-to-cart-sauce-labs-fleece-jacket",
  },
  removeFromCart: {
    backpack: "#remove-sauce-labs-backpack",
    bikeLight: "#remove-sauce-labs-bike-light",
    boltTShirt: "#remove-sauce-labs-bolt-t-shirt",
    fleeceJacket: "#remove-sauce-labs-fleece-jacket",
  },
  cart: {
    link: "a.shopping_cart_link",
    badge: "a.shopping_cart_link .shopping_cart_badge",
  },
  cartPage: {
    checkoutButton: "#checkout",
    continueShopping: "#continue-shopping",
  },
  checkout: {
    firstName: "#first-name",
    lastName: "#last-name",
    postalCode: "#postal-code",
    cancel: "#cancel",
    continue: "#continue",
  },
  overview: {
    itemTotal: ".summary_subtotal_label",
    tax: ".summary_tax_label",
    total: ".summary_total_label",
    paymentText: "text=SauceCard #31337",
    shippingText: "text=Free Pony Express Delivery!",
    finishButton: "#finish",
    backToProducts: "#back-to-products",
  },
  inventoryList: ".inventory_list",
};

export default checkoutSelectors;
