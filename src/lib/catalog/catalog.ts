import { cache } from "react";
import { business } from "@/config/business";
import { getPhoto, type PhotoKey } from "@/config/images";
import { popularPartLinks } from "@/data/categories";
import { brandFeatureModelId } from "@/lib/images";
import { repository } from "./repository";
import type {
  BikeClass,
  Brand,
  CategoryGroup,
  CategoryIcon,
  DisplayImage,
  ModelStatus,
  MotorcycleModel,
  PartArtKind,
  Product,
  ProductView,
  Subcategory,
} from "@/lib/types";

/**
 * Catalogue service: joins raw records into display-ready views and answers
 * the questions pages ask. All reads go through `loadCatalog`, cached per request.
 */

export interface Catalog {
  products: ProductView[];
  brands: Brand[];
  models: MotorcycleModel[];
  groups: CategoryGroup[];
  brandBySlug: Map<string, Brand>;
  modelById: Map<string, MotorcycleModel>;
  productBySlug: Map<string, ProductView>;
}

export interface ResolvedCategory {
  group: CategoryGroup;
  sub?: Subcategory;
  /** Display name of whichever level the slug resolved to. */
  name: string;
  slug: string;
}

export const loadCatalog = cache(async (): Promise<Catalog> => {
  const [rawProducts, brands, models, groups] = await Promise.all([
    repository.listProducts(),
    repository.listBrands(),
    repository.listModels(),
    repository.listCategoryGroups(),
  ]);
  const brandBySlug = new Map(brands.map((b) => [b.slug, b]));
  const modelById = new Map(models.map((m) => [m.id, m]));
  const groupBySlug = new Map(groups.map((g) => [g.slug, g]));

  const products = rawProducts.map((p) => toView(p, groupBySlug, modelById, brandBySlug));
  const productBySlug = new Map(products.map((p) => [p.slug, p]));
  return { products, brands, models, groups, brandBySlug, modelById, productBySlug };
});

/**
 * Photo a product shows, in priority order:
 * 1. a photo of the exact item, 2. its own representative photo, 3. its subcategory's photo, which
 * is only set where the photo really shows that part type. The broad category photo is never used
 * for a product (a brake pad must not show a disc). Without a photo the UI shows the part-type
 * illustration (`art`). Steps 2–3 are flagged `representative` so the page can say so.
 */
export function resolveProductImage(product: Product, _group?: CategoryGroup, sub?: Subcategory): DisplayImage | undefined {
  const actual = product.images[0];
  if (actual) return { src: actual.src, alt: actual.alt, representative: false };
  const key: PhotoKey | undefined = product.photo ?? sub?.image;
  const photo = getPhoto(key);
  if (!photo) return undefined;
  return {
    src: photo.src,
    alt: `Representative photo: ${photo.alt.charAt(0).toLowerCase()}${photo.alt.slice(1)}`,
    representative: true,
    position: photo.position,
  };
}

function toView(
  product: Product,
  groupBySlug: Map<string, CategoryGroup>,
  modelById: Map<string, MotorcycleModel>,
  brandBySlug: Map<string, Brand>,
): ProductView {
  const group = groupBySlug.get(product.category);
  const sub = group?.subcategories.find((s) => s.slug === product.subcategory);
  const productModels = product.compatibleModels
    .map((id) => modelById.get(id))
    .filter((m): m is MotorcycleModel => Boolean(m));
  const brandSlugs = [...new Set(productModels.map((m) => m.brand))];
  return {
    ...product,
    categoryName: group?.name ?? product.category,
    categoryIcon: group?.icon ?? "accessories",
    subcategoryName: sub?.name,
    models: productModels,
    brands: brandSlugs.map((s) => brandBySlug.get(s)).filter((b): b is Brand => Boolean(b)),
    displayImage: resolveProductImage(product, group, sub),
    art: sub?.art,
  };
}

/**
 * The official variants of one model that a product is limited to. Empty means it fits every
 * variant (or the model has no variant data).
 */
export function variantsFor(product: Pick<Product, "compatibleVariants">, model: MotorcycleModel): string[] {
  const names = new Set((model.variants ?? []).map((v) => v.name));
  return (product.compatibleVariants ?? []).filter((v) => names.has(v));
}

export function resolveCategory(groups: CategoryGroup[], slug: string): ResolvedCategory | undefined {
  for (const group of groups) {
    if (group.slug === slug) return { group, name: group.name, slug };
    const sub = group.subcategories.find((s) => s.slug === slug);
    if (sub) return { group, sub, name: sub.name, slug };
  }
  return undefined;
}

