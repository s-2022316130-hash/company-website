import type { Metadata } from "next";
import { Layers, MapPin, MessageCircle, Search } from "lucide-react";
import { BikeFinder } from "@/components/catalog/BikeFinder";
import { CategoryImageCard, categoryShortName, PopularPartCard } from "@/components/catalog/DirectoryCards";
import { ProductGrid } from "@/components/catalog/ProductCard";
import { CatalogueNotice } from "@/components/catalog/CatalogueNotice";
import { StoreContactCard } from "@/components/contact/StoreContactCard";
import { BikesShowcase, BrandShowcase, GenuineParts, Hero, OilsFeature, WorkshopBanner } from "@/components/home/HomeSections";
import { JsonLd } from "@/components/ui/JsonLd";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { business, dealershipFor, sellsOriginalParts } from "@/config/business";
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

export default async function HomePage() {
  const catalog = await loadCatalog();
  const catCounts = categoryCounts(catalog.products);
  const brandCounts = countBy(catalog.products, (p) => p.brands.map((b) => b.slug));
  const modelCounts = countBy(catalog.products, (p) => p.compatibleModels);
  const featured = spreadByCategory(
    catalog.products.filter((p) => p.isFeatured || p.isPopular),
    12,
  );
  const accessories = spreadByCategory(
    catalog.products.filter((p) => p.category === "accessories"),
    8,
  );
  const oilsGroup = catalog.groups.find((g) => g.slug === "oils-fluids");
  const oils = spreadByCategory(
    catalog.products.filter((p) => p.category === "oils-fluids"),
    6,
  );
  const popular = popularParts(catalog);
  const showcase = showcaseModelIds.flatMap((id) => {
    const m = catalog.modelById.get(id);
    return m ? [m] : [];
  });
  const brandName = (slug: string) => catalog.brandBySlug.get(slug)?.name ?? slug;
  const categoriesFor = (modelId: string) => modelCategoryGroups(catalog, modelId).map(({ group }) => categoryShortName(group));

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
      {hasCatalogueOnly(catalog) && <CatalogueNotice />}

      <Hero
        searchExamples={searchExamples}
        dealers={dealerBrands.map(({ brand, company }) => (brand.slug === "bajaj" ? `${company} (Bajaj)` : company))}
        originals={originalBrands.map((b) => b.name)}
      />

      <div className="container-page space-y-16 py-12 sm:space-y-20 sm:py-16">
        <BrandShowcase cards={brandCards} />

        <section aria-labelledby="categories-title" className="reveal">
          <SectionHeader
            id="categories-title"
            eyebrow="Shop by category"
            title="Browse by part type"
            action={{ label: "All categories", href: "/categories" }}
          />
          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {catalog.groups.map((g) => (
              <li key={g.slug}>
                <CategoryImageCard group={g} count={catCounts.get(g.slug) ?? 0} />
              </li>
            ))}
          </ul>
        </section>

        {featured.length > 0 && (
          <section aria-labelledby="featured-title" className="reveal">
            <SectionHeader
              id="featured-title"
              eyebrow="Featured"
              title="Featured parts"
              description="A cross-section of the catalogue. Prices and availability are confirmed by the shop when you order."
              action={{ label: "Shop all parts", href: "/shop" }}
            />
            <ProductGrid products={featured} />
          </section>
        )}

        <section aria-labelledby="popular-title" className="reveal">
          <SectionHeader
            id="popular-title"
            eyebrow="Popular parts"
            title="Frequently replaced"
            description="The wear-and-tear parts most riders come in for."
          />
          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {popular.map((p) => (
              <li key={p.slug}>
                <PopularPartCard part={p} />
              </li>
            ))}
          </ul>
        </section>

        <section aria-label="Find parts by motorcycle" className="reveal">
          <BikeFinder
            brands={ordered.map((b) => ({ slug: b.slug, name: b.name, bikeClass: brandBikeClass(catalog, b.slug) }))}
            models={catalog.models.map((m) => ({ id: m.id, brand: m.brand, name: m.name, class: m.class }))}
            categories={catalog.groups.map((g) => ({ slug: g.slug, name: g.name }))}
          />
        </section>
      </div>

      <div className="pb-12 sm:pb-16">
        <BikesShowcase models={showcase} brandName={brandName} counts={modelCounts} categoriesFor={categoriesFor} />
      </div>

      <GenuineParts dealers={dealerBrands} originals={originalBrands} />

      <WorkshopBanner />

      <div className="container-page space-y-16 py-12 sm:space-y-20 sm:py-16">
        <div className="reveal">
          <OilsFeature group={oilsGroup} products={oils} />
        </div>

        <section aria-labelledby="accessories-title" className="reveal">
          <SectionHeader
            id="accessories-title"
            eyebrow="Accessories"
            title="Accessories for everyday riding"
            description="Kept separate from mechanical parts: holders, chargers, helmets, covers and more."
            action={{ label: "All accessories", href: "/accessories" }}
          />
          <ProductGrid products={accessories} />
        </section>

        <section aria-labelledby="visit-title" className="reveal">
          <SectionHeader id="visit-title" eyebrow="Visit or call" title="Find Nirob Autos" />
          <ul className="mb-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: Layers, title: "Organised by motorcycle", text: "Parts are listed against popular brands and models, so you can start from your bike." },
              { icon: Search, title: "Easy part identification", text: "Search by part name, bike model, brand or part number, in English or common Bangla words." },
              { icon: MapPin, title: "Local store support", text: `Talk to the shop directly in ${business.address.locality} before you buy.` },
              { icon: MessageCircle, title: "Convenient ordering", text: "Send your order by WhatsApp or phone. Pick up in store or have it sent by courier." },
            ].map((item) => (
              <li key={item.title} className="card relative overflow-hidden p-5">
                <span aria-hidden="true" className="absolute inset-x-0 top-0 h-1 bg-brand" />
                <item.icon className="size-7 text-brand" aria-hidden="true" />
                <h3 className="display mt-3 text-2xl text-ink">{item.title}</h3>
                <p className="mt-1.5 text-sm text-muted">{item.text}</p>
              </li>
            ))}
          </ul>
          <StoreContactCard />
        </section>
      </div>
      <JsonLd data={localBusinessJsonLd()} />
    </>
  );
}
