import { beforeAll, describe, expect, it } from "vitest";
import { loadCatalog, type Catalog } from "./catalog";
import { applyAliases, buildSearchIndex, normalize, queryTokens, searchProducts, suggestDirectory } from "./search";

let catalog: Catalog;
let index: ReturnType<typeof buildSearchIndex>;

beforeAll(async () => {
  catalog = await loadCatalog();
  index = buildSearchIndex(catalog.products, { groups: catalog.groups });
});

const top = (q: string, n = 3) => searchProducts(index, q).hits.slice(0, n).map((h) => h.product.slug);

describe("normalisation and aliases", () => {
  it("lowercases, strips punctuation and converts Bangla digits", () => {
    expect(normalize("  FZS-V3 / Pulsar ১৫০ ")).toBe("fzs v3 pulsar 150");
  });

  it("maps local terms to catalogue words, longest phrase first", () => {
    expect(applyAliases("mobil")).toBe("engine oil");
    expect(applyAliases("front pad")).toBe("front brake pad");
    expect(applyAliases(normalize("ব্রেক প্যাড"))).toBe("brake pad");
    // Whole words only: "mobile holder" must not become "engine oile holder".
    expect(applyAliases("mobile holder")).toBe("mobile holder");
  });

  it("drops filler words", () => {
    expect(queryTokens("bike chain price")).toEqual(["chain"]);
  });
});

describe("product search", () => {
  it("finds a model-specific part from model + part words", () => {
    const result = searchProducts(index, "Pulsar 150 brake pad");
    expect(result.mode).toBe("all");
    expect(result.hits[0].product.slug).toBe("bajaj-pulsar-150-front-brake-pad");
  });

  it("matches model shorthand and partial words", () => {
    expect(top("FZS V4 chain sprocket")).toContain("yamaha-fzs-v4-chain-sprocket-kit");
    expect(top("puls 150 clutch")).toContain("bajaj-pulsar-150-clutch-cable");
    expect(top("fz v4 pad")).toContain("yamaha-fzs-v4-front-brake-pad");
  });

  it("does not match 150 against 160", () => {
    // Only Apache RTR 160 products exist, so "apache 150" must not be a full match.
    const result = searchProducts(index, "apache 150");
    expect(result.mode).toBe("partial");
    // The model word outranks the bare number, so Apache parts lead rather than Pulsar 150 parts.
    expect(result.hits[0].product.brands[0].slug).toBe("tvs");
  });

  it("prefers direct matches over category-group matches", () => {
    const oils = searchProducts(index, "mobil").hits.map((h) => h.product);
    const engineOils = catalog.products.filter((p) => p.subcategory === "engine-oil").length;
    // Every engine oil ranks above parts that only mention oil (oil seals, oil filters).
    expect(oils.slice(0, engineOils).every((p) => p.subcategory === "engine-oil")).toBe(true);
    expect(oils.some((p) => p.category === "brakes")).toBe(false);
    // With no direct match, group-level matches are still returned.
    expect(searchProducts(index, "electrical").hits.length).toBeGreaterThan(0);
  });

  it("finds every Pulsar's brake parts and every chain kit", () => {
    const pulsar = searchProducts(index, "pulsar brake").hits.map((h) => h.product.slug);
    expect(pulsar).toEqual(
      expect.arrayContaining([
        "bajaj-pulsar-150-front-brake-pad",
        "bajaj-pulsar-n160-front-brake-pad",
        "bajaj-pulsar-n160-rear-brake-pad",
        "bajaj-pulsar-ns125-front-brake-pad",
      ]),
    );
    const kits = searchProducts(index, "chain kit").hits.map((h) => h.product);
    const allKits = catalog.products.filter((p) => p.subcategory === "chain-sprocket-kit");
    expect(kits.filter((p) => p.subcategory === "chain-sprocket-kit")).toHaveLength(allKits.length);
  });

  it("understands common part names customers use", () => {
    const sub = (q: string) => new Set(searchProducts(index, q).hits.slice(0, 10).map((h) => h.product.subcategory));
    expect(sub("air cleaner").has("air-filter")).toBe(true);
    expect(sub("accelerator cable").has("throttle-cable")).toBe(true);
    expect(sub("engine oil filter").has("oil-filter")).toBe(true);
    expect(sub("front pad").has("brake-pads")).toBe(true);
    expect(sub("chain sprocket").has("chain-sprocket-kit")).toBe(true);
  });

  it("resolves local and Bangla terms", () => {
    expect(top("mobil")).toContain("engine-oil-20w50");
    expect(top("fzs v4 disc pad")).toEqual(expect.arrayContaining(["yamaha-fzs-v4-front-brake-pad"]));
    expect(top("fzs v4 চেইন")).toEqual(expect.arrayContaining(["yamaha-fzs-v4-chain-sprocket-kit"]));
  });

  it("separates front and rear pads", () => {
    const slugs = searchProducts(index, "front brake pad").hits.map((h) => h.product.slug);
    expect(slugs).not.toContain("suzuki-gixxer-sf-rear-brake-pad");
  });

  it("falls back to closest matches when no product has every word", () => {
    const result = searchProducts(index, "Honda CB Shine air filter");
    expect(result.mode).toBe("partial");
    expect(result.hits.length).toBeGreaterThan(0);
  });

  it("returns nothing for gibberish", () => {
    expect(searchProducts(index, "zzqxv").mode).toBe("none");
  });

  it("suggests model and category pages", () => {
    const s = suggestDirectory("pulsar 150", catalog.models, catalog.brandBySlug, catalog.groups);
    expect(s[0]).toMatchObject({ kind: "model", href: "/models/bajaj-pulsar-150" });
    const c = suggestDirectory("brake pad", catalog.models, catalog.brandBySlug, catalog.groups);
    expect(c.some((x) => x.href === "/categories/brake-pads")).toBe(true);
  });
});
