import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Layers, MapPin, MessageCircle, Search } from "lucide-react";
import { BikeFinder } from "@/components/catalog/BikeFinder";
import {
  BrandShowroomCard,
  CategoryImageCard,
  categoryShortName,
  PopularPartCard,
} from "@/components/catalog/DirectoryCards";
import { ProductGrid } from "@/components/catalog/ProductCard";
import { SampleCatalogNotice } from "@/components/catalog/SampleCatalogNotice";
import { StoreContactCard } from "@/components/contact/StoreContactCard";
import { BikesShowcase, Hero, MechanicalDna, OilsFeature, WorkshopBanner } from "@/components/home/HomeSections";
import { JsonLd } from "@/components/ui/JsonLd";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { business } from "@/config/business";
import {
  categoryCounts,
  countBy,
  hasSampleProducts,
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

/** Bikes featured in the "Built around the bikes you ride" rail, in display order. */
const showcaseModelIds = [
  "yamaha-fzs-v4",
  "bajaj-pulsar-150",
  "yamaha-r15-v4",
  "honda-shine-100",
  "suzuki-gixxer-sf",
  "bajaj-pulsar-n160",
  "honda-sp-160",
  "tvs-apache-rtr-160-4v",
  "hero-splendor-plus-se",
  "hero-hunk-150r",
  "suzuki-gixxer",
  "honda-dio",
  "runner-bullet-100",
  "bajaj-platina-100-es",
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

  return (
    <>
      {hasSampleProducts(catalog) && <SampleCatalogNotice />}

      <Hero brandNames={catalog.brands.map((b) => b.name)} searchExamples={searchExamples} />

      <div className="container-page space-y-16 py-12 sm:space-y-20 sm:py-16">
        <section aria-labelledby="brands-title" className="reveal">
          <SectionHeader
            id="brands-title"
            eyebrow="Shop by brand"
            title="Parts by motorcycle brand"
            description="Pick your bike's maker to see its models and the parts listed for them."
            action={{ label: "All brands", href: "/brands" }}
          />
          <ul className="scrollbar-none -mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-1 sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 lg:grid-cols-4">
            {catalog.brands.map((b) => {
              const brandModels = modelsForBrand(catalog, b.slug);
              return (
                <li key={b.slug} className="w-72 shrink-0 snap-start sm:w-auto">
                  <BrandShowroomCard
                    brand={b}
                    modelNames={brandModels.slice(0, 4).map((m) => m.name)}
                    modelCount={brandModels.length}
                    productCount={brandCounts.get(b.slug) ?? 0}
                  />
                </li>
              );
            })}
            <li className="w-72 shrink-0 snap-start sm:w-auto">
              <Link
                href="/models"
                className="group flex h-full min-h-64 flex-col justify-between rounded-[0.625rem] border-2 border-dashed border-line-strong p-5 transition-colors hover:border-brand hover:bg-surface"
              >
                <span className="display text-3xl text-ink">Know only your model?</span>
                <span className="text-sm text-muted">Search the motorcycle directory by name, from Shine 100 to Gixxer SF 250.</span>
                <span className="inline-flex items-center gap-1 font-display font-semibold uppercase tracking-[0.08em] text-brand">
                  Find your bike <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                </span>
              </Link>
            </li>
          </ul>
        </section>

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

        <section aria-label="Find parts by motorcycle" className="reveal">
          <BikeFinder
            brands={catalog.brands.map((b) => ({ slug: b.slug, name: b.name, bikeClass: b.bikeClass }))}
            models={catalog.models.map((m) => ({ id: m.id, brand: m.brand, name: m.name, class: m.class }))}
            categories={catalog.groups.map((g) => ({ slug: g.slug, name: g.name }))}
          />
        </section>

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
      </div>

      <MechanicalDna />

      <div className="py-12 sm:py-16">
        <BikesShowcase models={showcase} brandName={brandName} counts={modelCounts} categoriesFor={categoriesFor} />
      </div>

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

        <section aria-labelledby="why-title" className="reveal">
          <SectionHeader id="why-title" eyebrow={`Why ${business.name}`} title="Why shop with us" />
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
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
        </section>

        <section aria-labelledby="visit-title" className="reveal">
          <SectionHeader id="visit-title" eyebrow="Visit or call" title="Find Nirob Autos" />
          <StoreContactCard />
        </section>
      </div>
      <JsonLd data={localBusinessJsonLd()} />
    </>
  );
}
