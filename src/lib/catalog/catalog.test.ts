import { describe, expect, it } from "vitest";
import { brands } from "@/data/brands";
import { categoryGroups, popularPartLinks } from "@/data/categories";
import { models } from "@/data/models";
import { products } from "@/data/products";
import { loadCatalog, relatedProducts, resolveCategory } from "./catalog";

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

  it("never gives sample products invented prices, part numbers, specs or verified types", () => {
    for (const p of products.filter((p) => p.isSample)) {
      expect(p.price, p.slug).toBeUndefined();
      expect(p.partNumber, p.slug).toBeUndefined();
      expect(p.sku, p.slug).toBeUndefined();
      expect(p.specifications ?? [], p.slug).toHaveLength(0);
      expect(p.productType, p.slug).toBe("unknown");
      expect(p.stockStatus, p.slug).toBe("call-for-availability");
    }
  });

  it("points every popular part link at a real category", () => {
    for (const link of popularPartLinks) expect(resolveCategory(categoryGroups, link.slug), link.slug).toBeDefined();
  });
});

describe("catalogue service", () => {
  it("joins models and brands onto products", async () => {
    const catalog = await loadCatalog();
    const pad = catalog.productBySlug.get("yamaha-fzs-v3-front-brake-pad")!;
    expect(pad.brands.map((b) => b.slug)).toEqual(["yamaha"]);
    expect(pad.models.map((m) => m.id)).toEqual(["yamaha-fzs-v3"]);
    expect(pad.subcategoryName).toBe("Brake Pads");
  });

  it("resolves group and subcategory slugs", () => {
    expect(resolveCategory(categoryGroups, "brakes")?.sub).toBeUndefined();
    expect(resolveCategory(categoryGroups, "brake-pads")?.group.slug).toBe("brakes");
    expect(resolveCategory(categoryGroups, "nope")).toBeUndefined();
  });

  it("recommends paired maintenance items without repeating the product", async () => {
    const catalog = await loadCatalog();
    const kit = catalog.productBySlug.get("yamaha-fzs-v3-chain-sprocket-kit")!;
    const rails = relatedProducts(catalog, kit);
    const all = rails.flatMap((r) => r.products.map((p) => p.slug));
    expect(all).not.toContain(kit.slug);
    expect(new Set(all).size).toBe(all.length);
    expect(rails.find((r) => r.title === "Often replaced together")?.products.map((p) => p.subcategory)).toEqual(
      expect.arrayContaining(["chain-lubricant"]),
    );
  });
});
