import { PAGE_SIZE } from "@/config/site";
import { productFitsBrand, productFitsModel, productInCategory, type Catalog } from "./catalog";
import { buildSearchIndex, searchProducts, type SearchMode } from "./search";
import { authenticityLabels, confidenceLabels, inventoryStatusLabels } from "./labels";
import type { Authenticity, CompatibilityConfidence, InventoryStatus, ProductView } from "@/lib/types";

/**
 * Filtering, sorting and facets for every product listing (shop, search,
 * category, brand, model pages). State lives in the URL query string so
 * filtered views can be shared and work without JavaScript.
 */

export type SortKey = "relevance" | "popular" | "name" | "newest" | "price-asc" | "price-desc";

export const sortLabels: Record<SortKey, string> = {
  relevance: "Best match",
  popular: "Popular",
  name: "Name (A–Z)",
  newest: "Newest",
  "price-asc": "Price: low to high",
  "price-desc": "Price: high to low",
};

export interface ListingParams {
  q: string;
  brands: string[];
  models: string[];
  categories: string[];
  /** Maker of the item itself (e.g. a helmet brand or spark plug maker), by slug. */
  makers: string[];
  types: Authenticity[];
  availability: InventoryStatus[];
  fitment: CompatibilityConfidence[];
  minPrice?: number;
  maxPrice?: number;
  sort?: SortKey;
  page: number;
}

/** Fixed constraint from the page itself, e.g. a brand page is always scoped to that brand. */
export interface ListingScope {
  brand?: string;
  model?: string;
  category?: string;
}

type RawParams = Record<string, string | string[] | undefined>;

function list(value: string | string[] | undefined): string[] {
  if (value === undefined) return [];
  return (Array.isArray(value) ? value : [value]).flatMap((v) => v.split(",")).map((v) => v.trim()).filter(Boolean);
}

/** URL value for a maker name: "MT Helmets" → "mt-helmets". */
export function makerSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function positiveInt(value: string | string[] | undefined): number | undefined {
  const raw = Array.isArray(value) ? value[0] : value;
  if (!raw) return undefined;
  const n = Number(raw);
  return Number.isFinite(n) && n >= 0 ? Math.floor(n) : undefined;
}

export function parseListingParams(raw: RawParams): ListingParams {
  const sort = (Array.isArray(raw.sort) ? raw.sort[0] : raw.sort) as SortKey | undefined;
  const q = (Array.isArray(raw.q) ? raw.q[0] : raw.q) ?? "";
  return {
    q: q.slice(0, 120).trim(),
    brands: list(raw.brand),
    models: list(raw.model),
    categories: list(raw.category),
    makers: list(raw.maker),
    types: list(raw.type).filter((t): t is Authenticity => t in authenticityLabels),
    availability: list(raw.availability).filter((s): s is InventoryStatus => s in inventoryStatusLabels),
    fitment: list(raw.fit).filter((f): f is CompatibilityConfidence => f in confidenceLabels),
    minPrice: positiveInt(raw.min),
    maxPrice: positiveInt(raw.max),
    sort: sort && sort in sortLabels ? sort : undefined,
    page: Math.max(1, positiveInt(raw.page) ?? 1),
  };
}

export interface FacetOption {
  value: string;
  label: string;
  count: number;
  selected: boolean;
}

export interface Facets {
  brands: FacetOption[];
  models: FacetOption[];
  categories: FacetOption[];
  makers: FacetOption[];
  types: FacetOption[];
  availability: FacetOption[];
  fitment: FacetOption[];
  price?: { min: number; max: number };
}

export interface ListingResult {
  items: ProductView[];
  total: number;
  page: number;
  pageCount: number;
  facets: Facets;
  sortOptions: SortKey[];
  sort: SortKey;
  searchMode?: SearchMode;
  /** Number of active filters (not counting the search query or scope). */
  activeFilterCount: number;
}

function option(value: string, label: string, count: number, selected: string[]): FacetOption {
  return { value, label, count, selected: selected.includes(value) };
}

function tally(products: ProductView[], key: (p: ProductView) => string[]): Map<string, number> {
  const counts = new Map<string, number>();
  for (const p of products) for (const k of new Set(key(p))) counts.set(k, (counts.get(k) ?? 0) + 1);
  return counts;
}

