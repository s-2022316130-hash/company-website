import { searchAliases, searchStopWords } from "@/data/search-aliases";
import { categoryPath } from "./paths";
import type { Brand, CategoryGroup, MotorcycleModel, ProductView } from "@/lib/types";

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
    };
  });
}

/** Best score for one query token across all fields; 0 means no match. */
function tokenScore(token: string, fields: IndexedField[]): number {
  let best = 0;
  const numeric = /^\d+$/.test(token);
  for (const field of fields) {
    for (const docToken of field.tokens) {
      let s = 0;
      if (docToken === token) s = field.weight;
      // Prefix matching lets "puls" find "pulsar"; numbers must match exactly so 150 never matches 160.
      else if (!numeric && token.length >= 2 && docToken.startsWith(token)) s = field.weight * 0.7;
      // Singular/plural: "pads" vs "pad".
      else if (token.length >= 4 && (docToken === `${token}s` || `${docToken}s` === token)) s = field.weight * 0.9;
      if (s > best) best = s;
    }
  }
  return best;
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

  const full: SearchHit[] = [];
  const partial: (SearchHit & { matched: number })[] = [];

  for (const entry of index) {
    let score = 0;
    let matched = 0;
    for (const token of tokens) {
      const s = tokenScore(token, entry.fields);
      if (s > 0) matched += 1;
      score += s;
    }
    if (matched === 0) continue;
    if (entry.product.isPopular) score += 0.25;
    if (matched === tokens.length) full.push({ product: entry.product, score });
    else partial.push({ product: entry.product, score, matched });
  }

  if (full.length > 0) {
    return { hits: full.sort((a, b) => b.score - a.score), mode: "all", tokens };
  }
  if (partial.length > 0) {
    partial.sort((a, b) => b.matched - a.matched || b.score - a.score);
    return { hits: partial.map(({ product, score }) => ({ product, score })), mode: "partial", tokens };
  }
  return { hits: [], mode: "none", tokens };
}

export interface Suggestion {
  kind: "product" | "model" | "category";
  label: string;
  sublabel?: string;
  href: string;
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

  const modelHits: Suggestion[] = [];
  for (const m of models) {
    const brand = brands.get(m.brand);
    if (matchesAll(tokensOf(brand?.name, brand?.nameBn, m.name, ...(m.aliases ?? [])))) {
      modelHits.push({
        kind: "model",
        label: `${brand?.name ?? ""} ${m.name} parts`.trim(),
        sublabel: "Motorcycle",
        href: `/models/${m.slug}`,
      });
    }
  }

  const categoryHits: Suggestion[] = [];
  for (const g of groups) {
    if (matchesAll(tokensOf(g.name, g.nameBn))) {
      categoryHits.push({ kind: "category", label: g.name, sublabel: "Category", href: categoryPath(g.slug) });
    }
    for (const s of g.subcategories) {
      const aliasTokens = (s.aliases ?? []).map((a) => applyAliases(normalize(a)));
      if (matchesAll(tokensOf(s.name, s.nameBn, ...aliasTokens))) {
        categoryHits.push({ kind: "category", label: s.name, sublabel: g.name, href: `/categories/${s.slug}` });
      }
    }
  }

  return [...modelHits.slice(0, limit), ...categoryHits.slice(0, limit)];
}
