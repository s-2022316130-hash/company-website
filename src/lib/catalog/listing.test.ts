import { beforeAll, describe, expect, it } from "vitest";
import { loadCatalog, type Catalog } from "./catalog";
import { listingHref, parseListingParams, runListing, sortProducts } from "./listing";

let catalog: Catalog;
beforeAll(async () => {
  catalog = await loadCatalog();
});

describe("parseListingParams", () => {
  it("reads repeated and comma-separated values and ignores junk", () => {
    const p = parseListingParams({ brand: ["yamaha", "bajaj,honda"], type: "bogus", page: "-3", sort: "price-asc" });
    expect(p.brands).toEqual(["yamaha", "bajaj", "honda"]);
    expect(p.types).toEqual([]);
    expect(p.page).toBe(1);
    expect(p.sort).toBe("price-asc");
  });
});

describe("runListing", () => {
  it("filters by brand and category together", () => {
    const r = runListing(catalog, parseListingParams({ brand: "yamaha", category: "brakes" }));
    expect(r.total).toBeGreaterThan(0);
    expect(r.items.every((p) => p.category === "brakes" && p.brands.some((b) => b.slug === "yamaha"))).toBe(true);
    expect(r.items.map((p) => p.slug)).toContain("yamaha-fzs-v4-front-brake-pad");
    expect(r.activeFilterCount).toBe(2);
  });

  it("scopes to a model and hides the brand and model facets", () => {
    const r = runListing(catalog, parseListingParams({}), { model: "bajaj-pulsar-150" });
    expect(r.items.every((p) => p.compatibleModels.includes("bajaj-pulsar-150"))).toBe(true);
    expect(r.facets.brands).toEqual([]);
    expect(r.facets.models).toEqual([]);
  });

  it("hides filters that cannot narrow results", () => {
    // Every sample product shares one stock status and has no price or verified type.
    const r = runListing(catalog, parseListingParams({}));
    expect(r.facets.availability).toEqual([]);
    expect(r.facets.types).toEqual([]);
    expect(r.facets.price).toBeUndefined();
    expect(r.sortOptions).not.toContain("price-asc");
  });

  it("ignores filter values that are not offered", () => {
    const r = runListing(catalog, parseListingParams({ brand: "ducati" }));
    expect(r.total).toBe(catalog.products.length);
    expect(r.activeFilterCount).toBe(0);
  });

  it("uses relevance sort for searches", () => {
    const r = runListing(catalog, parseListingParams({ q: "brake pad" }));
    expect(r.sort).toBe("relevance");
    expect(r.items[0].subcategory).toBe("brake-pads");
  });
});

describe("sortProducts", () => {
  it("puts unpriced items last in both price directions", () => {
    const base = catalog.products.slice(0, 3);
    const priced = [
      { ...base[0], price: 500 },
      { ...base[1], price: undefined },
      { ...base[2], price: 100 },
    ];
    expect(sortProducts(priced, "price-asc").map((p) => p.price)).toEqual([100, 500, undefined]);
    expect(sortProducts(priced, "price-desc").map((p) => p.price)).toEqual([500, 100, undefined]);
  });
});

describe("listingHref", () => {
  it("serialises params and drops empty values", () => {
    const params = parseListingParams({ q: "pad", brand: ["yamaha", "bajaj"], page: "2" });
    expect(listingHref("/shop", params, { brand: ["bajaj"], page: undefined })).toBe("/shop?q=pad&brand=bajaj");
    expect(listingHref("/shop", parseListingParams({}))).toBe("/shop");
  });
});