export function runListing(catalog: Catalog, params: ListingParams, scope: ListingScope = {}): ListingResult {
  // 1. Scope: the page's fixed constraint.
  let base = catalog.products.filter(
    (p) =>
      (!scope.brand || productFitsBrand(p, scope.brand)) &&
      (!scope.model || productFitsModel(p, scope.model)) &&
      (!scope.category || productInCategory(p, scope.category)),
  );

  // 2. Search query.
  let searchMode: SearchMode | undefined;
  const relevance = new Map<string, number>();
  if (params.q) {
    const result = searchProducts(buildSearchIndex(base, { groups: catalog.groups }), params.q);
    searchMode = result.mode;
    result.hits.forEach((h) => relevance.set(h.product.id, h.score));
    base = result.hits.map((h) => h.product);
  }

  // 3. Facets are counted on the scoped + searched set.
  const facets = buildFacets(catalog, base, params, scope);

  // 4. Filters. Only values that exist as facet options apply, so stale URLs cannot empty the page silently.
  const valid = (selected: string[], options: FacetOption[]) =>
    selected.filter((v) => options.some((o) => o.value === v));
  const brandSel = valid(params.brands, facets.brands);
  const modelSel = valid(params.models, facets.models);
  const categorySel = valid(params.categories, facets.categories);
  const makerSel = valid(params.makers, facets.makers);
  const typeSel = valid(params.types, facets.types);
  const availSel = valid(params.availability, facets.availability);
  const fitSel = valid(params.fitment, facets.fitment);
  const priceActive = Boolean(facets.price) && (params.minPrice !== undefined || params.maxPrice !== undefined);

  const filtered = base.filter(
    (p) =>
      (brandSel.length === 0 || brandSel.some((b) => productFitsBrand(p, b))) &&
      (modelSel.length === 0 || modelSel.some((m) => productFitsModel(p, m))) &&
      (categorySel.length === 0 || categorySel.some((c) => productInCategory(p, c))) &&
      (makerSel.length === 0 || (p.partBrand !== undefined && makerSel.includes(makerSlug(p.partBrand)))) &&
      (typeSel.length === 0 || typeSel.includes(p.authenticity)) &&
      (availSel.length === 0 || availSel.includes(p.inventoryStatus)) &&
      (fitSel.length === 0 || fitSel.includes(p.compatibilityConfidence)) &&
      (!priceActive ||
        (p.price !== undefined &&
          (params.minPrice === undefined || p.price >= params.minPrice) &&
          (params.maxPrice === undefined || p.price <= params.maxPrice))),
  );

  // 5. Sort.
  const sortOptions = availableSorts(base, Boolean(params.q));
  const sort = params.sort && sortOptions.includes(params.sort) ? params.sort : sortOptions[0];
  const sorted = sortProducts(filtered, sort, relevance);

  // 6. Page.
  const pageCount = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const page = Math.min(params.page, pageCount);
  const items = sorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return {
    items,
    total: sorted.length,
    page,
    pageCount,
    facets,
    sortOptions,
    sort,
    searchMode,
    activeFilterCount:
      brandSel.length +
      modelSel.length +
      categorySel.length +
      makerSel.length +
      typeSel.length +
      availSel.length +
      fitSel.length +
      (priceActive ? 1 : 0),
  };
}

function buildFacets(catalog: Catalog, base: ProductView[], params: ListingParams, scope: ListingScope): Facets {
  const brandCounts = tally(base, (p) => p.brands.map((b) => b.slug));
  const brands = scope.brand || scope.model
    ? []
    : catalog.brands
        .filter((b) => brandCounts.has(b.slug))
        .map((b) => option(b.slug, b.name, brandCounts.get(b.slug)!, params.brands));

  // Narrow model options to the chosen brands so the list stays short.
  const modelCounts = tally(base, (p) => p.compatibleModels);
  const brandFilter = scope.brand ? [scope.brand] : params.brands;
  const models = scope.model
    ? []
    : catalog.models
        .filter((m) => modelCounts.has(m.id) && (brandFilter.length === 0 || brandFilter.includes(m.brand)))
        .map((m) => {
          const prefix = scope.brand ? "" : `${catalog.brandBySlug.get(m.brand)?.name ?? ""} `;
          return option(m.id, `${prefix}${m.name}`.trim(), modelCounts.get(m.id)!, params.models);
        });

  let categories: FacetOption[] = [];
  const scopedGroup = scope.category ? catalog.groups.find((g) => g.slug === scope.category) : undefined;
  if (scopedGroup) {
    const counts = tally(base, (p) => (p.subcategory ? [p.subcategory] : []));
    categories = scopedGroup.subcategories
      .filter((s) => counts.has(s.slug))
      .map((s) => option(s.slug, s.name, counts.get(s.slug)!, params.categories));
  } else if (!scope.category) {
    const counts = tally(base, (p) => [p.category]);
    categories = catalog.groups
      .filter((g) => counts.has(g.slug))
      .map((g) => option(g.slug, g.name, counts.get(g.slug)!, params.categories));
  }

  // Makers (helmet brands, plug makers…), most items first; only offered when there is a choice.
  const makerNames = new Map<string, string>();
  for (const p of base) if (p.partBrand) makerNames.set(makerSlug(p.partBrand), p.partBrand);
  const makerCounts = tally(base, (p) => (p.partBrand ? [makerSlug(p.partBrand)] : []));
  const makers = [...makerNames]
    .map(([slug, name]) => option(slug, name, makerCounts.get(slug)!, params.makers))
    .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label));

  // Only offer a filter when it can actually narrow the results.
  const typeCounts = tally(base, (p) => [p.authenticity]);
  const hasKnownType = [...typeCounts.keys()].some((t) => t !== "unknown");
  const types =
    typeCounts.size > 1 && hasKnownType
      ? (Object.keys(authenticityLabels) as Authenticity[])
          .filter((t) => t !== "unknown" && typeCounts.has(t))
          .map((t) => option(t, authenticityLabels[t], typeCounts.get(t)!, params.types))
      : [];

  const stockCounts = tally(base, (p) => [p.inventoryStatus]);
  const availability =
    stockCounts.size > 1
      ? (Object.keys(inventoryStatusLabels) as InventoryStatus[])
          .filter((s) => stockCounts.has(s))
          .map((s) => option(s, inventoryStatusLabels[s], stockCounts.get(s)!, params.availability))
      : [];

  const fitCounts = tally(base, (p) => [p.compatibilityConfidence]);
  const fitment =
    fitCounts.size > 1
      ? (Object.keys(confidenceLabels) as CompatibilityConfidence[])
          .filter((f) => fitCounts.has(f))
          .map((f) => option(f, confidenceLabels[f], fitCounts.get(f)!, params.fitment))
      : [];

  const prices = base.map((p) => p.price).filter((p): p is number => p !== undefined);
  const price = prices.length >= 2 ? { min: Math.min(...prices), max: Math.max(...prices) } : undefined;

  return {
    brands: brands.length > 1 || params.brands.length > 0 ? brands : [],
    models: models.length > 1 || params.models.length > 0 ? models : [],
    categories: categories.length > 1 || params.categories.length > 0 ? categories : [],
    makers: makers.length > 1 || params.makers.length > 0 ? makers : [],
    types,
    availability,
    fitment,
    price,
  };
}

