import { existsSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { business } from "@/config/business";
import { brandImages, imageContacts, motorcycleImages, photos, type BrandImages, type ImageAsset } from "@/config/images";
import { brands } from "@/data/brands";
import { models } from "@/data/models";
import { brandsByRelation, loadCatalog } from "@/lib/catalog/catalog";
import { authenticityBadgeLabels } from "@/lib/catalog/labels";
import { productSublabel, productThumb, suggestDirectory } from "@/lib/catalog/search";
import { brandLogo, motorcycleImage, pendingImageRequests, shown } from "./images";

const publicFile = (src: string) => join(process.cwd(), "public", src);

/** Every entry in the manifest, labelled for test messages. */
function allAssets(): [string, ImageAsset][] {
  return [
    ...Object.entries(photos),
    ...Object.entries(brandImages).map(([slug, b]): [string, ImageAsset] => [`${slug} logo`, b.logo]),
    ...Object.entries(motorcycleImages).flatMap(([id, a]): [string, ImageAsset][] => (a ? [[id, a]] : [])),
  ];
}

describe("image manifest", () => {
  it("keeps every file local, on disk and under /images", () => {
    for (const [key, a] of allAssets()) {
      if (!a.src) continue;
      expect(a.src, key).toMatch(/^\/images\//);
      expect(existsSync(publicFile(a.src)), `${key}: ${a.src}`).toBe(true);
      expect(a.alt.length, key).toBeGreaterThan(3);
    }
  });

  it("never keeps or shows a file whose use is not confirmed", () => {
    for (const [key, a] of allAssets()) {
      if (a.rightsStatus === "permission-required") expect(a.src, key).toBeUndefined();
    }
    const unconfirmed: ImageAsset = {
      src: "/images/motorcycles/example.webp",
      alt: "Example",
      imageSource: "official-brand",
      rightsStatus: "permission-required",
    };
    expect(shown(unconfirmed)).toBeUndefined();
    expect(shown({ ...unconfirmed, rightsStatus: "dealer-supplied" })?.src).toBe(unconfirmed.src);
  });

  it("records where each official image is published and who can supply it", () => {
    for (const [key, a] of allAssets()) {
      if (a.imageSource !== "official-brand") continue;
      expect(a.sourceUrl, key).toMatch(/^https:\/\//);
      expect(a.requestFrom, key).toBeTruthy();
    }
  });

  it("credits every stock photo and keeps it as a temporary placeholder", () => {
    for (const [key, p] of Object.entries(photos)) {
      expect(p.imageSource, key).toBe("licensed-stock");
      expect(p.rightsStatus, key).toBe("temporary");
      expect(p.sourceUrl, key).toBe(p.credit.pageUrl);
    }
  });

  it("gives every brand a logo slot, a contact and a current feature model of its own", () => {
    for (const b of brands) {
      const set = brandImages[b.slug as keyof typeof brandImages];
      expect(set, b.slug).toBeDefined();
      const feature = models.find((m) => m.id === set.featureModel);
      expect(feature?.brand, b.slug).toBe(b.slug);
      expect(feature?.status, b.slug).toBe("bd-current");
      expect(imageContacts[b.slug], b.slug).toBeTruthy();
    }
  });

  it("records what each brand's official site says about reusing its images", () => {
    for (const b of brands) {
      const { terms }: BrandImages = brandImages[b.slug as keyof typeof brandImages];
      expect(terms.summary.length, b.slug).toBeGreaterThan(20);
      expect(terms.checked, b.slug).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      for (const url of [terms.url, terms.mediaKit]) if (url) expect(url, b.slug).toMatch(/^https:\/\//);
    }
  });

  it("asks the dealership on the business card for each dealer brand's images", () => {
    for (const d of business.dealerships) expect(imageContacts[d.brand], d.brand).toContain(d.company);
  });

  it("only keys model photos by real model ids, and never for older or other-market models", () => {
    const byId = new Map(models.map((m) => [m.id, m]));
    for (const id of Object.keys(motorcycleImages)) {
      expect(byId.has(id), id).toBe(true);
      expect(byId.get(id)?.status, id).toBe("bd-current");
    }
  });

  it("gives each current Bangladesh model a slot pointing at its official page, and other models none", () => {
    for (const m of models) {
      const img = motorcycleImage(m, "Brand");
      if (m.status === "bd-current" && m.source) {
        expect(img?.sourceUrl, m.id).toBe(motorcycleImages[m.id]?.sourceUrl ?? m.source);
        expect(img?.imageSource, m.id).toBe("official-brand");
      } else {
        expect(img, m.id).toBeUndefined();
      }
    }
  });

  it("lists every official image still to request", () => {
    const requests = pendingImageRequests(brands, models);
    const pendingModels = models.filter((m) => m.status === "bd-current" && m.source && !shown(motorcycleImages[m.id]));
    const pendingLogos = brands.filter((b) => !shown(brandLogo(b.slug)));
    expect(requests.filter((r) => r.kind === "motorcycle")).toHaveLength(pendingModels.length);
    expect(requests.filter((r) => r.kind === "logo")).toHaveLength(pendingLogos.length);
    for (const r of requests) expect(r.sourceUrl, r.name).toMatch(/^https:\/\//);
  });

  it("keeps the documented image folders", () => {
    for (const dir of ["brands", "motorcycles", "products", "categories", "hero", "workshop", "oils", "accessories"]) {
      expect(existsSync(publicFile(`/images/${dir}`)), dir).toBe(true);
    }
  });
});

describe("brand presentation", () => {
  it("lists dealerships first in business card order, then original-parts brands", async () => {
    const catalog = await loadCatalog();
    expect(brandsByRelation(catalog).map((b) => b.slug)).toEqual([
      ...business.dealerships.map((d) => d.brand),
      ...business.originalPartsBrands,
    ]);
  });
});

describe("images in search", () => {
  it("never shows a motorcycle as a product's picture", async () => {
    const catalog = await loadCatalog();
    for (const p of catalog.products) expect(productThumb(p).kind, p.slug).not.toBe("bike");
  });

  it("shows the part illustration when there is no photo", async () => {
    const catalog = await loadCatalog();
    const pad = catalog.productBySlug.get("yamaha-fzs-v4-front-brake-pad")!;
    expect(productThumb(pad)).toEqual({ kind: "art", art: pad.art });
  });

  it("labels product suggestions with the brand and bike", async () => {
    const catalog = await loadCatalog();
    expect(productSublabel(catalog.productBySlug.get("yamaha-fzs-v4-front-brake-pad")!)).toBe("Yamaha · FZS V4");
  });

  it("shows model suggestions as drawings until a photo may be shown", async () => {
    const catalog = await loadCatalog();
    const [hit] = suggestDirectory("pulsar n160", catalog.models, catalog.brandBySlug, catalog.groups);
    expect(hit.href).toBe("/models/bajaj-pulsar-n160");
    expect(hit.thumb).toEqual({ kind: "bike", bikeClass: "street" });
  });
});

describe("authenticity wording", () => {
  it("never implies genuine: an unchecked part asks the customer to contact the store", () => {
    expect(authenticityBadgeLabels).toEqual({
      genuine: "Genuine part",
      oem: "OEM part",
      aftermarket: "Aftermarket",
      compatible: "Compatible part",
      unknown: "Contact store",
    });
  });
});
