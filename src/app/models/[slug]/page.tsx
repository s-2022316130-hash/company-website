import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ExternalLink } from "lucide-react";
import { TrackView } from "@/components/analytics/Track";
import { BrandMark } from "@/components/brand/BrandMark";
import { BrandRelationBadge } from "@/components/catalog/Badges";
import { bikeClassName, CategoryImageCard, categoryShortName } from "@/components/catalog/DirectoryCards";
import { ProductGrid } from "@/components/catalog/ProductCard";
import { ProductListing } from "@/components/catalog/ProductListing";
import { ManualFacts } from "@/components/catalog/ManualFacts";
import { VariantSpecTable } from "@/components/catalog/VariantSpecs";
import { CallButton, WhatsAppButton } from "@/components/contact/ContactActions";
import { BikeBanner } from "@/components/layout/Banners";
import { CategoryIcon } from "@/components/ui/CategoryIcon";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { business } from "@/config/business";
import {
  categoryPath,
  loadCatalog,
  modelCategoryGroups,
  modelDisplayName,
  modelStatusLabels,
  popularForModel,
  productFitsModel,
  spreadByCategory,
} from "@/lib/catalog/catalog";
import { pluralize } from "@/lib/format";
import { motorcycleImage } from "@/lib/images";
import { pageMetadata } from "@/lib/seo";
import type { MotorcycleModel } from "@/lib/types";

/** "Front: disc · Rear: disc or drum · Fuel: fuel injection", from the official spec page. */
function specLine(model: MotorcycleModel): string | undefined {
  const s = model.spec;
  const list = (xs?: string[]) => xs?.map((x) => (x === "fi" ? "fuel injection" : x)).join(" or ");
  const parts = [
    s?.frontBrake && `Front brake: ${list(s.frontBrake)}`,
    s?.rearBrake && `Rear brake: ${list(s.rearBrake)}`,
    s?.fuel && `Fuel: ${list(s.fuel)}`,
  ].filter(Boolean);
  return parts.length > 0 ? parts.join(" · ") : undefined;
}

export async function generateMetadata(props: PageProps<"/models/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const { models, brandBySlug } = await loadCatalog();
  const model = models.find((m) => m.slug === slug);
  if (!model) return { title: "Motorcycle not found", robots: { index: false } };
  const name = modelDisplayName(model, brandBySlug);
  return pageMetadata({
    title: `${name} Parts`,
    description: `Spare parts listed for the ${name}: brake parts, filters, chain and sprocket, cables and more. Check price and availability with Nirob Autos, Madhupur.`,
    path: `/models/${model.slug}`,
  });
}