export function hasFacets(facets: Facets): boolean {
  return (
    facets.brands.length > 0 ||
    facets.models.length > 0 ||
    facets.categories.length > 0 ||
    facets.makers.length > 0 ||
    facets.types.length > 0 ||
    facets.availability.length > 0 ||
    facets.fitment.length > 0 ||
    Boolean(facets.price)
  );
}

function availableSorts(products: ProductView[], hasQuery: boolean): SortKey[] {
  const sorts: SortKey[] = hasQuery ? ["relevance", "popular", "name"] : ["popular", "name"];
  if (products.some((p) => p.createdAt)) sorts.push("newest");
  if (products.filter((p) => p.price !== undefined).length >= 2) sorts.push("price-asc", "price-desc");
  return sorts;
}

function popularity(p: ProductView): number {
  return (p.isPopular ? 4 : 0) + (p.isFeatured ? 2 : 0) + (p.isFastMoving ? 1 : 0);
}

export function sortProducts(products: ProductView[], sort: SortKey, relevance = new Map<string, number>()): ProductView[] {
  const byName = (a: ProductView, b: ProductView) => a.name.localeCompare(b.name);
  const copy = [...products];
  switch (sort) {
    case "relevance":
      return copy.sort((a, b) => (relevance.get(b.id) ?? 0) - (relevance.get(a.id) ?? 0) || byName(a, b));
    case "popular":
      return copy.sort((a, b) => popularity(b) - popularity(a) || byName(a, b));
    case "newest":
      return copy.sort((a, b) => (b.createdAt ?? "").localeCompare(a.createdAt ?? "") || byName(a, b));
    case "price-asc":
    case "price-desc": {
      const dir = sort === "price-asc" ? 1 : -1;
      // Unpriced items go last in both directions.
      return copy.sort((a, b) => {
        if (a.price === undefined && b.price === undefined) return byName(a, b);
        if (a.price === undefined) return 1;
        if (b.price === undefined) return -1;
        return (a.price - b.price) * dir || byName(a, b);
      });
    }
    default:
      return copy.sort(byName);
  }
}

/** Serialise params back to a query string, applying overrides. Empty values are dropped. */
export function listingHref(
  basePath: string,
  params: ListingParams,
  overrides: Partial<
    Record<"q" | "brand" | "model" | "category" | "maker" | "type" | "availability" | "fit" | "sort" | "page" | "min" | "max", string | string[] | undefined>
  > = {},
): string {
  const current: Record<string, string | string[] | undefined> = {
    q: params.q || undefined,
    brand: params.brands,
    model: params.models,
    category: params.categories,
    maker: params.makers,
    type: params.types,
    availability: params.availability,
    fit: params.fitment,
    min: params.minPrice?.toString(),
    max: params.maxPrice?.toString(),
    sort: params.sort,
    page: params.page > 1 ? String(params.page) : undefined,
  };
  const merged = { ...current, ...overrides };
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(merged)) {
    if (value === undefined) continue;
    for (const v of Array.isArray(value) ? value : [value]) if (v) search.append(key, v);
  }
  const qs = search.toString();
  return qs ? `${basePath}?${qs}` : basePath;
}