/** Photo for a category or subcategory slug, falling back from subcategory to its group. */
export function categoryPhotoKey(groups: CategoryGroup[], slug: string): PhotoKey | undefined {
  const cat = resolveCategory(groups, slug);
  return cat?.sub?.image ?? cat?.group.image;
}

export { categoryPath, dedicatedCategoryPaths } from "./paths";

export function productInCategory(product: Product, slug: string): boolean {
  return product.category === slug || product.subcategory === slug;
}

export function productFitsModel(product: Product, modelId: string): boolean {
  return product.compatibleModels.includes(modelId);
}

export function productFitsBrand(product: ProductView, brandSlug: string): boolean {
  return product.brands.some((b) => b.slug === brandSlug);
}

export function modelDisplayName(model: MotorcycleModel, brands: Map<string, Brand>): string {
  const brand = brands.get(model.brand);
  return brand ? `${brand.name} ${model.name}` : model.name;
}

const statusOrder: Record<ModelStatus, number> = { "bd-current": 0, "bd-earlier": 1, "official-other": 2 };

export const modelStatusLabels: Record<ModelStatus, string> = {
  "bd-current": "Current Bangladesh model",
  "bd-earlier": "Earlier Bangladesh model",
  "official-other": "Not in the Bangladesh line-up",
};

/** Models of a brand: current Bangladesh models first, then earlier, then other markets. */
export function modelsForBrand(catalog: Catalog, brandSlug: string): MotorcycleModel[] {
  return catalog.models
    .filter((m) => m.brand === brandSlug)
    .map((m, i) => ({ m, i }))
    .sort((a, b) => statusOrder[a.m.status] - statusOrder[b.m.status] || a.i - b.i)
    .map(({ m }) => m);
}

/** The model that stands for a brand on cards and banners (set in the image manifest). */
export function brandFeatureModel(catalog: Catalog, brandSlug: string): MotorcycleModel | undefined {
  const id = brandFeatureModelId(brandSlug);
  return (id ? catalog.modelById.get(id) : undefined) ?? modelsForBrand(catalog, brandSlug)[0];
}

/** Body style drawn for a brand: its feature model's. */
export function brandBikeClass(catalog: Catalog, brandSlug: string): BikeClass {
  return brandFeatureModel(catalog, brandSlug)?.class ?? "street";
}

/**
 * Brands in the order the shop presents them: its dealerships first (business card order), then
 * the brands it sells original parts for, then any others.
 */
export function brandsByRelation(catalog: Catalog): Brand[] {
  const rank = (slug: string) => {
    const d = business.dealerships.findIndex((x) => x.brand === slug);
    if (d >= 0) return d;
    const o = (business.originalPartsBrands as readonly string[]).indexOf(slug);
    return o >= 0 ? 100 + o : 200;
  };
  return catalog.brands
    .map((b, i) => ({ b, i }))
    .sort((x, y) => rank(x.b.slug) - rank(y.b.slug) || x.i - y.i)
    .map(({ b }) => b);
}

export function countBy<T>(items: T[], key: (item: T) => string[]): Map<string, number> {
  const counts = new Map<string, number>();
  for (const item of items) {
    for (const k of new Set(key(item))) counts.set(k, (counts.get(k) ?? 0) + 1);
  }
  return counts;
}

/** Product counts per category slug (groups and subcategories both counted). */
export function categoryCounts(products: Product[]): Map<string, number> {
  return countBy(products, (p) => [p.category, ...(p.subcategory ? [p.subcategory] : [])]);
}

/** Category groups (with counts) that have listed parts for one model. */
export function modelCategoryGroups(catalog: Catalog, modelId: string): { group: CategoryGroup; count: number }[] {
  const counts = categoryCounts(catalog.products.filter((p) => productFitsModel(p, modelId)));
  return catalog.groups.filter((g) => counts.has(g.slug)).map((g) => ({ group: g, count: counts.get(g.slug)! }));
}

export interface PopularPart {
  label: string;
  slug: string;
  count: number;
  image?: PhotoKey;
  /** Line drawing of the part type, when there is one. */
  art?: PartArtKind;
  icon: CategoryIcon;
}

/** Popular part types for the homepage, with live listing counts and imagery. */
export function popularParts(catalog: Catalog): PopularPart[] {
  const counts = categoryCounts(catalog.products);
  return popularPartLinks.flatMap((p) => {
    const cat = resolveCategory(catalog.groups, p.slug);
    if (!cat) return [];
    return [
      { ...p, count: counts.get(p.slug) ?? 0, image: cat.sub?.image ?? cat.group.image, art: cat.sub?.art, icon: cat.group.icon },
    ];
  });
}

/** True while any listed item is a catalogue entry rather than confirmed stock. */
export function hasCatalogueOnly(catalog: Catalog): boolean {
  return catalog.products.some((p) => p.inventoryStatus === "catalogue-only");
}

