import type { Metadata } from "next";
import type { CSSProperties } from "react";
import { BikeFinder } from "@/components/catalog/BikeFinder";
import { categoryShortName } from "@/components/catalog/DirectoryCards";
import { CatalogueNotice } from "@/components/catalog/CatalogueNotice";
import { StoreContactCard } from "@/components/contact/StoreContactCard";
import {
  BikesShowcase,
  BrandShowcase,
  CategoryShowcase,
  GenuineParts,
  HelmetsShowcase,
  Hero,
  MechanicalSystems,
  OilsFeature,
  OrderingSteps,
  ProductRail,
  VisualBreak,
  type SystemPanelData,
} from "@/components/home/HomeSections";
import { Reveal } from "@/components/motion/Reveal";
import { JsonLd } from "@/components/ui/JsonLd";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { dealershipFor, sellsOriginalParts } from "@/config/business";
import type { PhotoKey } from "@/config/images";
import { helmetBrands } from "@/data/catalogue/helmets";
import {
  brandBikeClass,
  brandFeatureModel,
  brandsByRelation,
  categoryCounts,
  countBy,
  hasCatalogueOnly,
  loadCatalog,
  modelCategoryGroups,
  modelsForBrand,
  popularParts,
  spreadByCategory,
} from "@/lib/catalog/catalog";
import { makerSlug } from "@/lib/catalog/listing";
import { localBusinessJsonLd } from "@/lib/seo";

// Title and description come from the root layout; only the canonical URL is page-specific.
export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

const searchExamples = ["Brake pad", "Pulsar 150", "FZS V4", "Chain sprocket", "Spark plug"];

/** Bikes in "Parts for the bikes you ride", in display order (the list in the brief, where in the directory). */
const showcaseModelIds = [
  "bajaj-pulsar-n160",
  "bajaj-pulsar-150",
  "yamaha-fzs-v4",
  "yamaha-mt15-v2",
  "yamaha-r15-v4",
  "honda-sp-160",
  "honda-xblade",
  "suzuki-gixxer",
  "tvs-apache-rtr-160-4v",
  "tvs-raider-125",
  "hero-hunk-150r",
  "runner-knight-rider-150",
  "runner-bullet-100",
];

/** "Inside the machine" panels: category and a close-up that differs from the category card photo. */
const systemPanels: { slug: string; photo: PhotoKey }[] = [
  { slug: "engine", photo: "piston" },
  { slug: "chain-drive", photo: "chainKit" },
  { slug: "brakes", photo: "brakeDisc" },
  { slug: "electrical", photo: "tailLamp" },
];

/**
 * Homepage, in the order a shopper needs it: search and shop (hero), brands, categories, products,
 * the part finder, bikes, then the editorial sections, and finally how to order and where the shop is.
 * Dark editorial bands alternate with light shopping sections so the page never reads as one long grid.
 */
