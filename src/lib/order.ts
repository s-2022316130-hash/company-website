import { business, type FulfilmentMethod } from "@/config/business";
import type { CartLine } from "@/lib/cart/cart";

/**
 * Order requests. There is no order backend: the customer sends the request
 * themselves over WhatsApp or reads it out on a call. Nothing here claims
 * an order was placed.
 */

export interface CustomerDetails {
  name: string;
  phone: string;
  address: string;
  motorcycle: string;
  notes: string;
}

export interface OrderRequest {
  customer: CustomerDetails;
  fulfilment: FulfilmentMethod;
  lines: CartLine[];
}

export type OrderErrors = Partial<Record<keyof CustomerDetails | "lines", string>>;

const BANGLA_DIGITS = "০১২৩৪৫৬৭৮৯";

/** Bangladeshi mobile number to 01XXXXXXXXX, or null if it is not one. Accepts Bangla digits and +880. */
export function normalizeBdPhone(input: string): string | null {
  const ascii = input.replace(/[০-৯]/g, (d) => String(BANGLA_DIGITS.indexOf(d)));
  const digits = ascii.replace(/[\s\-().]/g, "");
  // +880 1XXX… is written as +88 01XXX…, so the optional prefix is "88", not "880".
  const match = digits.match(/^(?:\+?88)?(01[3-9]\d{8})$/);
  return match ? match[1] : null;
}

export const LIMITS = { name: 80, address: 300, motorcycle: 80, notes: 500 } as const;

export function validateOrder(order: OrderRequest): OrderErrors {
  const errors: OrderErrors = {};
  const { customer } = order;

  if (order.lines.length === 0) errors.lines = "Your cart is empty. Add at least one product first.";

  if (customer.name.trim().length < 2) errors.name = "Enter your name so the store knows who is ordering.";
  else if (customer.name.length > LIMITS.name) errors.name = `Keep the name under ${LIMITS.name} characters.`;

  if (!normalizeBdPhone(customer.phone)) {
    errors.phone = "Enter a Bangladeshi mobile number, for example 01712-345678, so the store can call you back.";
  }

  if (order.fulfilment === "courier" && customer.address.trim().length < 10) {
    errors.address = "Courier delivery needs a full address: house or road, area, district.";
  } else if (customer.address.length > LIMITS.address) {
    errors.address = `Keep the address under ${LIMITS.address} characters.`;
  }

  if (customer.motorcycle.length > LIMITS.motorcycle) errors.motorcycle = `Keep this under ${LIMITS.motorcycle} characters.`;
  if (customer.notes.length > LIMITS.notes) errors.notes = `Keep notes under ${LIMITS.notes} characters.`;

  return errors;
}

/** Collapse whitespace and strip control characters from free text before it goes into a message. */
function clean(text: string): string {
  return text.replace(/\p{Cc}+/gu, " ").replace(/\s+/g, " ").trim();
}

export function buildOrderMessage(order: OrderRequest): string {
  const { customer, fulfilment, lines } = order;
  const items = lines.map((line, i) => {
    const ref = line.sku ? ` (SKU ${line.sku})` : "";
    return `${i + 1}. ${line.name}${ref} × ${line.quantity}`;
  });

  const delivery =
    fulfilment === "pickup"
      ? `${business.fulfilment.pickup.label}`
      : `${business.fulfilment.courier.label} to: ${clean(customer.address)}`;

  const phone = normalizeBdPhone(customer.phone) ?? clean(customer.phone);
  const closing =
    fulfilment === "courier"
      ? "Please confirm price, availability and the delivery charge."
      : "Please confirm price and availability.";

  return [
    `Hello ${business.name},`,
    "",
    "I would like to order/request the following products:",
    "",
    ...items,
    "",
    `Name: ${clean(customer.name)}`,
    `Phone: ${phone}`,
    `Motorcycle: ${clean(customer.motorcycle) || "Not given"}`,
    `Delivery / Pickup: ${delivery}`,
    ...(clean(customer.notes) ? [`Notes: ${clean(customer.notes)}`] : []),
    "",
    closing,
  ].join("\n");
}

export function whatsAppUrl(waId: string, message?: string): string {
  return message ? `https://wa.me/${waId}?text=${encodeURIComponent(message)}` : `https://wa.me/${waId}`;
}

/** Short enquiry message for a single product page. */
export function productEnquiryMessage(productName: string, productUrl: string): string {
  return `Hello ${business.name}, I'm asking about: ${productName}\n${productUrl}\n\nIs it available, and what is the price?`;
}
