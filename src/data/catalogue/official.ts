import type { MotorcycleModel, Product, ProductSpec } from "@/lib/types";
import { brands } from "../brands";
import { models, YAMAHA_PARTS } from "../models";

/**
 * Catalogue records whose fitment comes from an official manufacturer source.
 *
 * 1. Yamaha Bangladesh "Parts and Spares" page (yamahabd.com/parts-spares, read 2026-10-02): ten
 *    genuine parts, each listed with the model it fits. No part numbers are published there, so none
 *    are recorded. Yamaha's prices are its own and are not used.
 * 2. Shared parts derived from official spec pages and owner's manuals (see variants.ts, manuals.ts):
 *    tyre sizes, batteries, spark plug types and bulb ratings. One record per part with every model
 *    that uses it, never a copy per model.
 *
 * All are catalogue entries: inventoryStatus "catalogue-only" until the shop confirms stock.
 */

const CONFIRM = "Call or WhatsApp to confirm price and availability before ordering.";
const brandName = new Map(brands.map((b) => [b.slug, b.name]));
const bike = (m: MotorcycleModel) => `${brandName.get(m.brand) ?? m.brand} ${m.name}`;

function catalogueRecord(p: Omit<Product, "id" | "images" | "currency" | "inventoryStatus" | "productStatus" | "authenticity">): Product {
  return {
    id: p.slug,
    images: [],
    currency: "BDT",
    inventoryStatus: "catalogue-only",
    productStatus: "live",
    authenticity: "unknown",
    ...p,
  };
}

// ── 1. Yamaha Bangladesh genuine parts list ─────────────────────────────────

const yamahaSource = { type: "official-bangladesh" as const, name: "Yamaha Bangladesh genuine parts list", url: YAMAHA_PARTS };

const yamahaParts: { slug: string; part: string; models: string[]; category: string; subcategory: string; photo?: Product["photo"]; aliases?: string[]; fast?: boolean }[] = [
  { slug: "yamaha-r15m-speedometer-tft", part: "Speedometer (TFT)", models: ["yamaha-r15m"], category: "electrical", subcategory: "meter", aliases: ["tft meter", "digital meter"] },
  { slug: "yamaha-fz-x-headlight", part: "Headlight", models: ["yamaha-fz-x"], category: "body", subcategory: "headlight-assembly" },
  { slug: "yamaha-fzs-v2-v3-crankcase-cover-gasket", part: "Crankcase Cover Gasket 1", models: ["yamaha-fzs-v2", "yamaha-fzs-v3"], category: "engine", subcategory: "gasket" },
  { slug: "yamaha-fzs-v2-clutch-boss", part: "Clutch Boss", models: ["yamaha-fzs-v2"], category: "clutch-transmission", subcategory: "clutch-hub", aliases: ["clutch hub"] },
  { slug: "yamaha-fzs-v2-v3-master-cylinder-kit", part: "Master Cylinder Kit", models: ["yamaha-fzs-v2", "yamaha-fzs-v3"], category: "brakes", subcategory: "master-cylinder" },
  { slug: "yamaha-fzs-v2-v3-damper", part: "Damper", models: ["yamaha-fzs-v2", "yamaha-fzs-v3"], category: "chain-drive", subcategory: "cush-drive", aliases: ["damper rubber"] },
  { slug: "yamaha-fzs-v3-chain-sprocket-kit", part: "Chain Sprocket Kit", models: ["yamaha-fzs-v3"], category: "chain-drive", subcategory: "chain-sprocket-kit", fast: true },
  { slug: "yamaha-fzs-v2-brake-pad", part: "Brake Pad", models: ["yamaha-fzs-v2"], category: "brakes", subcategory: "brake-pads", fast: true },
  // Keeps the slug of the earlier catalogue entry for this part.
  { slug: "yamaha-fzs-v4-air-filter", part: "Air Cleaner", models: ["yamaha-fzs-v4"], category: "filters", subcategory: "air-filter", aliases: ["air filter"], fast: true },
  { slug: "yamaha-fzs-v3-race-kit", part: "Race Kit", models: ["yamaha-fzs-v3"], category: "suspension-steering", subcategory: "steering-bearing", aliases: ["steering race", "ball racer"] },
];

