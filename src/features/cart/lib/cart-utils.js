export const CART_STORAGE_KEY = "pitlane-cart";

export function parsePrice(value) {
  return Number.parseFloat(String(value).replace(/[^0-9.]+/g, "")) || 0;
}

export function formatPrice(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(value);
}

export function calculateCartTotal(items) {
  return items.reduce((total, item) => total + parsePrice(item.price) * item.quantity, 0);
}

export function createCartItem(part) {
  return {
    sku: part.sku,
    name: part.name,
    category: part.category,
    compatibleBrand: part.compatibleBrand,
    compatibleModel: part.compatibleModel,
    image: part.image,
    price: part.price,
    quantity: 1,
  };
}