function popularity(p: Product): number {
  return (p.isPopular ? 4 : 0) + (p.isFeatured ? 2 : 0) + (p.isFastMoving ? 1 : 0);
}

/**
 * Most popular first, interleaved by category so a short list covers different needs
 * (brakes, chain, filters…) instead of six brake pads in a row.
 */
export function spreadByCategory(products: ProductView[], limit: number): ProductView[] {
  const sorted = [...products].sort((a, b) => popularity(b) - popularity(a));
  const byCategory = new Map<string, ProductView[]>();
  for (const p of sorted) byCategory.set(p.category, [...(byCategory.get(p.category) ?? []), p]);
  const queues = [...byCategory.values()];
  const out: ProductView[] = [];
  while (out.length < limit && queues.some((q) => q.length > 0)) {
    for (const q of queues) {
      const next = q.shift();
      if (next) out.push(next);
      if (out.length >= limit) break;
    }
  }
  return out;
}

/** Popular parts for one bike: listed products that fit it, spread across categories. */
export function popularForModel(catalog: Catalog, modelId: string, limit = 8): ProductView[] {
  return spreadByCategory(
    catalog.products.filter((p) => productFitsModel(p, modelId)),
    limit,
  );
}

/**
 * Subcategory pairings for routine maintenance, e.g. brake pads with brake fluid.
 * These link part types, never specific products, so no fitment is implied.
 */
const maintenancePairings: Record<string, string[]> = {
  "brake-pads": ["brake-fluid", "cleaners", "brake-disc"],
  "brake-disc": ["brake-pads", "brake-fluid"],
  "brake-shoe": ["brake-hardware", "brake-cable"],
  "brake-caliper": ["brake-pads", "brake-fluid"],
  "master-cylinder": ["brake-fluid", "brake-hose"],
  "chain-sprocket-kit": ["chain-lubricant", "cleaners", "cleaning-tools"],
  chain: ["sprocket", "chain-lubricant", "cleaners"],
  sprocket: ["chain", "chain-lubricant"],
  "air-filter": ["oil-filter", "engine-oil", "spark-plug"],
  "oil-filter": ["engine-oil", "air-filter"],
  "engine-oil": ["oil-filter", "air-filter"],
  "spark-plug": ["air-filter", "plug-cap"],
  "clutch-plate": ["clutch-cable", "gasket", "clutch-spring"],
  "clutch-cable": ["clutch-plate", "clutch-lever"],
  piston: ["piston-ring", "gasket", "timing-chain"],
  "piston-ring": ["piston", "gasket"],
  "cylinder-block": ["piston", "gasket"],
  "timing-chain": ["gasket"],
  battery: ["fuse", "rectifier", "usb-charger"],
  "cvt-belt": ["gear-oil"],
  "fork-seal": ["fork-oil", "front-fork"],
  tyres: ["tubes", "wheel-bearing"],
  carburetor: ["carb-kit", "cleaners", "intake"],
};

export interface RelatedRail {
  title: string;
  products: ProductView[];
}

export function relatedProducts(catalog: Catalog, product: ProductView, perRail = 4): RelatedRail[] {
  const used = new Set([product.id]);
  const take = (candidates: ProductView[]) => {
    const picked = candidates.filter((p) => !used.has(p.id)).slice(0, perRail);
    picked.forEach((p) => used.add(p.id));
    return picked;
  };
  const rails: RelatedRail[] = [];
  const fitsSameBike = (p: ProductView) => product.models.some((m) => productFitsModel(p, m.id));

  const pairs = product.subcategory ? maintenancePairings[product.subcategory] ?? [] : [];
  if (pairs.length > 0) {
    // Same-bike parts first, then items that are not model-specific; never another bike's part.
    const paired = catalog.products
      .filter((p) => p.subcategory && pairs.includes(p.subcategory))
      .filter((p) => fitsSameBike(p) || p.fitment !== "model-specific")
      .sort((a, b) => Number(fitsSameBike(b)) - Number(fitsSameBike(a)) || pairs.indexOf(a.subcategory!) - pairs.indexOf(b.subcategory!));
    rails.push({ title: "Often used together", products: take(paired) });
  }

  if (product.models.length > 0) {
    const first = product.models[0];
    rails.push({
      title: `More parts for the ${modelDisplayName(first, catalog.brandBySlug)}`,
      products: take(catalog.products.filter(fitsSameBike)),
    });
  }

  if (product.subcategory) {
    const sameType = catalog.products.filter((p) => p.subcategory === product.subcategory);
    rails.push({ title: `Other ${product.subcategoryName ?? product.categoryName}`, products: take(sameType) });
  }

  return rails.filter((r) => r.products.length > 0);
}
