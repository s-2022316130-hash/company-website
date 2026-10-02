import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Bike, Layers, MapPin, MessageCircle, Search } from "lucide-react";
import { BikeFinder } from "@/components/catalog/BikeFinder";
import { BrandCard, CategoryCard } from "@/components/catalog/DirectoryCards";
import { ProductGrid } from "@/components/catalog/ProductCard";
import { SampleCatalogNotice } from "@/components/catalog/SampleCatalogNotice";
import { StoreContactCard } from "@/components/contact/StoreContactCard";
import { CallButton } from "@/components/contact/ContactActions";
import { SearchBar } from "@/components/search/SearchBar";
import { JsonLd } from "@/components/ui/JsonLd";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { business } from "@/config/business";
import {
  categoryCounts,
  countBy,
  hasSampleProducts,
  loadCatalog,
  modelsForBrand,
  popularParts,
} from "@/lib/catalog/catalog";
import { sortProducts } from "@/lib/catalog/listing";
import { localBusinessJsonLd } from "@/lib/seo";

// Title and description come from the root layout; only the canonical URL is page-specific.
export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

const searchExamples = ["Brake pad", "Pulsar 150", "FZS V3", "Chain sprocket", "Spark plug"];

export default async function HomePage() {
  const catalog = await loadCatalog();
  const catCounts = categoryCounts(catalog.products);
  const brandCounts = countBy(catalog.products, (p) => p.brands.map((b) => b.slug));
  const modelCounts = countBy(catalog.products, (p) => p.compatibleModels);
  const featured = sortProducts(
    catalog.products.filter((p) => p.isFeatured),
    "popular",
  ).slice(0, 8);
  const accessories = catalog.products.filter((p) => p.category === "accessories").slice(0, 4);
  const oilsGroup = catalog.groups.find((g) => g.slug === "oils-fluids");
  const oils = catalog.products.filter((p) => p.category === "oils-fluids").slice(0, 4);
  const popular = popularParts(catalog);

  return (
    <>
      {hasSampleProducts(catalog) && <SampleCatalogNotice />}

      {/* Hero: search and bike finder, the two fastest routes to a part. */}
      <section className="tech-grid border-b border-line" aria-labelledby="hero-title">
        <div className="container-page grid items-center gap-8 py-8 sm:py-12 lg:grid-cols-[minmax(0,1fr)_24rem] lg:py-14">
          <div>
            <p className="eyebrow">Motorcycle spare parts · {business.address.locality}</p>
            <h1
              id="hero-title"
              className="mt-2 max-w-[18ch] font-display text-[2.125rem] font-bold leading-[1.05] tracking-tight text-ink sm:text-5xl"
            >
              Find the Right Parts for Your Motorcycle
            </h1>
            <p className="mt-3 max-w-xl text-base text-muted sm:text-lg">
              Browse spare parts, maintenance products and accessories for Bajaj, Honda, Yamaha, Suzuki, TVS, Hero and
              Runner bikes, then order from {business.name} by WhatsApp or phone.
            </p>

            {/* Phones already have the sticky header search directly above. */}
            <SearchBar size="lg" className="mt-6 hidden max-w-2xl md:block" />
            <div className="mt-5 flex flex-wrap items-center gap-2 md:mt-3">
              <span className="text-sm text-muted">Try:</span>
              {searchExamples.map((ex) => (
                <Link key={ex} href={`/search?q=${encodeURIComponent(ex)}`} className="chip min-h-9 bg-surface/90">
                  {ex}
                </Link>
              ))}
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/shop" className="btn btn-primary btn-lg">
                Shop parts <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
              <Link href="/part-finder" className="btn btn-outline btn-lg">
                <Bike className="size-5" aria-hidden="true" /> Find parts by bike
              </Link>
              <CallButton variant="dark" size="lg" label="Call Nirob Autos" />
            </div>
          </div>
          <BikeFinder brands={catalog.brands} models={catalog.models} />
        </div>
      </section>

      <div className="container-page space-y-14 py-10 sm:space-y-16 sm:py-14">
        <section aria-labelledby="brands-title">
          <SectionHeader
            id="brands-title"
            eyebrow="Shop by brand"
            title="Parts by motorcycle brand"
            action={{ label: "All brands", href: "/brands" }}
          />
          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4 xl:grid-cols-7">
            {catalog.brands.map((b) => (
              <li key={b.slug}>
                <BrandCard
                  brand={b}
                  modelCount={modelsForBrand(catalog, b.slug).length}
                  productCount={brandCounts.get(b.slug) ?? 0}
                />
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="bikes-title">
          <SectionHeader
            id="bikes-title"
            eyebrow="Shop by motorcycle"
            title="Pick your bike"
            description="Know only your bike model? Start here to see parts listed for it."
            action={{ label: "All motorcycles", href: "/models" }}
          />
          <div className="card divide-y divide-line">
            {catalog.brands.map((b) => (
              <div key={b.slug} className="flex flex-col gap-2 p-4 sm:flex-row sm:items-center">
                <Link href={`/brands/${b.slug}`} className="w-24 shrink-0 font-display text-lg font-bold text-ink hover:text-brand">
                  {b.name}
                </Link>
                <ul className="scrollbar-none -mx-4 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:flex-wrap sm:px-0">
                  {modelsForBrand(catalog, b.slug).map((m) => (
                    <li key={m.id} className="shrink-0">
                      <Link href={`/models/${m.slug}`} className="chip">
                        {m.name}
                        {(modelCounts.get(m.id) ?? 0) > 0 && (
                          <span className="text-xs text-muted">{modelCounts.get(m.id)}</span>
                        )}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <section aria-labelledby="categories-title">
          <SectionHeader
            id="categories-title"
            eyebrow="Shop by category"
            title="Browse by part type"
            action={{ label: "All categories", href: "/categories" }}
          />
          <ul className="grid grid-cols-1 gap-3 min-[400px]:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {catalog.groups.map((g) => (
              <li key={g.slug}>
                <CategoryCard group={g} count={catCounts.get(g.slug) ?? 0} />
              </li>
            ))}
          </ul>
        </section>

        {featured.length > 0 && (
          <section aria-labelledby="featured-title">
            <SectionHeader
              id="featured-title"
              eyebrow="Featured"
              title="Featured products"
              action={{ label: "Shop all products", href: "/shop" }}
            />
            <ProductGrid products={featured} />
          </section>
        )}

        <section aria-labelledby="popular-title">
          <SectionHeader id="popular-title" eyebrow="Popular parts" title="Frequently replaced parts" />
          <ul className="flex flex-wrap gap-2">
            {popular.map((p) => (
              <li key={p.slug}>
                <Link href={`/categories/${p.slug}`} className="chip min-h-11 px-4 text-[0.9375rem]">
                  {p.label}
                  {p.count > 0 && <span className="text-xs text-muted">{p.count}</span>}
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="accessories-title">
          <SectionHeader
            id="accessories-title"
            eyebrow="Accessories"
            title="Accessories for everyday riding"
            description="Kept separate from mechanical parts: phone holders, grips, covers and more."
            action={{ label: "All accessories", href: "/accessories" }}
          />
          {accessories.length > 0 ? (
            <ProductGrid products={accessories} />
          ) : (
            <p className="text-sm text-muted">Accessories are being added. Ask the store what is available.</p>
          )}
        </section>

        <section aria-labelledby="oils-title">
          <SectionHeader
            id="oils-title"
            eyebrow="Engine oils & maintenance"
            title="Oils, fluids and care products"
            action={{ label: "View engine oils & fluids", href: "/engine-oil" }}
          />
          {oilsGroup && (
            <ul className="mb-5 flex flex-wrap gap-2">
              {oilsGroup.subcategories.map((s) => (
                <li key={s.slug}>
                  <Link href={`/categories/${s.slug}`} className="chip">
                    {s.name}
                  </Link>
                </li>
              ))}
            </ul>
          )}
          {oils.length > 0 && <ProductGrid products={oils} />}
        </section>

        <section aria-labelledby="why-title">
          <SectionHeader id="why-title" eyebrow={`Why ${business.name}`} title="Why shop with us" />
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: Layers,
                title: "Organised by motorcycle",
                text: "Parts are listed against popular motorcycle brands and models.",
              },
              {
                icon: Search,
                title: "Easy part identification",
                text: "Search by product, bike model, category or part number.",
              },
              {
                icon: MapPin,
                title: "Local store support",
                text: `Talk to the shop directly in ${business.address.locality} before you buy.`,
              },
              {
                icon: MessageCircle,
                title: "Convenient ordering",
                text: "Send your order by WhatsApp or phone. Pick up in store or get it by courier.",
              },
            ].map((item) => (
              <li key={item.title} className="card p-5">
                <item.icon className="size-6 text-brand" aria-hidden="true" />
                <h3 className="mt-3 font-display text-lg font-bold text-ink">{item.title}</h3>
                <p className="mt-1 text-sm text-muted">{item.text}</p>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="visit-title">
          <SectionHeader id="visit-title" eyebrow="Visit or call" title="Find Nirob Autos" />
          <StoreContactCard />
        </section>
      </div>
      <JsonLd data={localBusinessJsonLd()} />
    </>
  );
}
