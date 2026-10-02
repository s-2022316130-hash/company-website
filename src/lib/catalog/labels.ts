import type { Fitment, ProductType, StockStatus } from "@/lib/types";

export const stockStatusLabels: Record<StockStatus, string> = {
  "in-stock": "In stock",
  "low-stock": "Low stock",
  "out-of-stock": "Out of stock",
  "available-on-request": "Available on request",
  "call-for-availability": "Call to confirm",
};

export const productTypeLabels: Record<ProductType, string> = {
  genuine: "Genuine",
  oem: "OEM",
  aftermarket: "Aftermarket",
  compatible: "Compatible",
  unknown: "Not specified",
};

export const fitmentLabels: Record<Fitment, string> = {
  "model-specific": "Model-specific",
  universal: "Not model-specific",
  unconfirmed: "Fitment not listed. Call to confirm",
};

/** Whether a customer can add this item to an order request. */
export function canRequest(status: StockStatus): boolean {
  return status !== "out-of-stock";
}
