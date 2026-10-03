import { getPhoto, type PhotoKey } from "@/config/images";
import { searchAliases, searchStopWords } from "@/data/search-aliases";
import { motorcycleImage, shown } from "@/lib/images";
import { categoryPath } from "./paths";
import type { BikeClass, Brand, CategoryGroup, CategoryIcon, MotorcycleModel, PartArtKind, ProductView } from "@/lib/types";

/**
 * Product search tuned for how riders type: model shorthand ("fzs v3"),
 * local terms ("mobil"), Bangla words and partial input ("puls").
 */

const BANGLA_DIGITS = "০১২৩৪৫৬৭৮৯";

export function normalize(text: string): string {
  return text
    .normalize("NFC")
    .toLowerCase()
    .replace(/[০-৯]/g, (d) => String(BANGLA_DIGITS.indexOf(d)))
    .replace(/[^\p{L}\p{N}\p{M}]+/gu, " ")
    .trim()
    .replace(/\s+/g, " ");
}

const aliasEntries = Object.entries(searchAliases)
  .map(([from, to]) => [normalize(from), normalize(to)] as const)
  .sort((a, b) => b[0].length - a[0].length);

const escapeRegex = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// Whole-phrase match on space boundaries; \b does not work for Bangla script.
const aliasPattern = new RegExp(
  `(?<=^|\\s)(${aliasEntries.map(([from]) => escapeRegex(from)).join("|")})(?=\\s|$)`,
  "gu",
);
const aliasMap = new Map(aliasEntries);

export function applyAliases(normalized: string): string {
  if (!normalized) return normalized;
  return normalized.replace(aliasPattern, (m) => aliasMap.get(m) ?? m);
}

export function queryTokens(query: string): string[] {
  const expanded = applyAliases(normalize(query));
  const tokens = expanded.split(" ").filter((t) => t && !searchStopWords.has(t));
  return [...new Set(tokens)];
}

interface IndexedField {
  tokens: string[];
  weight: number;
}

export interface SearchIndexEntry {
  product: ProductView;
  fields: IndexedField[];
  /** Normalised name and part type padded with spaces, for whole-phrase matching. */
  namePhrase: string;
  typePhrase: string;
}

export interface SearchContext {
  groups: CategoryGroup[];
}

function tokensOf(...parts: (string | undefined)[]): string[] {
  return normalize(parts.filter(Boolean).join(" ")).split(" ").filter(Boolean);
}

export function buildSearchIndex(products: ProductView[], ctx: SearchContext): SearchIndexEntry[] {
  const groupBySlug = new Map(ctx.groups.map((g) => [g.slug, g]));
  return products.map((product) => {
    const group = groupBySlug.get(product.category);
    const sub = group?.subcategories.find((s) => s.slug === product.subcategory);
    return {
      product,
      fields: [
        { tokens: tokensOf(product.sku, product.partNumber), weight: 6 },
        { tokens: tokensOf(product.name, product.nameBn), weight: 3 },
        {
          tokens: tokensOf(
            ...product.models.flatMap((m) => [m.name, ...(m.aliases ?? [])]),
            ...product.brands.flatMap((b) => [b.name, b.nameBn]),
          ),
          weight: 2.5,
        },
        { tokens: tokensOf(sub?.name, ...(sub?.aliases ?? []).map((a) => applyAliases(normalize(a)))), weight: 2 },
        { tokens: tokensOf(group?.name, group?.nameBn, product.partBrand), weight: 1.5 },
        { tokens: tokensOf(...(product.tags ?? []), ...(product.searchableAliases ?? [])), weight: 1.5 },
        { tokens: tokensOf(product.shortDescription), weight: 0.5 },
      ],
      namePhrase: ` ${tokensOf(product.name).join(" ")} `,
      // Name plus aliases, so "engine oil" matches the "Engine Oils" part type.
      typePhrase: ` ${[sub?.name, ...(sub?.aliases ?? [])].map((t) => applyAliases(normalize(t ?? ""))).join(" | ")} `,
    };
  });
}

