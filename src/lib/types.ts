/**
 * Catalogue domain types. Text fields accept any Unicode, so Bangla names and
 * descriptions can be stored alongside English ones (the optional *Bn fields).
 */

export type StockStatus =
  | "in-stock"
  | "low-stock"
  | "out-of-stock"
  | "available-on-request"
  | "call-for-availability";

/** Only set to something other than "unknown" when the store has verified it. */
export type ProductType = "genuine" | "oem" | "aftermarket" | "compatible" | "unknown";

/**
 * model-specific: fits the models listed in compatibleModels.
 * universal: not tied to a model (e.g. phone holder, chain lube).
 * unconfirmed: fitment not recorded yet; customer must confirm with the store.
 */
export type Fitment = "model-specific" | "universal" | "unconfirmed";

export interface Brand {
  slug: string;
  name: string;
  nameBn?: string;
  description?: string;
}

export interface MotorcycleModel {
  /** Equals slug; kept separate so a database id can replace it later. */
  id: string;
  slug: string;
  /** Brand slug. */
  brand: string;
  /** Model name without the brand, e.g. "Pulsar 150". */
  name: string;
  variant?: string;
  segment?: string;
  yearRange?: string;
  image?: string;
  description?: string;
  /** Extra spellings customers type, e.g. "fz v3". */
  aliases?: string[];
}

export type CategoryIcon =
  | "engine"
  | "clutch"
  | "brakes"
  | "chain"
  | "filters"
  | "electrical"
  | "fuel"
  | "suspension"
  | "wheels"
  | "cables"
  | "body"
  | "bearings"
  | "oils"
  | "accessories";

export interface Subcategory {
  slug: string;
  name: string;
  nameBn?: string;
  /** Search terms that should resolve to this subcategory. */
  aliases?: string[];
  /** Shown in "Popular parts". */
  popular?: boolean;
}

export interface CategoryGroup {
  slug: string;
  name: string;
  nameBn?: string;
  icon: CategoryIcon;
  description: string;
  subcategories: Subcategory[];
}

export interface ProductImage {
  src: string;
  alt: string;
}

export interface ProductSpec {
  label: string;
  value: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  nameBn?: string;

  /** Manufacturer of the part itself (not the motorcycle), when known. */
  partBrand?: string;
  /** Category group slug. */
  category: string;
  /** Subcategory slug within the group. */
  subcategory?: string;

  sku?: string;
  partNumber?: string;

  shortDescription?: string;
  description?: string;

  images: ProductImage[];

  /** Whole taka. Leave undefined when the store has not set a price. */
  price?: number;
  compareAtPrice?: number;
  currency?: "BDT";

  stockStatus: StockStatus;
  quantityAvailable?: number;

  productType: ProductType;

  fitment: Fitment;
  /** Motorcycle model ids. Compatible brands are derived from these. */
  compatibleModels: string[];

  specifications?: ProductSpec[];
  features?: string[];
  tags?: string[];
  searchableAliases?: string[];

  isFeatured?: boolean;
  isPopular?: boolean;
  isNew?: boolean;

  createdAt?: string;
  updatedAt?: string;

  /**
   * True for development seed records that are not confirmed store inventory.
   * Sample products carry a visible label, are excluded from the sitemap and set to noindex.
   */
  isSample?: boolean;
}

/** A product joined with the records it references, ready for display. */
export interface ProductView extends Product {
  categoryName: string;
  categoryIcon: CategoryIcon;
  subcategoryName?: string;
  models: MotorcycleModel[];
  brands: Brand[];
}
