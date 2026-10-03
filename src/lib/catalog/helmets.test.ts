import { describe, expect, it } from "vitest";
import { certificationPage, helmetBrands, helmetProducts, helmetSlug } from "@/data/catalogue/helmets";
import { products } from "@/data/products";
import { helmetSummary, isHelmet } from "./present";

describe("helmets", () => {
  it("lists every helmet on the owner's list, once", () => {
    expect(helmetBrands.map((b) => b.name)).toEqual([
      "Studds",
      "Vega",
      "Steelbird",
      "Torq",
      "Axor",
      "LS2",
      "MT Helmets",
      "SMK",
      "KYT",
      "HJC",
      "Bilmola",
      "AGV",
      "Shark",
    ]);
    expect(helmetProducts).toHaveLength(64);
    const slugs = helmetBrands.flatMap((b) => b.models.map(helmetSlug));
    expect(new Set(slugs).size).toBe(slugs.length);
    const all = new Set(products.map((p) => p.slug));
    for (const s of slugs) expect(all.has(s), s).toBe(true);
    expect(products.filter((p) => p.subcategory === "helmets")).toHaveLength(64);
  });

  it("never invents prices, stock levels, photos or genuineness", () => {
    for (const p of helmetProducts) {
      expect(p.inventoryStatus, p.slug).toBe("call-to-confirm");
      expect(p.price, p.slug).toBeUndefined();
      expect(p.sku, p.slug).toBeUndefined();
      expect(p.images, p.slug).toHaveLength(0);
      expect(p.authenticity, p.slug).toBe("unknown");
      expect(p.source.type, p.slug).toBe("store-supplied");
      expect(p.partBrand, p.slug).toBeTruthy();
      expect(p.compatibleModels, p.slug).toHaveLength(0);
      expect(p.name.endsWith(" Helmet"), p.slug).toBe(true);
    }
  });

  it("only states a style or certification that a cited page gives, and certifications never from a retailer", () => {
    for (const b of helmetBrands) {
      for (const m of b.models) {
        if (m.style) expect(m.source?.url, m.name).toMatch(/^https:\/\//);
        if (m.certifications?.length) {
          const page = certificationPage(m);
          expect(page?.url, m.name).toMatch(/^https:\/\//);
          expect(page?.kind, m.name).not.toBe("retailer");
        }
        if (m.certificationSource) expect(m.certifications?.length, `${m.name}: a certification page without a certification`).toBeGreaterThan(0);
      }
    }
    for (const p of helmetProducts) {
      for (const s of p.specifications ?? []) expect(s.source, `${p.slug}: ${s.label}`).toMatch(/^https:\/\//);
      if (!p.specifications?.some((s) => s.label === "Style")) expect(p.art, `${p.slug} drawing implies a style`).toBeUndefined();
    }
    // Every model that states a certification shows it on its product page.
    const certified = helmetBrands.flatMap((b) => b.models).filter((m) => m.certifications?.length).length;
    expect(helmetProducts.filter((p) => p.specifications?.some((s) => s.label.startsWith("Certification"))).length).toBe(certified);
    // A style read on a retailer's page is linked as the retailer's page, not as an official source.
    for (const m of helmetBrands.flatMap((b) => b.models)) {
      const style = helmetProducts.find((p) => p.slug === helmetSlug(m))?.specifications?.find((s) => s.label === "Style");
      if (m.style) expect(style?.sourceKind, m.name).toBe(m.source?.kind);
    }
  });

  it("describes helmets by style and maker instead of bike fitment", () => {
    const bolt = helmetProducts.find((p) => p.slug === "helmet-vega-bolt")!;
    expect(isHelmet(bolt)).toBe(true);
    expect(helmetSummary(bolt)).toBe("Full face helmet · Vega");
    const unsourced = helmetProducts.find((p) => p.slug === "helmet-vega-jeet")!;
    expect(helmetSummary(unsourced)).toBe("Helmet · Vega");
  });
});
