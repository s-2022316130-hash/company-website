import type { ProductImage } from "@/lib/types";

/** Cart logic with no browser dependencies, so it can be tested and reused by a future checkout. */

export interface CartLine {
  productId: string;
  slug: string;
  name: string;
  sku?: string;
  image?: ProductImage;
  /** Price at the time it was added; the store confirms the final price. */
  price?: number;
  /** e.g. "Fits Yamaha FZS V3" — shown on the cart page. */
  fitmentSummary: string;
  quantity: number;
}

export const MAX_LINE_QUANTITY = 50;

export type CartAction =
  | { type: "add"; line: Omit<CartLine, "quantity">; quantity?: number }
  | { type: "remove"; productId: string }
  | { type: "setQuantity"; productId: string; quantity: number }
  | { type: "clear" }
  | { type: "replace"; lines: CartLine[] };

const clampQty = (n: number) => Math.min(MAX_LINE_QUANTITY, Math.max(1, Math.floor(n)));

export function cartReducer(lines: CartLine[], action: CartAction): CartLine[] {
  switch (action.type) {
    case "add": {
      const qty = clampQty(action.quantity ?? 1);
      const existing = lines.find((l) => l.productId === action.line.productId);
      if (existing) {
        return lines.map((l) =>
          l.productId === action.line.productId ? { ...l, ...action.line, quantity: clampQty(l.quantity + qty) } : l,
        );
      }
      return [...lines, { ...action.line, quantity: qty }];
    }
    case "remove":
      return lines.filter((l) => l.productId !== action.productId);
    case "setQuantity":
      if (!Number.isFinite(action.quantity) || action.quantity < 1) {
        return lines.filter((l) => l.productId !== action.productId);
      }
      return lines.map((l) => (l.productId === action.productId ? { ...l, quantity: clampQty(action.quantity) } : l));
    case "clear":
      return [];
    case "replace":
      return action.lines;
  }
}

export interface CartTotals {
  itemCount: number;
  /** Sum of priced lines only. */
  pricedSubtotal: number;
  /** Lines without a listed price; their cost is confirmed by the store. */
  unpricedLines: number;
}

export function cartTotals(lines: CartLine[]): CartTotals {
  let itemCount = 0;
  let pricedSubtotal = 0;
  let unpricedLines = 0;
  for (const l of lines) {
    itemCount += l.quantity;
    if (l.price === undefined) unpricedLines += 1;
    else pricedSubtotal += l.price * l.quantity;
  }
  return { itemCount, pricedSubtotal, unpricedLines };
}

/** Parse stored JSON defensively; anything malformed is dropped rather than trusted. */
export function parseStoredCart(raw: string | null): CartLine[] {
  if (!raw) return [];
  let data: unknown;
  try {
    data = JSON.parse(raw);
  } catch {
    return [];
  }
  if (!Array.isArray(data)) return [];
  const lines: CartLine[] = [];
  for (const item of data) {
    if (!item || typeof item !== "object") continue;
    const l = item as Record<string, unknown>;
    if (typeof l.productId !== "string" || typeof l.slug !== "string" || typeof l.name !== "string") continue;
    const quantity = typeof l.quantity === "number" ? clampQty(l.quantity) : 1;
    const image =
      l.image && typeof l.image === "object" && typeof (l.image as ProductImage).src === "string"
        ? { src: (l.image as ProductImage).src, alt: String((l.image as ProductImage).alt ?? "") }
        : undefined;
    lines.push({
      productId: l.productId,
      slug: l.slug,
      name: l.name,
      sku: typeof l.sku === "string" ? l.sku : undefined,
      image,
      price: typeof l.price === "number" && l.price >= 0 ? l.price : undefined,
      fitmentSummary: typeof l.fitmentSummary === "string" ? l.fitmentSummary : "",
      quantity,
    });
  }
  return lines;
}
