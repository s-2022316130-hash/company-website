import { describe, expect, it } from "vitest";
import { cartReducer, cartTotals, MAX_LINE_QUANTITY, parseStoredCart, type CartLine } from "./cart";

const item = { productId: "a", slug: "a", name: "Part A", fitmentSummary: "Fits X", price: 100 };
const unpriced = { productId: "b", slug: "b", name: "Part B", fitmentSummary: "" };

describe("cartReducer", () => {
  it("adds a new line and merges repeat adds", () => {
    let lines: CartLine[] = [];
    lines = cartReducer(lines, { type: "add", line: item });
    lines = cartReducer(lines, { type: "add", line: item, quantity: 2 });
    expect(lines).toHaveLength(1);
    expect(lines[0].quantity).toBe(3);
  });

  it("caps quantity", () => {
    const lines = cartReducer([], { type: "add", line: item, quantity: 999 });
    expect(lines[0].quantity).toBe(MAX_LINE_QUANTITY);
  });

  it("removes a line when quantity is set below 1", () => {
    const lines = cartReducer([{ ...item, quantity: 2 }], { type: "setQuantity", productId: "a", quantity: 0 });
    expect(lines).toEqual([]);
  });

  it("removes and clears", () => {
    const start: CartLine[] = [
      { ...item, quantity: 1 },
      { ...unpriced, quantity: 1 },
    ];
    expect(cartReducer(start, { type: "remove", productId: "a" }).map((l) => l.productId)).toEqual(["b"]);
    expect(cartReducer(start, { type: "clear" })).toEqual([]);
  });
});

describe("cartTotals", () => {
  it("sums priced lines and counts unpriced ones separately", () => {
    const totals = cartTotals([
      { ...item, quantity: 2 },
      { ...unpriced, quantity: 3 },
    ]);
    expect(totals).toEqual({ itemCount: 5, pricedSubtotal: 200, unpricedLines: 1 });
  });
});

describe("parseStoredCart", () => {
  it("survives corrupt or tampered storage", () => {
    expect(parseStoredCart(null)).toEqual([]);
    expect(parseStoredCart("not json")).toEqual([]);
    expect(parseStoredCart('{"a":1}')).toEqual([]);
    const parsed = parseStoredCart(
      JSON.stringify([{ productId: "a", slug: "a", name: "A", quantity: 1e6, price: -5 }, { bad: true }, null]),
    );
    expect(parsed).toHaveLength(1);
    expect(parsed[0].quantity).toBe(MAX_LINE_QUANTITY);
    expect(parsed[0].price).toBeUndefined();
  });
});
