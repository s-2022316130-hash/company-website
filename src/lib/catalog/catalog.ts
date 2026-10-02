import { cache } from "react";
import { popularPartLinks } from "@/data/categories";
import { repository } from "./repository";
import type { Brand, CategoryGroup, MotorcycleModel, Product, ProductView, Subcategory } from "@/lib/types";

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
  };
}

export function resolveCategory(groups: CategoryGroup[], slug: string): ResolvedCategory | undefined {
  for (const group of groups) {
    if (group.slug === slug) return { group, name: group.name, slug };
    const sub = group.subcategories.find((s) => s.slug === slug);
    if (sub) return { group, sub, name: sub.name, slug };
  }
  return undefined;
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

export function modelsForBrand(catalog: Catalog, brandSlug: string): MotorcycleModel[] {
  return catalog.models.filter((m) => m.brand === brandSlug);
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

export interface PopularPart {
  label: string;
  slug: string;
  count: number;
}

/** Popular part types for the homepage, with live listing counts. */
export function popularParts(catalog: Catalog): PopularPart[] {
  const counts = categoryCounts(catalog.products);
  return popularPartLinks
    .filter((p) => resolveCategory(catalog.groups, p.slug))
    .map((p) => ({ ...p, count: counts.get(p.slug) ?? 0 }));
}

export function hasSampleProducts(catalog: Catalog): boolean {
  return catalog.products.some((p) => p.isSample);
}

/**
 * Subcategory pairings for routine maintenance, e.g. brake pads with brake fluid.
 * These link categories, never specific products, so no fitment is implied.
 */
const maintenancePairings: Record<string, string[]> = {
  "brake-pads": ["brake-fluid"],
  "brake-shoe": ["brake-cable"],
  "chain-sprocket-kit": ["chain-lubricant", "cleaning-care"],
  chain: ["chain-lubricant", "cleaning-care"],
  sprocket: ["chain-lubricant"],
  "air-filter": ["oil-filter", "spark-plug"],
  "oil-filter": ["engine-oil"],
  "engine-oil": ["oil-filter"],
  "spark-plug": ["air-filter"],
  "clutch-plate": ["clutch-cable", "engine-oil"],
  "clutch-cable": ["clutch-plate"],
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

  if (product.models.length > 0) {
    const first = product.models[0];
    const sameBike = catalog.products.filter((p) => product.models.some((m) => productFitsModel(p, m.id)));
    rails.push({ title: `More parts for the ${modelDisplayName(first, catalog.brandBySlug)}`, products: take(sameBike) });
  }

  const pairs = product.subcategory ? maintenancePairings[product.subcategory] ?? [] : [];
  if (pairs.length > 0) {
    const paired = catalog.products.filter((p) => p.subcategory && pairs.includes(p.subcategory));
    rails.push({ title: "Often replaced together", products: take(paired) });
  }

  if (product.subcategory) {
    const sameType = catalog.products.filter((p) => p.subcategory === product.subcategory);
    rails.push({ title: `Other ${product.subcategoryName ?? product.categoryName}`, products: take(sameType) });
  }

  return rails.filter((r) => r.products.length > 0);
}
