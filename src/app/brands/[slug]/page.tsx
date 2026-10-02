import type { Metadata } from "next";
import Form from "next/form";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BadgeCheck, Search } from "lucide-react";
import { TrackView } from "@/components/analytics/Track";
import { CategoryImageCard, categoryShortName, ModelCard } from "@/components/catalog/DirectoryCards";
import { LineupSpecTable } from "@/components/catalog/VariantSpecs";
import { business, dealershipFor, sellsOriginalParts } from "@/config/business";
import { ProductListing } from "@/components/catalog/ProductListing";
import { BlueprintBanner } from "@/components/layout/Banners";
import { SectionHeader } from "@/components/ui/SectionHeader";
import {
  categoryCounts,
  countBy,
  loadCatalog,
  modelCategoryGroups,
  modelsForBrand,
  modelStatusLabels,
  productFitsBrand,
} from "@/lib/catalog/catalog";
import { pluralize } from "@/lib/format";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata(props: PageProps<"/brands/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const { brandBySlug } = await loadCatalog();
  const brand = brandBySlug.get(slug);
  if (!brand) return { title: "Brand not found", robots: { index: false } };
  return pageMetadata({
    title: `${brand.name} Motorcycle Parts`,
    description: `Spare parts, filters, brake parts and maintenance products for ${brand.name} motorcycles at Nirob Autos, Madhupur. Browse by model.`,
    path: `/brands/${brand.slug}`,
  });
}

