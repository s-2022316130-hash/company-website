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
    expect(top("FZS chain sprocket")).toContain("yamaha-fzs-v3-chain-sprocket-kit");
    expect(top("puls clutch")).toContain("bajaj-pulsar-150-clutch-cable");
    expect(top("fz v3 pad")).toContain("yamaha-fzs-v3-front-brake-pad");
  });

  it("does not match 150 against 160", () => {
    // Only Apache RTR 160 products exist, so "apache 150" must not be a full match.
    expect(searchProducts(index, "apache 150").mode).toBe("partial");
  });

  it("prefers direct matches over category-group matches", () => {
    expect(searchProducts(index, "mobil").hits.map((h) => h.product.slug)).toEqual(["motorcycle-engine-oil"]);
    // With no direct match, group-level matches are still returned.
    expect(searchProducts(index, "electrical").hits.length).toBeGreaterThan(0);
  });

  it("resolves local and Bangla terms", () => {
    expect(top("mobil")).toContain("motorcycle-engine-oil");
    expect(top("disc pad")).toEqual(expect.arrayContaining(["yamaha-fzs-v3-front-brake-pad"]));
    expect(top("চেইন")).toEqual(expect.arrayContaining(["yamaha-fzs-v3-chain-sprocket-kit"]));
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
