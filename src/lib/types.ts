import type { PhotoKey } from "@/config/photos";

/**
 * Catalogue domain types. Text fields accept any Unicode, so Bangla names and
 * descriptions can be stored alongside English ones (the optional *Bn fields).
 */

/**
 * Physical stock, which is separate from being in the catalogue. "catalogue-only" means the part is
 * listed so customers can find and ask for it, but the shop has not confirmed it is on the shelf.
 */
export type InventoryStatus =
  | "in-stock"
  | "low-stock"
  | "out-of-stock"
  | "available-on-request"
  | "call-to-confirm"
  | "catalogue-only";

/** live: shown. draft: hidden from the site. demo: placeholder data, labelled as such. */
export type ProductStatus = "live" | "draft" | "demo";

/** Only set to something other than "unknown" when the store has verified it. */
export type Authenticity = "genuine" | "oem" | "aftermarket" | "compatible" | "unknown";

/**
 * How sure the listed fitment is:
 * verified             checked against the part itself
 * manufacturer-listed  the manufacturer's own source names this part, size or spec for the model
 * store-confirmed      the shop has confirmed the fit
 * needs-confirmation   a reasonable part type for the model; the exact fit must be confirmed
 */
export type CompatibilityConfidence = "verified" | "manufacturer-listed" | "store-confirmed" | "needs-confirmation";

export type SourceType =
  | "official-bangladesh"
  | "official-manufacturer"
  | "historical-catalogue"
  | "retailer-reference"
  | "store-supplied"
  | "demo";

/** Where a catalogue record comes from, so it can be re-verified later. */
export interface ProductSource {
  type: SourceType;
  name: string;
  url?: string;
}

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
  /** Model family as the manufacturer groups it, e.g. "Pulsar". */
  family?: string;
  /** Official per-variant specifications, where they have been collected. */
  variants?: VariantSpec[];
  /** Maintenance facts from the official owner's manual, where it has been read. */
  manual?: OwnerManualFacts;
}

/**
 * Parts-relevant maintenance facts restated from an official owner's manual (no copied text or images).
 * A manual can be an older edition than the current line-up, so these sit apart from `variants`.
 */
export interface OwnerManualFacts {
  /** Models and edition the manual covers, as printed. */
  covers: string;
  /** Official PDF. */
  source: string;
  checked: string;
  engineOil?: {
    grade: string;
    /** Oil to add at a routine oil change. */
    serviceFillMl?: number;
    overhaulFillMl?: number;
    changeEvery?: string;
    topUpEvery?: string;
  };
  sparkPlug?: { types: string; count?: number; gap?: string };
  battery?: string;
  brakeFluid?: string;
  /** Wear-part replacement intervals as stated, e.g. "Brake shoes and pads: every 15,000 km". */
  replaceIntervals?: string[];
  tyrePressurePsi?: { front: number; rearSolo: number; rearPillion: number };
  chain?: { slackMm: string; lubrication?: string };
  bulbs?: { label: string; value: string }[];
  fuelSystem?: FuelSystem;
  /** Service visits, e.g. "500–750 km, 4,500–5,000 km, 9,500–10,000 km, then every 5,000 km". */
  serviceSchedule?: string;
  /** Contradictions or gaps in the manual itself. */
  notes?: string[];
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
  /** Photo that actually shows this part type. Leave unset rather than use a loosely related photo. */
  image?: PhotoKey;
  /** Line illustration used for products when there is no accurate photo. */
  art?: PartArtKind;
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
  /** URL of the official page the value comes from. Required for anything not supplied by the shop. */
  source?: string;
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

  inventoryStatus: InventoryStatus;
  quantityAvailable?: number;
  productStatus: ProductStatus;

  authenticity: Authenticity;

  fitment: Fitment;
  /**
   * Motorcycle model ids. Compatible brands are derived from these. For a universal item
   * (e.g. an oil grade) these are the models whose manufacturer recommends it.
   */
  compatibleModels: string[];
  /**
   * Official variant names the part is limited to, e.g. ["Pulsar 150 TD", "Pulsar 150 TD ABS"].
   * A compatible model with none of its variants listed here fits in every variant.
   */
  compatibleVariants?: string[];
  compatibilityConfidence: CompatibilityConfidence;
  source: ProductSource;

  /** Only facts from a cited source; never estimated. */
  specifications?: ProductSpec[];
  features?: string[];
  tags?: string[];
  searchableAliases?: string[];

  isFeatured?: boolean;
  isPopular?: boolean;
  /** Routine wear part (pads, filters, cables…), used to order popular-part lists. */
  isFastMoving?: boolean;
  isNew?: boolean;
  /** Fitment or sourcing notes shown on the product page. */
  notes?: string[];

  createdAt?: string;
  updatedAt?: string;
}

/** The image a product actually displays, after falling back through the photo chain. */
export interface DisplayImage {
  src: string;
  alt: string;
  /** True when this is a photo of the part type rather than the exact item. */
  representative: boolean;
  position?: string;
}

/** Line illustration of a part type, used when no accurate photo exists. See components/parts/PartArt. */
export type PartArtKind =
  | "brake-pad"
  | "brake-shoe"
  | "lever"
  | "hose"
  | "switch"
  | "fastener"
  | "panel"
  | "seal"
  | "piston"
  | "gasket"
  | "valve"
  | "gear"
  | "clutch-plate"
  | "battery"
  | "module"
  | "coil"
  | "bulb"
  | "cable"
  | "meter"
  | "injector"
  | "bottle"
  | "spray"
  | "lamp"
  | "stand"
  | "spring"
  | "chain"
  | "belt"
  | "motor"
  | "stator"
  | "tube"
  | "horn"
  | "fuse"
  | "guard"
  | "peg"
  | "shaft"
  | "tap"
  | "plug-cap"
  | "jets"
  | "throttle-body"
  | "bush"
  | "charger"
  | "grip"
  | "inline-filter"
  | "reservoir";

/** A product joined with the records it references, ready for display. */
export interface ProductView extends Product {
  categoryName: string;
  categoryIcon: CategoryIcon;
  subcategoryName?: string;
  models: MotorcycleModel[];
  brands: Brand[];
  displayImage?: DisplayImage;
  /** Illustration for the part type, shown when there is no accurate photo. */
  art?: PartArtKind;
}