const modelById = new Map(models.map((m) => [m.id, m]));
const modelsFor = (ids: string[]) =>
  ids.map((id) => {
    const m = modelById.get(id);
    if (!m) throw new Error(`Official product refers to unknown model "${id}"`);
    return m;
  });

const yamahaProducts: Product[] = yamahaParts.map((p) => {
  const ms = modelsFor(p.models);
  const names = ms.map((m) => m.name).join(" & ");
  const desc = `${p.part} for the Yamaha ${names}, as listed by Yamaha Bangladesh on its genuine parts page.`;
  return catalogueRecord({
    slug: p.slug,
    name: `Yamaha ${names} ${p.part}`,
    category: p.category,
    subcategory: p.subcategory,
    photo: p.photo,
    fitment: "model-specific",
    compatibleModels: p.models,
    compatibilityConfidence: "manufacturer-listed",
    source: yamahaSource,
    shortDescription: desc,
    description: `${desc} ${CONFIRM}`,
    searchableAliases: p.aliases,
    isFastMoving: p.fast,
    isPopular: p.fast,
    notes: ["Fitment as listed by Yamaha Bangladesh. Ask whether the item in stock is the genuine Yamaha part."],
  });
});

// ── 2. Shared parts from official specs and manuals ─────────────────────────

interface Use {
  model: MotorcycleModel;
  variant?: string;
  detail: string;
  source: string;
}

function group<K>(uses: { key: K; use: Use }[]) {
  const map = new Map<K, Use[]>();
  for (const { key, use } of uses) map.set(key, [...(map.get(key) ?? []), use]);
  return map;
}

/** One spec row per model, citing its official page. */
function usageSpecs(uses: Use[], label: (u: Use) => string): ProductSpec[] {
  const byModel = group(uses.map((u) => ({ key: u.model.id, use: u })));
  return [...byModel.values()].map((us) => {
    // "Front: 80/100-17, tubeless (Pulsar 150 SD, Pulsar 150 SD ABS)" rather than one line per variant.
    const byDetail = new Map<string, string[]>();
    for (const u of us) byDetail.set(u.detail, [...(byDetail.get(u.detail) ?? []), ...(u.variant ? [u.variant] : [])]);
    return {
      label: label(us[0]),
      value: [...byDetail].map(([detail, vs]) => (vs.length > 0 ? `${detail} (${vs.join(", ")})` : detail)).join("; "),
      source: us[0].source,
    };
  });
}

/** Variant names only for models where the part applies to some variants, not all. */
function limitedVariants(uses: Use[]): string[] | undefined {
  const out: string[] = [];
  for (const [id, us] of group(uses.map((u) => ({ key: u.model.id, use: u })))) {
    const all = modelById.get(id)?.variants ?? [];
    const named = new Set(us.map((u) => u.variant).filter((v): v is string => Boolean(v)));
    if (all.length > 0 && named.size > 0 && named.size < all.length) out.push(...named);
  }
  return out.length > 0 ? out : undefined;
}

const sizeOf = (tyre: string) => tyre.match(/^(\d+(?:\.\d+)?(?:\/\d+)?)-(\d+)/)?.slice(1, 3).join("-");

const tyreUses: { key: string; use: Use }[] = [];
for (const m of models) {
  for (const v of m.variants ?? []) {
    for (const [pos, tyre] of [["Front", v.frontTyre], ["Rear", v.rearTyre]] as const) {
      const size = tyre && sizeOf(tyre);
      if (size) tyreUses.push({ key: size, use: { model: m, variant: m.variants!.length > 1 ? v.name : undefined, detail: `${pos}: ${tyre}`, source: v.source } });
    }
  }
}

