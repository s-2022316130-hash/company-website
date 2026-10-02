import type { MotorcycleModel, Product, ProductSpec } from "@/lib/types";
import { brands } from "./brands";
import { modelAssignments, officialFitment } from "./catalogue/assignments";
import { partKinds, type PartKind, type PartKindKey } from "./catalogue/kinds";
import { officialProducts } from "./catalogue/official";
import { universalProducts } from "./catalogue/universal";
import { models } from "./models";

/**
 * Product catalogue.
 *
 * Every record is a CATALOGUE entry, not confirmed stock: inventoryStatus "catalogue-only", no price,
 * SKU or invented part number, authenticity "unknown". Fitment confidence says how sure the listing
 * is: "manufacturer-listed" only where an official source names the part, size or spec for the model.
 *
 *   catalogue/kinds.ts        part-kind taxonomy and the rules for which bikes a kind applies to
 *   catalogue/assignments.ts  which kinds are catalogued for which model
 *   catalogue/official.ts     records from official sources (Yamaha BD parts list, spec pages, manuals)
 *   catalogue/universal.ts    oils, fluids, accessories and hardware
 *
 * When the shop confirms stock, set inventoryStatus, price and authenticity on the record (or in the
 * repository that replaces this file).
 */

const CONFIRM = "Call or WhatsApp to confirm fit, price and availability before ordering.";
const TAXONOMY = { type: "retailer-reference" as const, name: "Nirob Autos parts taxonomy" };

const modelById = new Map(models.map((m) => [m.id, m]));
const brandName = new Map(brands.map((b) => [b.slug, b.name]));

export interface Assignment {
  modelId: string;
  kindKey: PartKindKey;
  featured: boolean;
  popular: boolean;
}

export const assignments: Assignment[] = Object.entries(modelAssignments).flatMap(([modelId, entries]) =>
  entries.map((entry) => {
    const [kindKey, flags = ""] = entry.split(":") as [PartKindKey, string?];
    return { modelId, kindKey, featured: flags.includes("F"), popular: flags.includes("P") };
  }),
);

/** Variants of the model that have this part: names when only some do, plus a note for unstated ones. */
function variantFit(m: MotorcycleModel, kind: PartKind): { variants?: string[]; note?: string } {
  const vs = m.variants ?? [];
  if (vs.length < 2 || !kind.variant) return {};
  const results = vs.map((v) => ({ v, fits: kind.variant!(v) }));
  const yes = results.filter((r) => r.fits === true).map((r) => r.v.name);
  const unknown = results.filter((r) => r.fits === undefined).map((r) => r.v.name);
  if (yes.length === 0) return {}; // the official pages don't say per variant; the model-level spec applies
  if (yes.length === vs.length) return {};
  return {
    variants: yes,
    note: unknown.length > 0 ? `The official specs don't say whether the ${unknown.join(", ")} has this part. Ask us.` : undefined,
  };
}

function modelProducts({ modelId, kindKey, featured, popular }: Assignment): Product[] {
  const m = modelById.get(modelId);
  if (!m) throw new Error(`Catalogue assignment refers to unknown model "${modelId}"`);
  const kind: PartKind = partKinds[kindKey];
  const bike = `${brandName.get(m.brand) ?? m.brand} ${m.name}`;
  const label = kind.labelFor?.(m) ?? kind.label;
  const official = officialFitment[`${modelId}:${kindKey}`];
  const fit = variantFit(m, kind);

  const base = (slug: string, name: string, extra: Partial<Product> = {}): Product => ({
    id: slug,
    slug,
    name,
    category: kind.category,
    subcategory: kind.subcategory,
    images: [],
    photo: kind.photo,
    currency: "BDT",
    inventoryStatus: "catalogue-only",
    productStatus: "live",
    authenticity: "unknown",
    fitment: "model-specific",
    compatibleModels: [m.id],
    compatibleVariants: fit.variants,
    compatibilityConfidence: official ? "manufacturer-listed" : "needs-confirmation",
    source: official ? { type: "official-manufacturer", ...official } : TAXONOMY,
    shortDescription: kind.describe(bike),
    description: `${kind.describe(bike)} ${CONFIRM}`,
    searchableAliases: kind.aliases,
    isFeatured: featured,
    isPopular: popular,
    isFastMoving: kind.fastMoving,
    notes: fit.note ? [fit.note] : undefined,
    ...extra,
  });

  const slug = `${m.slug}-${kindKey}`;
  if (!kind.splitBy || !m.variants?.length) return [base(slug, `${bike} ${label}`)];

  // One record per official value (e.g. disc diameter); variants without a stated value are noted.
  const groups = new Map<string, { suffix: string; spec: ProductSpec; variants: string[] }>();
  const unstated: string[] = [];
  for (const v of m.variants) {
    if (kind.variant?.(v) === false) continue;
    const s = kind.splitBy(v);
    if (!s) {
      unstated.push(v.name);
      continue;
    }
    const g = groups.get(s.key) ?? { suffix: s.suffix, spec: s.spec, variants: [] };
    g.variants.push(v.name);
    groups.set(s.key, g);
  }
  if (groups.size === 0) return [base(slug, `${bike} ${label}`)];
  const unstatedNote = unstated.length > 0 ? `The official page doesn't give the size for the ${unstated.join(", ")}. Ask us.` : undefined;
  const single = groups.size === 1;
  return [...groups].map(([key, g]) =>
    base(single ? slug : `${slug}-${key}`, single ? `${bike} ${label}` : `${bike} ${label} (${g.suffix})`, {
      compatibleVariants: single && g.variants.length === m.variants!.length ? undefined : g.variants,
      compatibilityConfidence: "manufacturer-listed",
      source: { type: "official-bangladesh", name: `${brandName.get(m.brand) ?? m.brand} Bangladesh spec pages`, url: g.spec.source },
      specifications: [g.spec],
      notes: unstatedNote ? [unstatedNote] : undefined,
    }),
  );
}

export { partKinds };

export const products: Product[] = [...assignments.flatMap(modelProducts), ...officialProducts, ...universalProducts];
