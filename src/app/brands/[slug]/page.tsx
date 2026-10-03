import type { Metadata } from "next";
import Form from "next/form";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Bike, Search } from "lucide-react";
import { TrackView } from "@/components/analytics/Track";
import { BrandMark } from "@/components/brand/BrandMark";
import { BrandRelationBadge } from "@/components/catalog/Badges";
import { CategoryImageCard, categoryShortName, ModelCard } from "@/components/catalog/DirectoryCards";
import { LineupSpecTable } from "@/components/catalog/VariantSpecs";
import { business, dealershipFor, sellsOriginalParts } from "@/config/business";
import { ProductListing } from "@/components/catalog/ProductListing";
import { BikeBanner } from "@/components/layout/Banners";
import { Reveal } from "@/components/motion/Reveal";
import { SectionHeader } from "@/components/ui/SectionHeader";
import {
  brandFeatureModel,
  categoryCounts,
  countBy,
  loadCatalog,
  modelCategoryGroups,
  modelsForBrand,
  modelStatusLabels,
  productFitsBrand,
  spreadByCategory,
} from "@/lib/catalog/catalog";
import { ProductGrid } from "@/components/catalog/ProductCard";
import { pluralize } from "@/lib/format";
import { motorcycleImage } from "@/lib/images";
import { pageMetadata } from "@/lib/seo";
import type { MotorcycleModel } from "@/lib/types";

export async function generateMetadata(props: PageProps<"/brands/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const { brandBySlug } = await loadCatalog();
  const brand = brandBySlug.get(slug);
  if (!brand) return { title: "Brand not found", robots: { index: false } };
  const dealer = dealershipFor(brand.slug);
  const relation = dealer
    ? `Authorized dealer of ${dealer.company}: genuine ${brand.name} parts at company price.`
    : sellsOriginalParts(brand.slug)
      ? `Original ${brand.name} parts.`
      : "";
  return pageMetadata({
    title: `${brand.name} Motorcycle Parts`,
    description: `${relation} Spare parts, filters, brake parts and maintenance products for ${brand.name} motorcycles at Nirob Auto's, Madhupur. Browse by model.`.trim(),
    path: `/brands/${brand.slug}`,
  });
}