/** Fields at or above this weight (SKU, name, model, part type) count as a direct match. */
const STRONG_WEIGHT = 2;

/** Best score for one query token across all fields; score 0 means no match. */
function tokenScore(token: string, fields: IndexedField[]): { score: number; strong: boolean } {
  let best = 0;
  let strong = false;
  const numeric = /^\d+$/.test(token);
  for (const field of fields) {
    for (const docToken of field.tokens) {
      let s = 0;
      if (docToken === token) s = field.weight;
      // Prefix matching lets "puls" find "pulsar"; numbers must match exactly so 150 never matches 160.
      else if (!numeric && token.length >= 2 && docToken.startsWith(token)) s = field.weight * 0.7;
      // Singular/plural: "pads" vs "pad".
      else if (token.length >= 4 && (docToken === `${token}s` || `${docToken}s` === token)) s = field.weight * 0.9;
      if (s > 0 && field.weight >= STRONG_WEIGHT) strong = true;
      if (s > best) best = s;
    }
  }
  // A bare number ("150") says less than a word ("apache"), so "apache 150" ranks Apache parts
  // above every other 150 cc bike's parts.
  return { score: numeric ? best * 0.5 : best, strong };
}

export type SearchMode = "all" | "partial" | "none";

export interface SearchHit {
  product: ProductView;
  score: number;
}

export interface SearchResult {
  hits: SearchHit[];
  /** "all": every word matched. "partial": closest matches only. */
  mode: SearchMode;
  tokens: string[];
}

export function searchProducts(index: SearchIndexEntry[], query: string): SearchResult {
  const tokens = queryTokens(query);
  if (tokens.length === 0) return { hits: [], mode: "none", tokens };

  const full: (SearchHit & { strong: boolean })[] = [];
  const partial: (SearchHit & { matched: number })[] = [];

  for (const entry of index) {
    let score = 0;
    let matched = 0;
    let strong = true;
    for (const token of tokens) {
      const s = tokenScore(token, entry.fields);
      if (s.score > 0) matched += 1;
      if (!s.strong) strong = false;
      score += s.score;
    }
    if (matched === 0) continue;
    if (entry.product.isPopular) score += 0.25;
    // The whole query as a phrase beats the same words scattered across fields, and a phrase
    // naming the part type beats one inside a longer name: "engine oil" lists Engine Oil
    // before an "Engine Oil Seal Kit".
    if (tokens.length > 1) {
      const phrase = ` ${tokens.join(" ")} `;
      if (entry.namePhrase.includes(phrase)) score += 1;
      if (entry.typePhrase.includes(phrase)) score += 1;
    }
    if (matched === tokens.length) full.push({ product: entry.product, score, strong });
    else partial.push({ product: entry.product, score, matched });
  }

  if (full.length > 0) {
    // If some products match every word directly, drop ones that only match through their
    // category group or description (e.g. "engine oil" should not list brake fluid).
    const direct = full.filter((h) => h.strong);
    const hits = (direct.length > 0 ? direct : full).map(({ product, score }) => ({ product, score }));
    return { hits: hits.sort((a, b) => b.score - a.score), mode: "all", tokens };
  }
  if (partial.length > 0) {
    partial.sort((a, b) => b.matched - a.matched || b.score - a.score);
    return { hits: partial.map(({ product, score }) => ({ product, score })), mode: "partial", tokens };
  }
  return { hits: [], mode: "none", tokens };
}

/** Small image shown next to a suggestion. */
export type SuggestionThumb =
  | { kind: "photo"; src: string }
  | { kind: "art"; art: PartArtKind }
  | { kind: "bike"; bikeClass: BikeClass }
  | { kind: "icon"; icon: CategoryIcon };

/**
 * Thumbnail for a product suggestion: its photo, else the part-type illustration, else the category
 * icon. Never a motorcycle: the picture must show the part.
 */