const tyreProducts: Product[] = [...group(tyreUses)].map(([size, uses]) => {
  const ms = [...new Map(uses.map((u) => [u.model.id, u.model])).values()];
  const desc = `${size} motorcycle tyre, the size listed by the manufacturer for the ${ms.map(bike).join(", ")}. Tyre brand and tread pattern vary; ask us which are available.`;
  return catalogueRecord({
    slug: `tyre-${size.replace(/[/.]/g, "-")}`,
    name: `${size} Motorcycle Tyre`,
    category: "wheels-tyres",
    subcategory: "tyres",
    fitment: "model-specific",
    compatibleModels: ms.map((m) => m.id),
    compatibleVariants: limitedVariants(uses),
    compatibilityConfidence: "manufacturer-listed",
    source: { type: "official-bangladesh", name: "Manufacturer spec pages" },
    specifications: usageSpecs(uses, (u) => bike(u.model)),
    shortDescription: desc,
    description: `${desc} Check the load and speed index on your current tyre. ${CONFIRM}`,
    searchableAliases: [size.replace("-", " "), `${size} tyre`],
    isFastMoving: true,
  });
});

const tubeProducts: Product[] = [...group(tyreUses.filter(({ use }) => /tube type/i.test(use.detail)))].map(([size, uses]) => {
  const ms = [...new Map(uses.map((u) => [u.model.id, u.model])).values()];
  const desc = `${size} inner tube for tube-type tyres, the size listed by the manufacturer for the ${ms.map(bike).join(", ")}.`;
  return catalogueRecord({
    slug: `tube-${size.replace(/[/.]/g, "-")}`,
    name: `${size} Tube`,
    category: "wheels-tyres",
    subcategory: "tubes",
    fitment: "model-specific",
    compatibleModels: ms.map((m) => m.id),
    compatibilityConfidence: "manufacturer-listed",
    source: { type: "official-bangladesh", name: "Manufacturer spec pages" },
    specifications: usageSpecs(uses, (u) => bike(u.model)),
    shortDescription: desc,
    description: `${desc} ${CONFIRM}`,
  });
});

/** "12 V, 4 Ah VRLA" / "4Ah VRLA" / "12 V, 5 Ah MF" → "4Ah-VRLA". */
const batteryKey = (s: string) => {
  const m = s.match(/(\d+)\s*Ah\s*(VRLA|MF)?/i);
  return m ? `${m[1]}Ah-${(m[2] ?? "").toUpperCase()}` : undefined;
};

const batteryUses: { key: string; use: Use }[] = [];
for (const m of models) {
  for (const v of m.variants ?? []) {
    const key = v.battery && batteryKey(v.battery);
    if (key) batteryUses.push({ key, use: { model: m, variant: m.variants!.length > 1 ? v.name : undefined, detail: v.battery!, source: v.source } });
  }
  const mk = m.manual?.battery && batteryKey(m.manual.battery);
  if (mk) batteryUses.push({ key: mk, use: { model: m, detail: `${m.manual!.battery} (owner's manual)`, source: m.manual!.source } });
}

const batteryProducts: Product[] = [...group(batteryUses)].map(([key, uses]) => {
  const [ah, type] = key.split("-");
  const ms = [...new Map(uses.map((u) => [u.model.id, u.model])).values()];
  const label = `12V ${ah}${type ? ` ${type}` : ""} Battery`;
  const desc = `${label.replace(" Battery", "")} motorcycle battery, the rating listed by the manufacturer for the ${ms.map(bike).join(", ")}. Battery make varies; check the terminal layout matches your bike.`;
  // A model that has both a spec-page and a manual entry should only be listed once per variant.
  const fromSpec = uses.filter((u) => !u.detail.includes("owner's manual"));
  return catalogueRecord({
    slug: `battery-12v-${ah.toLowerCase()}${type ? `-${type.toLowerCase()}` : ""}`,
    name: label,
    category: "electrical",
    subcategory: "battery",
    fitment: "model-specific",
    compatibleModels: ms.map((m) => m.id),
    compatibleVariants: limitedVariants(fromSpec.length === uses.length ? uses : fromSpec),
    compatibilityConfidence: "manufacturer-listed",
    source: { type: "official-bangladesh", name: "Manufacturer spec pages and owner's manuals" },
    specifications: usageSpecs(uses, (u) => bike(u.model)),
    shortDescription: desc,
    description: `${desc} ${CONFIRM}`,
    searchableAliases: [`${ah} battery`, `${ah.replace("Ah", " ah")} battery`],
    isFastMoving: true,
  });
});

