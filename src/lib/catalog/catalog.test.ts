import { existsSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { business } from "@/config/business";
import { photos } from "@/config/images";
import { brands } from "@/data/brands";
import { categoryGroups, popularPartLinks } from "@/data/categories";
import { ownerManuals } from "@/data/manuals";
import { models } from "@/data/models";
import { assignments, partKinds, products } from "@/data/products";
import { modelVariants } from "@/data/variants";
import {
  loadCatalog,
  popularForModel,
  relatedProducts,
  resolveCategory,
  resolveProductImage,
  spreadByCategory,
  variantsFor,
} from "./catalog";

const modelById = new Map(models.map((m) => [m.id, m]));
const brandOf = (p: (typeof products)[number]) => new Set(p.compatibleModels.map((id) => modelById.get(id)?.brand));
const forBrand = (slug: string) => products.filter((p) => p.fitment !== "universal" && brandOf(p).has(slug));

describe("catalogue data integrity", () => {
  it("has unique category slugs across groups and subcategories", () => {
    const slugs = categoryGroups.flatMap((g) => [g.slug, ...g.subcategories.map((s) => s.slug)]);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("has unique product, model and brand slugs, and no duplicate product names", () => {
    for (const list of [products, models, brands]) {
      const slugs = list.map((x) => x.slug);
      expect(new Set(slugs).size).toBe(slugs.length);
    }
    const names = products.map((p) => p.name.toLowerCase());
    expect(names.filter((n, i) => names.indexOf(n) !== i)).toEqual([]);
  });

  it("only references categories, subcategories and models that exist", () => {
    for (const p of products) {
      const group = categoryGroups.find((g) => g.slug === p.category);
      expect(group, `${p.slug} category`).toBeDefined();
      if (p.subcategory) expect(group!.subcategories.some((s) => s.slug === p.subcategory), `${p.slug} subcategory`).toBe(true);
      for (const id of p.compatibleModels) expect(modelById.has(id), `${p.slug} → ${id}`).toBe(true);
    }
    const brandSlugs = new Set(brands.map((b) => b.slug));
    for (const m of models) expect(brandSlugs.has(m.brand), m.id).toBe(true);
  });

  it("keeps model-specific products tied to at least one model", () => {
    for (const p of products.filter((p) => p.fitment === "model-specific")) {
      expect(p.compatibleModels.length, p.slug).toBeGreaterThan(0);
    }
  });

  it("never gives catalogue entries invented prices, SKUs or a verified authenticity", () => {
    for (const p of products.filter((p) => p.inventoryStatus === "catalogue-only")) {
      expect(p.price, p.slug).toBeUndefined();
      expect(p.sku, p.slug).toBeUndefined();
      expect(p.authenticity, p.slug).toBe("unknown");
      expect(p.images, `${p.slug} must not claim a photo of the exact item`).toHaveLength(0);
      expect(p.productStatus, p.slug).toBe("live");
    }
  });

  it("only records a part number when an official source gives it", () => {
    for (const p of products.filter((p) => p.partNumber)) {
      expect(p.source.type, p.slug).toMatch(/^official-/);
      expect(p.specifications?.every((s) => s.source), p.slug).toBe(true);
    }
  });

  it("cites a source for every specification and every manufacturer-listed fitment", () => {
    for (const p of products) {
      for (const s of p.specifications ?? []) expect(s.source, `${p.slug}: ${s.label}`).toMatch(/^https:\/\//);
      if (p.compatibilityConfidence === "manufacturer-listed") {
        expect(p.source.type, p.slug).toMatch(/^official-/);
        expect(Boolean(p.source.url) || (p.specifications ?? []).length > 0, `${p.slug} needs a URL or sourced specs`).toBe(true);
      }
    }
  });

  it("only catalogues a part where the official spec allows it", () => {
    for (const { modelId, kindKey } of assignments) {
      const m = modelById.get(modelId);
      expect(m, `unknown model ${modelId}`).toBeDefined();
      expect(partKinds[kindKey], `unknown kind ${kindKey}`).toBeDefined();
      expect(partKinds[kindKey].requires(m!), `${kindKey} does not fit ${modelId} (${JSON.stringify(m!.spec)}, ${m!.type})`).toBe(true);
    }
    const keys = assignments.map((a) => `${a.modelId}:${a.kindKey}`);
    expect(keys.filter((k, i) => keys.indexOf(k) !== i), "duplicate assignments").toEqual([]);
  });

  it("names only real variants, and limits rear disc pads on the Pulsar 150 to the TD variants", () => {
    for (const p of products) {
      const known = new Set(p.compatibleModels.flatMap((id) => (modelById.get(id)?.variants ?? []).map((v) => v.name)));
      for (const v of p.compatibleVariants ?? []) expect(known.has(v), `${p.slug}: ${v}`).toBe(true);
    }
    const rearPad = products.find((p) => p.slug === "bajaj-pulsar-150-rear-brake-pad")!;
    expect(rearPad.compatibleVariants?.sort()).toEqual(["Pulsar 150 TD", "Pulsar 150 TD ABS"]);
    const rearShoe = products.find((p) => p.slug === "bajaj-pulsar-150-rear-brake-shoe")!;
    expect(rearShoe.compatibleVariants?.sort()).toEqual(["Pulsar 150 SD", "Pulsar 150 SD ABS"]);
  });

  it("splits Bajaj brake discs by the official diameter", () => {
    const n160 = products.filter((p) => p.slug.startsWith("bajaj-pulsar-n160-front-brake-disc"));
    expect(n160.map((p) => p.specifications?.[0].value).sort()).toEqual(["260 mm", "280 mm", "300 mm"]);
    expect(n160.every((p) => p.compatibilityConfidence === "manufacturer-listed")).toBe(true);
  });

  it("builds shared records from official specs instead of a copy per model", () => {
    const tyre = products.find((p) => p.slug === "tyre-80-100-17")!;
    expect(tyre.compatibleModels).toEqual(expect.arrayContaining(["bajaj-pulsar-150", "bajaj-pulsar-ns125", "bajaj-platina-110-h"]));
    expect(tyre.compatibleVariants).toEqual(expect.arrayContaining(["Pulsar 150 SD", "Pulsar 150 SD ABS"]));
    expect(tyre.compatibleVariants).not.toContain("Pulsar 150 TD");
    const battery = products.find((p) => p.slug === "battery-12v-8ah-vrla")!;
    expect(battery.compatibleModels.sort()).toEqual(["bajaj-pulsar-f250", "bajaj-pulsar-n250"]);
    const plug = products.find((p) => p.slug === "spark-plug-champion-rg4hc")!;
    expect(plug).toMatchObject({ partBrand: "Champion", partNumber: "RG4HC", compatibleModels: ["bajaj-pulsar-150"] });
    expect(products.find((p) => p.slug === "bajaj-pulsar-150-spark-plug"), "duplicates the official plug").toBeUndefined();
  });

  it("links oil grades and brake fluids only to models whose manual names them", () => {
    const oil20 = products.find((p) => p.slug === "engine-oil-20w50")!;
    expect(oil20.compatibleModels.sort()).toEqual(["bajaj-discover-125", "bajaj-pulsar-150"]);
    expect(products.find((p) => p.slug === "engine-oil-10w30")!.compatibleModels).toEqual(["bajaj-discover-110"]);
    expect(products.find((p) => p.slug === "engine-oil-10w40")!.compatibleModels).toEqual([]);
    expect(products.find((p) => p.slug === "engine-oil-10w40")!.compatibilityConfidence).toBe("needs-confirmation");
  });

  it("lists Yamaha Bangladesh's genuine parts with the models Yamaha gives", () => {
    const yamaha = products.filter((p) => p.source.url === "https://www.yamahabd.com/parts-spares");
    expect(yamaha).toHaveLength(10);
    expect(yamaha.every((p) => p.compatibilityConfidence === "manufacturer-listed")).toBe(true);
    expect(yamaha.find((p) => p.slug === "yamaha-fzs-v2-v3-master-cylinder-kit")!.compatibleModels).toEqual(["yamaha-fzs-v2", "yamaha-fzs-v3"]);
  });

  it("has a deep catalogue with Bajaj the most detailed brand", () => {
    expect(products.length).toBeGreaterThanOrEqual(400);
    const counts = Object.fromEntries(brands.map((b) => [b.slug, forBrand(b.slug).length]));
    expect(counts.bajaj).toBeGreaterThanOrEqual(150);
    for (const b of brands) if (b.slug !== "bajaj") expect(counts.bajaj, b.slug).toBeGreaterThan(counts[b.slug]);
    expect(counts.honda).toBeGreaterThanOrEqual(30);
    expect(counts.yamaha).toBeGreaterThanOrEqual(30);
    expect(counts.suzuki).toBeGreaterThanOrEqual(25);
    expect(counts.tvs).toBeGreaterThanOrEqual(20);
    expect(counts.hero).toBeGreaterThanOrEqual(30);
    expect(counts.runner).toBeGreaterThanOrEqual(25);
    expect(products.filter((p) => p.category === "accessories").length).toBeGreaterThanOrEqual(20);
    expect(products.filter((p) => p.category === "oils-fluids").length).toBeGreaterThanOrEqual(15);
    // Every current Bajaj model gets at least 15 entries.
    for (const m of models.filter((m) => m.brand === "bajaj" && m.status === "bd-current")) {
      expect(products.filter((p) => p.compatibleModels.includes(m.id)).length, m.id).toBeGreaterThanOrEqual(15);
    }
  });

  it("covers the Bajaj parts checklist", () => {
    const bajajSubs = new Set([
      ...forBrand("bajaj").map((p) => p.subcategory),
      ...products.filter((p) => p.fitment !== "model-specific").map((p) => p.subcategory),
    ]);
    const checklist = [
      // brakes
      "brake-pads", "brake-shoe", "brake-disc", "brake-caliper", "master-cylinder", "brake-cable", "brake-lever", "brake-fluid",
      // chain
      "chain", "sprocket", "chain-sprocket-kit", "chain-guide", "chain-cover", "chain-adjuster", "cush-drive",
      // engine
      "piston", "piston-ring", "cylinder-block", "cylinder-head", "gasket", "valve", "camshaft", "timing-chain", "rocker-arm",
      "oil-pump", "crankshaft", "engine-bearing", "oil-seal",
      // clutch & transmission
      "clutch-plate", "clutch-spring", "clutch-hub", "clutch-lever", "clutch-cable", "gear-components", "gear-lever",
      // electrical
      "battery", "stator", "rectifier", "ignition-coil", "plug-cap", "relay", "starter-motor", "switches", "horn",
      "headlight-bulb", "tail-light", "indicator", "wiring", "meter", "fuse",
      // fuel & filters
      "carburetor", "carb-kit", "fuel-injector", "throttle-body", "fuel-pump", "fuel-hose", "fuel-tap", "intake",
      "air-filter", "oil-filter", "fuel-filter", "spark-plug",
      // suspension, steering, wheels
      "front-fork", "fork-seal", "fork-bush", "rear-shock", "steering-bearing", "handlebar",
      "wheel-bearing", "axle-hub", "tyres", "tubes",
      // body & small parts
      "mirror", "fender", "side-panel", "headlight-assembly", "side-stand", "center-stand", "leg-guard", "footrest", "grab-rail",
      "o-rings", "bushes", "circlips", "fasteners", "bearings",
    ];
    expect(checklist.filter((s) => !bajajSubs.has(s))).toEqual([]);
  });

  it("gives every brand a model list and every model a valid class and status", () => {
    for (const b of brands) expect(models.filter((m) => m.brand === b.slug).length, b.slug).toBeGreaterThanOrEqual(4);
    for (const m of models) {
      expect(["commuter", "street", "sport", "cruiser", "scooter", "offroad"]).toContain(m.class);
      expect(["bd-current", "bd-earlier", "official-other"]).toContain(m.status);
      expect(m.source, `${m.id} needs an official source`).toMatch(/^https:\/\//);
      if (m.type === "scooter") expect(m.class, m.id).toBe("scooter");
    }
    expect(models.filter((m) => m.brand === "bajaj" && m.family).map((m) => m.family)).toEqual(
      expect.arrayContaining(["Pulsar", "Discover", "Platina", "CT"]),
    );
  });

  it("keys variant specs to real models and keeps them sourced", () => {
    const ids = new Set(models.map((m) => m.id));
    for (const [modelId, variants] of Object.entries(modelVariants)) {
      expect(ids.has(modelId), modelId).toBe(true);
      const brandSource = brands.find((b) => b.slug === models.find((m) => m.id === modelId)?.brand)?.officialSource?.url;
      for (const v of variants) {
        expect(v.source, v.name).toMatch(/^https:\/\//);
        expect(new URL(v.source).hostname, v.name).toBe(new URL(brandSource!).hostname);
        expect(v.checked, v.name).toMatch(/^\d{4}-\d{2}-\d{2}$/);
        for (const b of [v.frontBrake, v.rearBrake]) if (b?.sizeMm) expect(b.sizeMm).toBeGreaterThan(80);
      }
    }
  });

  it("keys owner's manual facts to real models and official PDFs", () => {
    const ids = new Set(models.map((m) => m.id));
    for (const [modelId, m] of Object.entries(ownerManuals)) {
      expect(ids.has(modelId), modelId).toBe(true);
      expect(m.source, modelId).toMatch(/^https:\/\/www\.bajajauto\.com\/.+\.pdf$/);
      expect(models.find((x) => x.id === modelId)?.manual, modelId).toBe(m);
      if (m.tyrePressurePsi) expect(m.tyrePressurePsi.rearPillion).toBeGreaterThanOrEqual(m.tyrePressurePsi.rearSolo);
    }
  });

  it("derives a model's brake and fuel spec from its variants and manual", () => {
    const p150 = modelById.get("bajaj-pulsar-150")!;
    expect(p150.spec?.frontBrake).toEqual(["disc"]);
    expect(p150.spec?.rearBrake?.sort()).toEqual(["disc", "drum"]);
    expect(p150.spec?.fuel).toEqual(["carburettor"]); // from the owner's manual
    expect(p150.aliases).toContain("pulsar 150 td abs");
    expect(modelById.get("bajaj-pulsar-n160")!.spec?.fuel?.sort()).toEqual(["carburettor", "fi"]);
    expect(modelById.get("bajaj-discover-125")!.spec?.rearBrake).toEqual(["drum"]);
  });

  it("only lists dealerships and original-parts brands that exist, without overlap", () => {
    const slugs = new Set(brands.map((b) => b.slug));
    const dealerBrands = business.dealerships.map((d) => d.brand);
    for (const s of [...dealerBrands, ...business.originalPartsBrands]) expect(slugs.has(s), s).toBe(true);
    expect(dealerBrands.filter((s) => (business.originalPartsBrands as readonly string[]).includes(s))).toEqual([]);
  });

  it("points every popular part link at a real category", () => {
    for (const link of popularPartLinks) expect(resolveCategory(categoryGroups, link.slug), link.slug).toBeDefined();
  });

  it("gives every category a photo and a short label", () => {
    for (const g of categoryGroups) {
      expect(g.image, g.slug).toBeDefined();
      expect(g.shortLabel.length, g.slug).toBeGreaterThan(3);
    }
  });

  it("only references photos that exist on disk", () => {
    for (const [key, p] of Object.entries(photos)) {
      expect(existsSync(join(process.cwd(), "public", p.src)), `${key}: ${p.src}`).toBe(true);
      expect(p.alt.length, key).toBeGreaterThan(5);
      expect(p.credit.pageUrl, key).toMatch(/^https:\/\/unsplash\.com\/photos\//);
    }
    for (const g of categoryGroups) {
      for (const key of [g.image, ...g.subcategories.map((s) => s.image)]) {
        if (key) expect(photos[key], `${g.slug} → ${key}`).toBeDefined();
      }
    }
  });
});

describe("catalogue service", () => {
  it("joins models and brands, and illustrates a part that has no accurate photo", async () => {
    const catalog = await loadCatalog();
    const pad = catalog.productBySlug.get("yamaha-fzs-v4-front-brake-pad")!;
    expect(pad.brands.map((b) => b.slug)).toEqual(["yamaha"]);
    expect(pad.models.map((m) => m.id)).toEqual(["yamaha-fzs-v4"]);
    expect(pad.subcategoryName).toBe("Brake Pads");
    // No photo of a brake pad exists, so the disc photo must not stand in for it.
    expect(pad.displayImage).toBeUndefined();
    expect(pad.art).toBe("brake-pad");
    expect(catalog.productBySlug.get("tyre-80-100-17")!.displayImage?.representative).toBe(true);
  });

  it("prefers a photo of the exact item and never falls back to the broad category photo", () => {
    const group = categoryGroups.find((g) => g.slug === "brakes")!;
    const base = products.find((p) => p.category === "brakes")!;
    const own = resolveProductImage({ ...base, images: [{ src: "/images/products/brake/own.webp", alt: "Own" }] }, group);
    expect(own).toMatchObject({ src: "/images/products/brake/own.webp", representative: false });
    const disc = group.subcategories.find((s) => s.slug === "brake-disc");
    expect(resolveProductImage({ ...base, images: [] }, group, disc)?.src).toBe(photos.brakeDisc.src);
    const pads = group.subcategories.find((s) => s.slug === "brake-pads");
    expect(resolveProductImage({ ...base, images: [], photo: undefined }, group, pads)).toBeUndefined();
  });

  it("returns a product's variants for one model", async () => {
    const catalog = await loadCatalog();
    const pad = catalog.productBySlug.get("bajaj-pulsar-150-rear-brake-pad")!;
    expect(variantsFor(pad, catalog.modelById.get("bajaj-pulsar-150")!).sort()).toEqual(["Pulsar 150 TD", "Pulsar 150 TD ABS"]);
    const front = catalog.productBySlug.get("bajaj-pulsar-150-front-brake-pad")!;
    expect(variantsFor(front, catalog.modelById.get("bajaj-pulsar-150")!)).toEqual([]);
  });

  it("resolves group and subcategory slugs", () => {
    expect(resolveCategory(categoryGroups, "brakes")?.sub).toBeUndefined();
    expect(resolveCategory(categoryGroups, "brake-pads")?.group.slug).toBe("brakes");
    expect(resolveCategory(categoryGroups, "nope")).toBeUndefined();
  });

  it("recommends paired maintenance items without repeating the product or another bike's part", async () => {
    const catalog = await loadCatalog();
    const kit = catalog.productBySlug.get("yamaha-fzs-v4-chain-sprocket-kit")!;
    const rails = relatedProducts(catalog, kit);
    const all = rails.flatMap((r) => r.products.map((p) => p.slug));
    expect(all).not.toContain(kit.slug);
    expect(new Set(all).size).toBe(all.length);
    const paired = rails.find((r) => r.title === "Often used together")!.products;
    expect(paired.map((p) => p.subcategory)).toEqual(expect.arrayContaining(["chain-lubricant"]));
    for (const p of paired) {
      expect(p.fitment !== "model-specific" || p.compatibleModels.includes("yamaha-fzs-v4"), p.slug).toBe(true);
    }
  });

  it("spreads short lists across categories", async () => {
    const catalog = await loadCatalog();
    const picks = spreadByCategory(catalog.products, 8);
    expect(new Set(picks.map((p) => p.category)).size).toBeGreaterThanOrEqual(6);
    const forBike = popularForModel(catalog, "bajaj-pulsar-150", 8);
    expect(forBike.every((p) => p.compatibleModels.includes("bajaj-pulsar-150"))).toBe(true);
    expect(new Set(forBike.map((p) => p.category)).size).toBeGreaterThan(4);
  });
});