const formatChecked = (iso: string) =>
  new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });

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
  const current = models.filter((m) => m.status === "bd-current");
  const earlier = models.filter((m) => m.status === "bd-earlier");
  const other = models.filter((m) => m.status === "official-other");
  const q = typeof searchParams.q === "string" ? searchParams.q : "";
  const dealer = dealershipFor(brand.slug);
  const original = sellsOriginalParts(brand.slug);
  const popular = spreadByCategory(
    brandProducts.filter((p) => p.isFastMoving || p.isPopular),
    8,
  );
  const withSpecs = current.filter((m) => m.variants && m.variants.length > 0);
  const feature = brandFeatureModel(catalog, brand.slug);

  const modelGrid = (list: MotorcycleModel[]) => (
    <ul className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
      {list.map((m) => (
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
  );

  return (
    <>
      <TrackView event="brand_view" props={{ brand: brand.slug }} />
      <BikeBanner
        crumbs={[
          { label: "Brands", href: "/brands" },
          { label: brand.name, href: `/brands/${brand.slug}` },
        ]}
        bikeClass={feature?.class ?? "street"}
        image={feature ? motorcycleImage(feature, brand.name) : undefined}
        imageName={feature ? `${brand.name} ${feature.name}` : brand.name}
        imageLink={
          feature && (
            <Link href={`/models/${feature.slug}`} className="inline-flex items-center gap-1 font-semibold text-brand-bright hover:text-white">
              {feature.name} parts <ArrowRight className="size-3.5" aria-hidden="true" />
            </Link>
          )
        }
        heading={
          <>
            <BrandMark slug={brand.slug} name={brand.name} fallback="none" logoClassName="mb-4 h-10 sm:h-12" />
            <BrandRelationBadge brandSlug={brand.slug} detail className="px-2 py-1 text-[0.8125rem]" />
            <h1 className="display mt-3 text-[2.6rem] text-white sm:text-6xl lg:text-[4.25rem]">{brand.name} motorcycle parts</h1>
            <p className="mt-3 max-w-xl text-[0.9375rem] text-on-dark sm:text-lg">
              {dealer ? (
                <>
                  Genuine {brand.name} parts at company price. {business.name} is an authorized dealer of{" "}
                  <strong className="text-white">{dealer.company}</strong>
                  {"note" in dealer ? `, the ${dealer.note}` : ""}.
                </>
              ) : original ? (
                <>Original {brand.name} parts at affordable prices. Ask the shop for availability.</>
              ) : (
                <>Parts and maintenance products listed for {brand.name} motorcycles.</>
              )}{" "}
              Pick your model for the most accurate parts list.
            </p>
          </>
        }
      >
        <p className="mt-4 flex flex-wrap gap-x-5 gap-y-1 text-sm text-on-dark-muted">
          <span>
            <strong className="text-white">{pluralize(models.length, "model")}</strong> in the directory
          </span>
          <span>
            <strong className="text-white">{pluralize(brandProducts.length, "part")}</strong> listed
          </span>
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <a href="#parts" className="btn btn-primary">
            Explore {brand.name} parts <ArrowRight className="size-4" aria-hidden="true" />
          </a>
          <Link href={`/part-finder?brand=${brand.slug}`} className="btn btn-outline-dark">
            <Bike className="size-4" aria-hidden="true" /> Find parts for your {brand.name}
          </Link>
        </div>
        <Form action={`/brands/${brand.slug}`} className="mt-4 flex max-w-xl gap-2" role="search" scroll={false}>
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
          <button type="submit" className="btn btn-outline-dark shrink-0">
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
            on {formatChecked(brand.officialSource.checked)}.
          </p>
        )}
      </BikeBanner>

      <div className="container-page space-y-14 py-10">
        {current.length > 0 && (
          <Reveal as="section" variant="self" aria-labelledby="models-title">
            <SectionHeader
              id="models-title"
              eyebrow="Current line-up"
              title={`Current ${brand.name} models`}
              description={`${brand.name}'s Bangladesh line-up. Choose your bike to see its compatible parts.`}
              action={{ label: "Motorcycle directory", href: `/models?brand=${brand.slug}` }}
            />
            {modelGrid(current)}
          </Reveal>
        )}

        {earlier.length > 0 && (
          <Reveal as="section" variant="self" aria-labelledby="earlier-models-title">
            <SectionHeader
              id="earlier-models-title"
              eyebrow={modelStatusLabels["bd-earlier"]}
              title={`Earlier ${brand.name} models`}
              description="No longer in the line-up, but still on the road. Parts may still be available."
            />
            {modelGrid(earlier)}
          </Reveal>
        )}

        {popular.length > 0 && (
          <Reveal as="section" variant="self" aria-labelledby="brand-popular-title">
            <SectionHeader
              id="brand-popular-title"
              eyebrow="Popular parts"
              title={`Fast-moving ${brand.name} parts`}
              description="Routine wear parts riders replace most often. Catalogue items: ask us to confirm stock and fit."
            />
            <ProductGrid products={popular} />
          </Reveal>
        )}

        {withSpecs.length > 0 && (
          <Reveal as="section" variant="self" aria-labelledby="lineup-specs-title">
            <SectionHeader
              id="lineup-specs-title"
              eyebrow="Official specifications"
              title={`${brand.name} line-up at a glance`}
              description="Engine, brakes and tyres for each model, as published by the manufacturer. Choose a model for every variant's details."
            />
            <LineupSpecTable models={withSpecs} brandName={brand.name} />
          </Reveal>
        )}

        {groupsWithParts.length > 0 && (
          <Reveal as="section" variant="self" aria-labelledby="brand-cats-title">
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
          </Reveal>
        )}

        {other.length > 0 && (
          <Reveal as="section" variant="self" aria-labelledby="other-models-title" className="card p-5">
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
          </Reveal>
        )}

        <Reveal as="section" variant="self" id="parts" aria-labelledby="brand-products-title">
          <SectionHeader id="brand-products-title" eyebrow="Catalogue" title={`Parts listed for ${brand.name}`} />
          <ProductListing
            basePath={`/brands/${brand.slug}`}
            searchParams={searchParams}
            scope={{ brand: brand.slug }}
            emptyTitle={`No ${brand.name} parts listed yet`}
          />
        </Reveal>
      </div>
    </>
  );
}