export default async function HomePage() {
  const catalog = await loadCatalog();
  const catCounts = categoryCounts(catalog.products);
  const brandCounts = countBy(catalog.products, (p) => p.brands.map((b) => b.slug));
  const modelCounts = countBy(catalog.products, (p) => p.compatibleModels);
  const featured = spreadByCategory(
    catalog.products.filter((p) => p.isFeatured || p.isPopular),
    12,
  );
  // Helmets have their own section, so the accessories rail shows everything else.
  const accessories = spreadByCategory(
    catalog.products.filter((p) => p.category === "accessories" && p.subcategory !== "helmets"),
    8,
  );
  const helmets = catalog.products.filter((p) => p.subcategory === "helmets");
  const helmetTiles = helmetBrands.map((b) => ({ name: b.name, maker: makerSlug(b.name), count: b.models.length }));
  // One helmet per brand: the first with a sourced style, otherwise the first listed.
  const helmetPicks = helmetBrands.flatMap((b) => {
    const own = helmets.filter((p) => p.partBrand === b.name);
    const pick = own.find((p) => p.specifications?.some((s) => s.label === "Style")) ?? own[0];
    return pick ? [pick] : [];
  });
  const oilsGroup = catalog.groups.find((g) => g.slug === "oils-fluids");
  const oils = spreadByCategory(
    catalog.products.filter((p) => p.category === "oils-fluids"),
    6,
  );
  const showcase = showcaseModelIds.flatMap((id) => {
    const m = catalog.modelById.get(id);
    return m ? [m] : [];
  });
  const brandName = (slug: string) => catalog.brandBySlug.get(slug)?.name ?? slug;
  const categoriesFor = (modelId: string) => modelCategoryGroups(catalog, modelId).map(({ group }) => categoryShortName(group));
  const systems: SystemPanelData[] = systemPanels.flatMap(({ slug, photo }) => {
    const group = catalog.groups.find((g) => g.slug === slug);
    return group ? [{ group, photo, count: catCounts.get(slug) ?? 0 }] : [];
  });

  const ordered = brandsByRelation(catalog);
  const brandCards = ordered.map((b) => {
    const brandModels = modelsForBrand(catalog, b.slug);
    return {
      brand: b,
      feature: brandFeatureModel(catalog, b.slug),
      modelNames: brandModels.slice(0, 4).map((m) => m.name),
      modelCount: brandModels.length,
      productCount: brandCounts.get(b.slug) ?? 0,
    };
  });
  const dealerBrands = ordered.flatMap((b) => {
    const d = dealershipFor(b.slug);
    return d ? [{ brand: b, company: d.company }] : [];
  });
  const originalBrands = ordered.filter((b) => sellsOriginalParts(b.slug));

  return (
    <>
      <Hero
        searchExamples={searchExamples}
        dealers={dealerBrands.map(({ brand, company }) => (brand.slug === "bajaj" ? `${company} (Bajaj)` : company))}
        originals={originalBrands.map((b) => b.name)}
      />
      {hasCatalogueOnly(catalog) && <CatalogueNotice />}

      <div className="container-page space-y-(--space-section) py-(--space-section)">
        <BrandShowcase cards={brandCards} />
        <CategoryShowcase groups={catalog.groups} counts={catCounts} popular={popularParts(catalog)} />
        <ProductRail
          id="featured-title"
          eyebrow="Featured"
          title="Featured parts"
          description="A cross-section of the catalogue. Prices and availability are confirmed by the shop when you order."
          action={{ label: "Shop all parts", href: "/shop" }}
          products={featured}
        />
        <Reveal as="section" variant="self" aria-label="Find parts by motorcycle">
          <BikeFinder
            brands={ordered.map((b) => ({ slug: b.slug, name: b.name, bikeClass: brandBikeClass(catalog, b.slug) }))}
            models={catalog.models.map((m) => ({ id: m.id, brand: m.brand, name: m.name, class: m.class }))}
            categories={catalog.groups.map((g) => ({ slug: g.slug, name: g.name }))}
          />
        </Reveal>
      </div>

      <BikesShowcase models={showcase} brandName={brandName} counts={modelCounts} categoriesFor={categoriesFor} />

      <div className="container-page py-(--space-section)">
        <MechanicalSystems systems={systems} />
      </div>

      <GenuineParts dealers={dealerBrands} originals={originalBrands} />

      <div className="container-page py-(--space-section)">
        <OilsFeature group={oilsGroup} products={oils} />
      </div>

      <div className="container-page pb-(--space-section)">
        <HelmetsShowcase brands={helmetTiles} picks={helmetPicks} total={helmets.length} />
      </div>

      <VisualBreak />

      <div className="container-page space-y-(--space-section) pt-(--space-section)">
        <ProductRail
          id="accessories-title"
          eyebrow="Accessories"
          title="Accessories for everyday riding"
          description="Kept separate from mechanical parts: holders, chargers, gloves, covers and more."
          action={{ label: "All accessories", href: "/accessories" }}
          products={accessories}
        />
        <OrderingSteps />
        <Reveal as="section" aria-labelledby="visit-title">
          <SectionHeader id="visit-title" eyebrow="Visit or call" title="Find Nirob Autos" />
          <div className="reveal-item" style={{ "--reveal-i": 2 } as CSSProperties}>
            <StoreContactCard />
          </div>
        </Reveal>
      </div>
      <JsonLd data={localBusinessJsonLd()} />
    </>
  );
}
