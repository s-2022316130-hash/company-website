import { describe, expect, it } from "vitest";
import type { CartLine } from "./cart/cart";
import { buildOrderMessage, normalizeBdPhone, validateOrder, whatsAppUrl, type OrderRequest } from "./order";

const line: CartLine = {
  productId: "p1",
  slug: "yamaha-fzs-v4-front-brake-pad",
  name: "Yamaha FZS V4 Front Brake Pad",
  fitmentSummary: "Fits Yamaha FZS V4",
  quantity: 2,
};

const base: OrderRequest = {
  customer: { name: "Rahim", phone: "01712-345678", address: "", motorcycle: "Yamaha FZS V4", notes: "" },
  fulfilment: "pickup",
  lines: [line],
};

describe("normalizeBdPhone", () => {
  it.each([
    ["01712345678", "01712345678"],
    ["01712-345678", "01712345678"],
    ["+880 1712 345678", "01712345678"],
    ["8801712345678", "01712345678"],
    ["০১৭১২৩৪৫৬৭৮", "01712345678"],
  ])("accepts %s", (input, expected) => {
    expect(normalizeBdPhone(input)).toBe(expected);
  });

  it.each(["0171234567", "01212345678", "12345", "", "02-9876543"])("rejects %s", (input) => {
    expect(normalizeBdPhone(input)).toBeNull();
  });
});

describe("validateOrder", () => {
  it("accepts a complete pickup order without an address", () => {
    expect(validateOrder(base)).toEqual({});
  });

  it("requires an address for courier delivery and explains why", () => {
    const errors = validateOrder({ ...base, fulfilment: "courier" });
    expect(errors.address).toMatch(/courier/i);
  });

  it("rejects an empty cart, missing name and bad phone", () => {
    const errors = validateOrder({ ...base, lines: [], customer: { ...base.customer, name: " ", phone: "123" } });
    expect(Object.keys(errors).sort()).toEqual(["lines", "name", "phone"]);
  });
});

describe("buildOrderMessage", () => {
  it("lists items and customer details and asks for confirmation", () => {
    const msg = buildOrderMessage(base);
    expect(msg).toContain("1. Yamaha FZS V4 Front Brake Pad × 2");
    expect(msg).toContain("Phone: 01712345678");
    expect(msg).toContain("Delivery / Pickup: Store pickup");
    expect(msg).toContain("Please confirm price and availability.");
  });

  it("includes the address and delivery charge request for courier orders", () => {
    const msg = buildOrderMessage({
      ...base,
      fulfilment: "courier",
      customer: { ...base.customer, address: "House 5,\nRoad 2, Tangail" },
    });
    expect(msg).toContain("Courier delivery to: House 5, Road 2, Tangail");
    expect(msg).toContain("delivery charge");
  });

  it("encodes the message into a wa.me link", () => {
    expect(whatsAppUrl("8801743691619", "a b&c")).toBe("https://wa.me/8801743691619?text=a%20b%26c");
  });
});