export default async function ModelPage(props: PageProps<"/models/[slug]">) {
  const [{ slug }, searchParams] = await Promise.all([props.params, props.searchParams]);
  const catalog = await loadCatalog();
  const model = catalog.models.find((m) => m.slug === slug);
  if (!model) notFound();

  const brand = catalog.brandBySlug.get(model.brand);
  const brandName = brand?.name ?? model.brand;
  const name = modelDisplayName(model, catalog.brandBySlug);
  const fits = catalog.products.filter((p) => productFitsModel(p, model.id));
  const groups = modelCategoryGroups(catalog, model.id);
  const notListed = catalog.groups.filter((g) => !groups.some((x) => x.group.slug === g.slug));
  const popular = popularForModel(catalog, model.id, 8);
  // Not model-specific maintenance items and accessories, clearly labelled as such.
  const maintenance = spreadByCategory(
    catalog.products.filter(
      (p) => p.fitment === "universal" && (p.category === "oils-fluids" || p.category === "accessories"),
    ),
    4,
  );
  const eyebrowExtras = [model.family && model.family !== model.name ? `${model.family} family` : undefined, bikeClassName(model.class)]
    .filter(Boolean)
    .join(" · ");
  const spec = !model.variants?.length ? specLine(model) : undefined;

  return (
    <>
      <TrackView event="model_view" props={{ model: model.id }} />
      <BikeBanner
        crumbs={[
          { label: "Motorcycles", href: "/models" },
          ...(brand ? [{ label: brand.name, href: `/brands/${brand.slug}` }] : []),
          { label: model.name, href: `/models/${model.slug}` },
        ]}
        bikeClass={model.class}
        image={motorcycleImage(model, brandName)}
        imageName={name}
        imageLink={
          model.source && (
            <a href={model.source} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 underline hover:text-white">
              Official model page <ExternalLink className="size-3.5" aria-hidden="true" />
            </a>
          )
        }
        heading={
          <>
            <BrandRelationBadge brandSlug={model.brand} detail className="px-2 py-1 text-[0.8125rem]" />
            <h1 className="mt-3">
              <span className="flex flex-wrap items-center gap-x-2.5 gap-y-1 font-display text-base font-semibold uppercase tracking-[0.14em] text-brand-bright sm:text-lg">
                <BrandMark slug={model.brand} name={brandName} className="text-[1.35rem] tracking-[0.1em] sm:text-2xl" logoClassName="h-6 sm:h-7" />
                {eyebrowExtras && <span className="text-on-dark-muted">· {eyebrowExtras}</span>}
              </span>
              <span className="display mt-1 block text-[3rem] text-white sm:text-7xl lg:text-[5rem]">{model.name}</span>
              <span className="display mt-2 block text-[1.4rem] text-on-dark sm:text-3xl">Compatible spare parts</span>
            </h1>
          </>
        }
      >
        <p className="mt-4 max-w-xl text-[0.9375rem] text-on-dark-muted">
          Parts listed as fitting the {name}. Confirm with the shop before ordering if you are unsure of your bike&apos;s
          version or year.
        </p>
        <p className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-on-dark-muted">
          <span className="rounded border border-white/15 px-2 py-0.5 text-on-dark">{modelStatusLabels[model.status]}</span>
          {fits.length > 0 && (
            <span>
              <strong className="text-white">{pluralize(fits.length, "part")}</strong> listed
            </span>
          )}
        </p>
        {/* Models without a variant table still show the brake and fuel facts from their official page. */}
        {spec && (
          <p className="mt-2 text-sm text-on-dark-muted">
            <span className="text-on-dark">Official spec:</span> {spec}
          </p>
        )}
        <div className="mt-5 flex flex-wrap gap-2">
          <WhatsAppButton message={`Hello ${business.name}, I need parts for my ${name}. `} label="Ask on WhatsApp" />
          <CallButton variant="outline-dark" label="Call the shop" />
        </div>
      </BikeBanner>

      <div className="container-page space-y-14 py-8 sm:py-10">
        <section aria-labelledby="model-cats-title">
          <h2 id="model-cats-title" className="font-display text-sm font-semibold uppercase tracking-[0.14em] text-muted">
            {groups.length > 0 ? `${model.name} parts by category` : "Parts available on request"}
          </h2>
          {groups.length > 0 ? (
            <>
              <ul className="scrollbar-none -mx-4 mt-3 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0">
                {groups.map(({ group, count }) => (
                  <li key={group.slug} className="shrink-0">
                    <Link href={`/models/${model.slug}?category=${group.slug}#parts`} className="chip gap-2 font-semibold text-ink">
                      <CategoryIcon name={group.icon} className="size-4 text-brand" />
                      {group.name}
                      <span className="font-normal text-muted">{count}</span>
                    </Link>
                  </li>
                ))}
              </ul>
              {notListed.length > 0 && (
                <p className="mt-3 text-sm text-muted">
                  Also available on request: {notListed.map((g) => categoryShortName(g)).join(", ")}. Ask the shop for these parts.
                </p>
              )}
            </>
          ) : (
            <>
              <div className="card mb-4 mt-3 flex flex-wrap items-center justify-between gap-3 p-5">
                <p className="text-[0.9375rem] text-ink">
                  <strong className="font-semibold">Parts available on request</strong>: contact {business.name} for fitment
                  for the {name}.
                </p>
                <WhatsAppButton message={`Hello ${business.name}, I need parts for my ${name}. `} label="Ask on WhatsApp" />
              </div>
              <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                {catalog.groups.map((group) => (
                  <li key={group.slug}>
                    <CategoryImageCard group={group} count={0} href={categoryPath(group.slug)} />
                  </li>
                ))}
              </ul>
            </>
          )}
        </section>

        {popular.length > 0 && (
          <section aria-labelledby="model-popular-title">
            <SectionHeader
              id="model-popular-title"
              eyebrow="Compatible spare parts"
              title={`Popular parts for the ${name}`}
              action={fits.length > popular.length ? { label: `All ${fits.length} parts`, href: "#parts" } : undefined}
            />
            <ProductGrid products={popular} priorityCount={4} />
          </section>
        )}

        {model.variants && model.variants.length > 0 && (
          <section aria-labelledby="model-specs-title">
            <SectionHeader
              id="model-specs-title"
              eyebrow="Official specifications"
              title={model.variants.length > 1 ? `${model.name} variants compared` : `${model.name} specifications`}
              description="The brake, tyre and suspension details that decide which parts fit."
            />
            <VariantSpecTable variants={model.variants} makerName={brand?.name ?? "the manufacturer"} />
          </section>
        )}

        {model.manual && (
          <section aria-labelledby="model-manual-title">
            <SectionHeader
              id="model-manual-title"
              eyebrow="Owner's manual"
              title={`${model.name} maintenance facts`}
              description="Oil grade, spark plugs, battery, tyre pressures and service intervals, from the manufacturer's manual."
            />
            <ManualFacts manual={model.manual} />
          </section>
        )}

        {fits.length > popular.length && (
          <section id="parts" aria-labelledby="model-all-title" className="scroll-mt-40">
            <SectionHeader id="model-all-title" eyebrow="Catalogue" title={`All ${model.name} parts`} />
            <ProductListing
              basePath={`/models/${model.slug}`}
              searchParams={searchParams}
              scope={{ model: model.id }}
              emptyTitle={`No parts listed for the ${name} yet`}
              emptyDescription={`The online catalogue does not list ${name} parts yet, but the shop may have them. Ask by phone or WhatsApp.`}
            />
          </section>
        )}
        {fits.length > 0 && fits.length <= popular.length && <div id="parts" />}

        {maintenance.length > 0 && (
          <section aria-labelledby="maint-title">
            <SectionHeader
              id="maint-title"
              eyebrow="Maintenance & accessories"
              title="For every bike"
              description="These are not specific to one model. Ask the shop which grade or size suits your bike."
              action={{ label: "Engine oil & fluids", href: "/engine-oil" }}
            />
            <ProductGrid products={maintenance} />
          </section>
        )}
      </div>
    </>
  );
}