const plugUses: { key: string; use: Use }[] = [];
for (const m of models) {
  const sp = m.manual?.sparkPlug;
  if (!sp) continue;
  for (const type of sp.types.split(/\s+or\s+/)) {
    const detail = [sp.count && sp.count > 1 ? `${sp.count} plugs per bike` : undefined, sp.gap ? `gap ${sp.gap}` : undefined].filter(Boolean).join(", ");
    plugUses.push({ key: type.trim(), use: { model: m, detail, source: m.manual!.source } });
  }
}

const plugProducts: Product[] = [...group(plugUses)].map(([type, uses]) => {
  const [maker, ...code] = type.split(" ");
  const ms = [...new Map(uses.map((u) => [u.model.id, u.model])).values()];
  const desc = `${type} spark plug, the type listed in the owner's manual for the ${ms.map(bike).join(", ")}.`;
  return catalogueRecord({
    slug: `spark-plug-${type.toLowerCase().replace(/\s+/g, "-")}`,
    name: `${type} Spark Plug`,
    partBrand: maker,
    // The plug maker's own type code, as printed in the manufacturer's manual.
    partNumber: code.join(" "),
    category: "filters",
    subcategory: "spark-plug",
    fitment: "model-specific",
    compatibleModels: ms.map((m) => m.id),
    compatibilityConfidence: "manufacturer-listed",
    source: { type: "official-manufacturer", name: "Owner's manuals" },
    specifications: usageSpecs(uses, (u) => bike(u.model)),
    shortDescription: desc,
    description: `${desc} Twin-spark engines take two plugs. ${CONFIRM}`,
    searchableAliases: [code.join(" ").toLowerCase()],
    isFastMoving: true,
    isPopular: true,
  });
});

const bulbKinds: { match: RegExp; key: string; name: string; label: string }[] = [
  { match: /^headlamp$/i, key: "headlight", name: "Headlight Bulb", label: "Headlamp" },
  { match: /turn indicators?/i, key: "indicator", name: "Indicator Bulb", label: "Turn indicators" },
  { match: /tail \/ stop/i, key: "tail-stop", name: "Tail / Stop Bulb", label: "Tail / stop lamp" },
  { match: /number plate/i, key: "number-plate", name: "Number Plate Bulb", label: "Number plate lamp" },
];

const bulbUses: { key: string; use: Use }[] = [];
for (const m of models) {
  for (const b of m.manual?.bulbs ?? []) {
    const kind = bulbKinds.find((k) => k.match.test(b.label));
    const watts = b.value.match(/(\d+(?:\/\d+)?)\s*W\b/)?.[1];
    if (kind && watts) bulbUses.push({ key: `${kind.key}|${watts}`, use: { model: m, detail: b.value, source: m.manual!.source } });
  }
}

const bulbProducts: Product[] = [...group(bulbUses)].map(([key, uses]) => {
  const [kindKey, watts] = key.split("|");
  const kind = bulbKinds.find((k) => k.key === kindKey)!;
  const ms = [...new Map(uses.map((u) => [u.model.id, u.model])).values()];
  const desc = `12 V ${watts} W ${kind.name.toLowerCase()}, the rating listed in the owner's manual for the ${ms.map(bike).join(", ")}.`;
  return catalogueRecord({
    slug: `bulb-${kindKey}-${watts.replace("/", "-")}w`,
    name: `12V ${watts}W ${kind.name}`,
    category: "electrical",
    subcategory: "headlight-bulb",
    fitment: "model-specific",
    compatibleModels: ms.map((m) => m.id),
    // The manuals give the wattage but not the bulb base, so the exact bulb still needs checking.
    compatibilityConfidence: "needs-confirmation",
    source: { type: "official-manufacturer", name: "Owner's manuals" },
    specifications: usageSpecs(uses, (u) => `${bike(u.model)}: ${kind.label.toLowerCase()}`),
    shortDescription: desc,
    description: `${desc} ${CONFIRM}`,
    notes: ["The manual gives the wattage but not the bulb base type. Bring the old bulb or tell us your variant."],
  });
});

export const officialProducts: Product[] = [
  ...yamahaProducts,
  ...tyreProducts,
  ...tubeProducts,
  ...batteryProducts,
  ...plugProducts,
  ...bulbProducts,
];
