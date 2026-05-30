export const cartStorageKey = "yankun_inquiry_cart";
export const cartChangeEvent = "yankun-cart-change";

function storage() {
  if (typeof window === "undefined") return null;
  return window.localStorage;
}

function normalizeQuantity(quantity) {
  const value = Number(quantity || 1);
  if (!Number.isFinite(value) || value < 1) return 1;
  return Math.min(Math.floor(value), 999999);
}

export function readCart() {
  const target = storage();
  if (!target) return [];

  try {
    const parsed = JSON.parse(target.getItem(cartStorageKey) || "[]");
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((item) => item?.model)
      .map((item) => ({
        ...item,
        quantity: normalizeQuantity(item.quantity)
      }));
  } catch {
    return [];
  }
}

export function writeCart(items) {
  const target = storage();
  if (!target) return [];

  const normalized = items
    .filter((item) => item?.model)
    .map((item) => ({
      model: item.model,
      display_name: item.display_name || item.model,
      category_name: item.category_name || "",
      dimensions: item.dimensions || "",
      weight: item.weight || "",
      image: item.image || "",
      source_page: item.source_page || "",
      quantity: normalizeQuantity(item.quantity)
    }));

  target.setItem(cartStorageKey, JSON.stringify(normalized));
  window.dispatchEvent(new CustomEvent(cartChangeEvent, { detail: normalized }));
  return normalized;
}

export function addCartItem(product) {
  const current = readCart();
  const existing = current.find((item) => item.model === product.model);

  if (existing) {
    existing.quantity = normalizeQuantity(existing.quantity + 1);
    return writeCart(current);
  }

  return writeCart([{ ...product, quantity: 1 }, ...current]);
}

export function updateCartItemQuantity(model, quantity) {
  return writeCart(readCart().map((item) => (item.model === model ? { ...item, quantity } : item)));
}

export function removeCartItem(model) {
  return writeCart(readCart().filter((item) => item.model !== model));
}

export function clearCart() {
  return writeCart([]);
}

export function cartQuantity(items) {
  return items.reduce((total, item) => total + normalizeQuantity(item.quantity), 0);
}