export default async function BrandPage(props: PageProps<"/brands/[slug]">) {
  const [{ slug }, searchParams] = await Promise.all([props.params, props.searchParams]);
  const catalog = await loadCatalog();
  const brand = catalog.brandBySlug.get(slug);
  if (!brand) notFound();

  const models = modelsForBrand(catalog, brand.slug);
  const modelCounts = countBy(catalog.products, (p) => p.compatibleModels);
  const brandProducts = catalog.products.filter((p) => productFitsBrand(p, brand.slug));
  const counts = categoryCounts(brandProducts);
  const groupsWithParts = catalog.groups.filter((g) => counts.has(g.slug));
  const current = models.filter((m) => m.status !== "official-other");
  const other = models.filter((m) => m.status === "official-other");
  const q = typeof searchParams.q === "string" ? searchParams.q : "";
  const dealer = dealershipFor(brand.slug);
  const withSpecs = current.filter((m) => m.variants && m.variants.length > 0);

  return (
    <>
      <TrackView event="brand_view" props={{ brand: brand.slug }} />
      <BlueprintBanner
        bikeClass={brand.bikeClass}
        eyebrow="Motorcycle parts"
        title={`${brand.name} motorcycle parts`}
        crumbs={[
          { label: "Brands", href: "/brands" },
          { label: brand.name, href: `/brands/${brand.slug}` },
        ]}
        aside="Drawing shows a typical bike type, not a specific model"
        description={
          <>
            Parts and maintenance products listed for {brand.name} motorcycles. Pick your model for the most accurate list.
            {(dealer || sellsOriginalParts(brand.slug)) && (
              <span className="mt-3 flex items-start gap-2 rounded-md border border-brand-bright/40 bg-brand-bright/10 px-3 py-2 text-sm text-on-dark">
                <BadgeCheck className="mt-0.5 size-4 shrink-0 text-brand-bright" aria-hidden="true" />
                {dealer ? (
                  <span>
                    {business.name} is a dealer for <strong className="text-white">{dealer.company}</strong>
                    {"note" in dealer ? `, ${dealer.note}` : ""}. Genuine {brand.name} parts at company price.
                  </span>
                ) : (
                  <span>Original {brand.name} parts sold at affordable prices. Ask for availability.</span>
                )}
              </span>
            )}
            <span className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-sm text-on-dark-muted">
              <span>
                <strong className="text-white">{pluralize(models.length, "model")}</strong> in the directory
              </span>
              <span>
                <strong className="text-white">{pluralize(brandProducts.length, "part")}</strong> listed
              </span>
            </span>
          </>
        }
      >
        <Form action={`/brands/${brand.slug}`} className="mt-5 flex max-w-xl gap-2" role="search" scroll={false}>
          <label htmlFor="brand-search" className="sr-only">
            Search within {brand.name} parts
          </label>
          <input
            id="brand-search"
            name="q"
            type="search"
            defaultValue={q}
            maxLength={120}
            placeholder={`Search ${brand.name} parts, e.g. brake pad`}
            className="input"
          />
          <button type="submit" className="btn btn-primary shrink-0">
            <Search className="size-4" aria-hidden="true" />
            <span className="max-sm:sr-only">Search</span>
          </button>
        </Form>
        {brand.officialSource && (
          <p className="mt-3 text-xs text-on-dark-muted">
            Model list checked against{" "}
            <a href={brand.officialSource.url} target="_blank" rel="noopener noreferrer" className="underline hover:text-white">
              {brand.officialSource.label}
            </a>{" "}
            on {new Date(brand.officialSource.checked).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}.
          </p>
        )}
      </BlueprintBanner>

      <div className="container-page space-y-14 py-10">
        {current.length > 0 && (
          <section aria-labelledby="models-title">
            <SectionHeader
              id="models-title"
              eyebrow="Popular models"
              title={`${brand.name} motorcycles`}
              action={{ label: "Motorcycle directory", href: `/models?brand=${brand.slug}` }}
            />
            <ul className="grid grid-cols-1 gap-3 min-[460px]:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {current.map((m) => (
                <li key={m.id}>
                  <ModelCard
                    model={m}
                    brandName={brand.name}
                    productCount={modelCounts.get(m.id) ?? 0}
                    categories={modelCategoryGroups(catalog, m.id).map(({ group }) => categoryShortName(group))}
                  />
                </li>
              ))}
            </ul>
          </section>
        )}

        {withSpecs.length > 0 && (
          <section aria-labelledby="lineup-specs-title">
            <SectionHeader
              id="lineup-specs-title"
              eyebrow="Official specifications"
              title={`${brand.name} line-up at a glance`}
              description="Engine, brakes and tyres for each model, as published by the manufacturer. Choose a model for every variant's details."
            />
            <LineupSpecTable models={withSpecs} brandName={brand.name} />
          </section>
        )}

        {other.length > 0 && (
          <section aria-labelledby="other-models-title" className="card p-5">
            <h2 id="other-models-title" className="display text-2xl text-ink">
              Other {brand.name} models
            </h2>
            <p className="mt-1 text-sm text-muted">
              {modelStatusLabels["official-other"]}: listed on {brand.name}&apos;s official site for other markets. Parts
              may still be available; ask us.
            </p>
            <ul className="mt-4 flex flex-wrap gap-2">
              {other.map((m) => (
                <li key={m.id}>
                  <Link href={`/models/${m.slug}`} className="chip">
                    {m.name}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        {groupsWithParts.length > 0 && (
          <section aria-labelledby="brand-cats-title">
            <SectionHeader id="brand-cats-title" eyebrow="Categories" title={`${brand.name} parts by type`} />
            <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {groupsWithParts.map((g) => (
                <li key={g.slug}>
                  <CategoryImageCard
                    group={g}
                    count={counts.get(g.slug) ?? 0}
                    href={`/brands/${brand.slug}?category=${g.slug}#parts`}
                  />
                </li>
              ))}
            </ul>
          </section>
        )}

        <section id="parts" aria-labelledby="brand-products-title" className="scroll-mt-40">
          <SectionHeader id="brand-products-title" eyebrow="Catalogue" title={`Parts listed for ${brand.name}`} />
          <ProductListing
            basePath={`/brands/${brand.slug}`}
            searchParams={searchParams}
            scope={{ brand: brand.slug }}
            emptyTitle={`No ${brand.name} parts listed yet`}
          />
        </section>
      </div>
    </>
  );
}
