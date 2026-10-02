import type { Authenticity, CompatibilityConfidence, Fitment, InventoryStatus, SourceType } from "@/lib/types";

export const inventoryStatusLabels: Record<InventoryStatus, string> = {
  "in-stock": "In stock",
  "low-stock": "Low stock",
  "out-of-stock": "Out of stock",
  "available-on-request": "Available on request",
  "call-to-confirm": "Call to confirm",
  "catalogue-only": "Catalogue item",
};

export const authenticityLabels: Record<Authenticity, string> = {
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

export const confidenceLabels: Record<CompatibilityConfidence, string> = {
  verified: "Fitment verified",
  "manufacturer-listed": "Fitment listed by manufacturer",
  "store-confirmed": "Fitment confirmed by shop",
  "needs-confirmation": "Fitment needs confirmation",
};

export const sourceTypeLabels: Record<SourceType, string> = {
  "official-bangladesh": "Official Bangladesh source",
  "official-manufacturer": "Manufacturer documentation",
  "historical-catalogue": "Historical parts catalogue",
  "retailer-reference": "Parts catalogue reference",
  "store-supplied": "Supplied by Nirob Autos",
  demo: "Demo data",
};

/** Whether a customer can add this item to an order request. */
export function canRequest(status: InventoryStatus): boolean {
  return status !== "out-of-stock";
}

/** Shown on catalogue-only items and in the site-wide notice. */
export const CATALOGUE_DISCLAIMER =
  "Catalogue availability does not guarantee current stock. Contact Nirob Autos to confirm availability and fitment.";