export function productThumb(product: Pick<ProductView, "displayImage" | "art" | "categoryIcon">): SuggestionThumb {
  if (product.displayImage) return { kind: "photo", src: product.displayImage.src };
  if (product.art) return { kind: "art", art: product.art };
  return { kind: "icon", icon: product.categoryIcon };
}

/** "Bajaj · Pulsar N160", "Bajaj · Pulsar 150 +2", or the part type when no bike is listed. */
export function productSublabel(product: Pick<ProductView, "brands" | "models" | "subcategoryName" | "categoryName">): string {
  const brand = product.brands.length === 1 ? product.brands[0].name : product.brands.length > 1 ? "Multiple brands" : undefined;
  const [first, ...rest] = product.models;
  const bike = first ? `${first.name}${rest.length > 0 ? ` +${rest.length}` : ""}` : (product.subcategoryName ?? product.categoryName);
  return [brand, bike].filter(Boolean).join(" · ");
}

/** A model's suggestion thumbnail: its photo when one may be shown, otherwise its drawing. */
function modelThumb(model: MotorcycleModel, brandName: string): SuggestionThumb {
  const photo = shown(motorcycleImage(model, brandName));
  return photo ? { kind: "photo", src: photo.src } : { kind: "bike", bikeClass: model.class };
}

export interface Suggestion {
  kind: "product" | "model" | "category" | "search";
  label: string;
  sublabel?: string;
  href: string;
  thumb?: SuggestionThumb;
}

const statusRank: Record<MotorcycleModel["status"], number> = { "bd-current": 0, "bd-earlier": 1, "official-other": 2 };

function photoThumb(key: PhotoKey | undefined, icon: CategoryIcon): SuggestionThumb {
  const photo = getPhoto(key);
  return photo ? { kind: "photo", src: photo.src } : { kind: "icon", icon };
}

/** Models and categories whose names or aliases match every query word. */
export function suggestDirectory(
  query: string,
  models: MotorcycleModel[],
  brands: Map<string, Brand>,
  groups: CategoryGroup[],
  limit = 3,
): Suggestion[] {
  const tokens = queryTokens(query);
  if (tokens.length === 0) return [];
  const matchesAll = (fieldTokens: string[]) =>
    tokens.every((t) => fieldTokens.some((d) => d === t || (!/^\d+$/.test(t) && d.startsWith(t))));

  const modelHits: { suggestion: Suggestion; rank: number }[] = [];
  for (const m of models) {
    const brand = brands.get(m.brand);
    if (matchesAll(tokensOf(brand?.name, brand?.nameBn, m.name, ...(m.aliases ?? [])))) {
      modelHits.push({
        suggestion: {
          kind: "model",
          label: `${brand?.name ?? ""} ${m.name}`.trim(),
          sublabel: "Motorcycle · see parts",
          href: `/models/${m.slug}`,
          thumb: modelThumb(m, brand?.name ?? ""),
        },
        rank: statusRank[m.status],
      });
    }
  }
  modelHits.sort((a, b) => a.rank - b.rank);

  const categoryHits: Suggestion[] = [];
  for (const g of groups) {
    if (matchesAll(tokensOf(g.name, g.nameBn))) {
      categoryHits.push({ kind: "category", label: g.name, sublabel: "Category", href: categoryPath(g.slug), thumb: photoThumb(g.image, g.icon) });
    }
    for (const s of g.subcategories) {
      const aliasTokens = (s.aliases ?? []).map((a) => applyAliases(normalize(a)));
      if (matchesAll(tokensOf(s.name, s.nameBn, ...aliasTokens))) {
        categoryHits.push({
          kind: "category",
          label: s.name,
          sublabel: g.name,
          href: categoryPath(s.slug),
          thumb: photoThumb(s.image ?? g.image, g.icon),
        });
      }
    }
  }

  return [...modelHits.slice(0, limit).map((h) => h.suggestion), ...categoryHits.slice(0, limit)];
}
