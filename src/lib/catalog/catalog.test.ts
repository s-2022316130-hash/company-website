import { existsSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { business } from "@/config/business";
import { photos } from "@/config/photos";
import { brands } from "@/data/brands";
import { categoryGroups, popularPartLinks } from "@/data/categories";
import { models } from "@/data/models";
import { demoAssignments, partKinds, products } from "@/data/products";
import { ownerManuals } from "@/data/manuals";
import { modelVariants } from "@/data/variants";
import {
  loadCatalog,
  popularForModel,
  relatedProducts,
  resolveCategory,
  resolveProductImage,
  spreadByCategory,
} from "./catalog";

describe("catalogue data integrity", () => {
  it("has unique category slugs across groups and subcategories", () => {
    const slugs = categoryGroups.flatMap((g) => [g.slug, ...g.subcategories.map((s) => s.slug)]);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("has unique product, model and brand slugs", () => {
    for (const list of [products, models, brands]) {
      const slugs = list.map((x) => x.slug);
      expect(new Set(slugs).size).toBe(slugs.length);
    }
  });

  it("only references categories, subcategories and models that exist", () => {
    const modelIds = new Set(models.map((m) => m.id));
    for (const p of products) {
      const group = categoryGroups.find((g) => g.slug === p.category);
      expect(group, `${p.slug} category`).toBeDefined();
      if (p.subcategory) expect(group!.subcategories.some((s) => s.slug === p.subcategory), `${p.slug} subcategory`).toBe(true);
      for (const id of p.compatibleModels) expect(modelIds.has(id), `${p.slug} → ${id}`).toBe(true);
    }
    const brandSlugs = new Set(brands.map((b) => b.slug));
    for (const m of models) expect(brandSlugs.has(m.brand), m.id).toBe(true);
  });

  it("keeps model-specific products tied to at least one model", () => {
    for (const p of products.filter((p) => p.fitment === "model-specific")) {
      expect(p.compatibleModels.length, p.slug).toBeGreaterThan(0);
    }
  });

  it("never gives demo products invented prices, part numbers, specs or verified types", () => {
    for (const p of products.filter((p) => p.isSample)) {
      expect(p.price, p.slug).toBeUndefined();
      expect(p.partNumber, p.slug).toBeUndefined();
      expect(p.sku, p.slug).toBeUndefined();
      expect(p.specifications ?? [], p.slug).toHaveLength(0);
      expect(p.productType, p.slug).toBe("unknown");
      expect(p.stockStatus, p.slug).toBe("call-for-availability");
      expect(p.images, `${p.slug} must not claim a photo of the exact item`).toHaveLength(0);
    }
  });

  it("only lists a demo part where the official spec says the bike has it", () => {
    const byId = new Map(models.map((m) => [m.id, m]));
    for (const [modelId, kindKey] of demoAssignments) {
      const m = byId.get(modelId)!;
      expect(partKinds[kindKey].requires(m), `${kindKey} does not fit ${modelId} (${JSON.stringify(m.spec)}, ${m.type})`).toBe(true);
    }
  });

  it("has a substantial demo catalogue spread across categories", () => {
    expect(products.length).toBeGreaterThanOrEqual(100);
    const perGroup = (slug: string) => products.filter((p) => p.category === slug).length;
    for (const slug of ["brakes", "chain-drive", "engine", "clutch-transmission", "filters", "electrical", "cables-controls", "suspension-steering", "body", "oils-fluids", "accessories"]) {
      expect(perGroup(slug), slug).toBeGreaterThanOrEqual(6);
    }
  });

  it("gives every brand a model list and every model a valid class and status", () => {
    for (const b of brands) expect(models.filter((m) => m.brand === b.slug).length, b.slug).toBeGreaterThanOrEqual(4);
    for (const m of models) {
      expect(["commuter", "street", "sport", "cruiser", "scooter", "offroad"]).toContain(m.class);
      expect(["bd-current", "bd-earlier", "official-other"]).toContain(m.status);
      expect(m.source, `${m.id} needs an official source`).toMatch(/^https:\/\//);
      if (m.type === "scooter") expect(m.class, m.id).toBe("scooter");
    }
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

  it("derives a model's brake spec from its variants", () => {
    const p150 = models.find((m) => m.id === "bajaj-pulsar-150")!;
    expect(p150.spec?.frontBrake).toEqual(["disc"]);
    expect(p150.spec?.rearBrake?.sort()).toEqual(["disc", "drum"]);
    expect(p150.aliases).toContain("pulsar 150 td abs");
    const n160 = models.find((m) => m.id === "bajaj-pulsar-n160")!;
    expect(n160.spec?.fuel?.sort()).toEqual(["carburettor", "fi"]);
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
  it("joins models, brands and a display image onto products", async () => {
    const catalog = await loadCatalog();
    const pad = catalog.productBySlug.get("yamaha-fzs-v4-front-brake-pad")!;
    expect(pad.brands.map((b) => b.slug)).toEqual(["yamaha"]);
    expect(pad.models.map((m) => m.id)).toEqual(["yamaha-fzs-v4"]);
    expect(pad.subcategoryName).toBe("Brake Pads");
    expect(pad.displayImage?.representative).toBe(true);
    expect(pad.displayImage?.alt).toMatch(/^Representative photo/);
  });

  it("prefers a photo of the exact item over representative photos", () => {
    const group = categoryGroups.find((g) => g.slug === "brakes")!;
    const base = products.find((p) => p.category === "brakes")!;
    const own = resolveProductImage({ ...base, images: [{ src: "/images/products/brake/own.webp", alt: "Own" }] }, group);
    expect(own).toMatchObject({ src: "/images/products/brake/own.webp", representative: false });
    const sub = group.subcategories.find((s) => s.slug === "brake-disc");
    expect(resolveProductImage({ ...base, images: [] }, group, sub)?.src).toBe(photos.brakeDisc.src);
    expect(resolveProductImage({ ...base, images: [], photo: undefined }, undefined, undefined)).toBeUndefined();
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
    const forBike = popularForModel(catalog, "yamaha-fzs-v4", 6);
    expect(forBike.every((p) => p.compatibleModels.includes("yamaha-fzs-v4"))).toBe(true);
    expect(new Set(forBike.map((p) => p.category)).size).toBeGreaterThan(3);
  });
});
