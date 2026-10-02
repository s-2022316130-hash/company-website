import type { PhotoKey } from "@/config/photos";

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

/** Body style, used to pick the line drawing shown for a model. */
export type BikeClass = "commuter" | "street" | "sport" | "cruiser" | "scooter" | "offroad";

/**
 * Where a model's existence was verified:
 * bd-current     on the brand's official Bangladesh line-up when checked
 * bd-earlier     an older model with an official Bangladesh page, no longer in the line-up
 * official-other in the manufacturer's official catalogue outside Bangladesh only
 */
export type ModelStatus = "bd-current" | "bd-earlier" | "official-other";

export type BrakeType = "disc" | "drum";
export type FuelSystem = "fi" | "carburettor";

/** Facts taken from the official model or spec page. Used to keep demo parts plausible. */
export interface ModelSpec {
  /** Every brake type offered across variants, e.g. ["disc", "drum"]. */
  frontBrake?: BrakeType[];
  rearBrake?: BrakeType[];
  fuel?: FuelSystem[];
}

export interface Brand {
  slug: string;
  name: string;
  nameBn?: string;
  description?: string;
  /** Drawing used for the brand when no licensed photo exists. */
  bikeClass: BikeClass;
  /** Licensed photo for brand cards and banners, if one is ever supplied. */
  image?: PhotoKey;
  /** Official site the model list was checked against. */
  officialSource?: { label: string; url: string; checked: string };
}

export interface MotorcycleModel {
  /** Equals slug; kept separate so a database id can replace it later. */
  id: string;
  slug: string;
  /** Brand slug. */
  brand: string;
  /** Model name without the brand, as the official site writes it (lightly normalised). */
  name: string;
  type: "motorcycle" | "scooter";
  class: BikeClass;
  status: ModelStatus;
  spec?: ModelSpec;
  /** Official page the model was verified on. */
  source?: string;
  variant?: string;
  yearRange?: string;
  /** Licensed photo of this exact model, if one is ever supplied. */
  image?: PhotoKey;
  description?: string;
  /** Extra spellings customers type, e.g. "fz v4". */
  aliases?: string[];
  /** Official per-variant specifications, where they have been collected. */
  variants?: VariantSpec[];
}

export type Cooling = "air" | "oil" | "liquid";

export interface BrakeSpec {
  type: BrakeType;
  sizeMm?: number;
}

/**
 * One variant's published specification, restated from the official spec page (facts only, no copied
 * text). Fields are left out when the page doesn't state them or contradicts itself.
 */
export interface VariantSpec {
  /** Variant name as the official site titles it, e.g. "Pulsar 150 TD ABS". */
  name: string;
  /** Official spec page. */
  source: string;
  /** Date the page was read, YYYY-MM-DD. */
  checked: string;
  engineCc?: number;
  valves?: number;
  fuel?: FuelSystem;
  cooling?: Cooling;
  /** True only when the page says the brakes have ABS. */
  abs?: boolean;
  frontBrake?: BrakeSpec;
  rearBrake?: BrakeSpec;
  /** Size as published, e.g. "80/100-17 46P, tubeless". */
  frontTyre?: string;
  rearTyre?: string;
  frontSuspension?: string;
  rearSuspension?: string;
  battery?: string;
  gears?: number;
  /** Shown with the table, e.g. when the official page contradicts itself. */
  note?: string;
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
  /** Representative photo of this part type. */
  image?: PhotoKey;
}

export interface CategoryGroup {
  slug: string;
  name: string;
  nameBn?: string;
  icon: CategoryIcon;
  description: string;
  /** Short line under the name on cards, e.g. "Pads • Shoes • Discs". */
  shortLabel: string;
  /** Photo for cards and the category banner. */
  image?: PhotoKey;
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

  /** Photos of this exact item. Leave empty until the shop supplies them. */
  images: ProductImage[];
  /** Representative photo of the part type, used when there is no photo of the exact item. */
  photo?: PhotoKey;

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
   * True for demo catalogue records that are not confirmed store inventory.
   * Demo products carry a visible label, are excluded from the sitemap and set to noindex.
   */
  isSample?: boolean;
}

/** The image a product actually displays, after falling back through the photo chain. */
export interface DisplayImage {
  src: string;
  alt: string;
  /** True when this is a photo of the part type rather than the exact item. */
  representative: boolean;
  position?: string;
}

/** A product joined with the records it references, ready for display. */
export interface ProductView extends Product {
  categoryName: string;
  categoryIcon: CategoryIcon;
  subcategoryName?: string;
  models: MotorcycleModel[];
  brands: Brand[];
  displayImage?: DisplayImage;
}
