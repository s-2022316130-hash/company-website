import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BadgeCheck, ExternalLink } from "lucide-react";
import { TrackView } from "@/components/analytics/Track";
import { bikeClassLabel } from "@/components/bikes/BikeArt";
import { bikeClassName, CategoryImageCard, categoryShortName } from "@/components/catalog/DirectoryCards";
import { ProductGrid } from "@/components/catalog/ProductCard";
import { ProductListing } from "@/components/catalog/ProductListing";
import { ManualFacts } from "@/components/catalog/ManualFacts";
import { VariantSpecTable } from "@/components/catalog/VariantSpecs";
import { CallButton, WhatsAppButton } from "@/components/contact/ContactActions";
import { BlueprintBanner } from "@/components/layout/Banners";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { business, dealershipFor } from "@/config/business";
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
  const dealer = dealershipFor(model.brand);
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

  return (
    <>
      <TrackView event="model_view" props={{ model: model.id }} />
      <BlueprintBanner
        bikeClass={model.class}
        eyebrow={[brand?.name, model.family && model.family !== model.name ? `${model.family} family` : undefined, bikeClassName(model.class)]
          .filter(Boolean)
          .join(" · ")}
        title={`${name} parts`}
        crumbs={[
          { label: "Motorcycles", href: "/models" },
          ...(brand ? [{ label: brand.name, href: `/brands/${brand.slug}` }] : []),
          { label: model.name, href: `/models/${model.slug}` },
        ]}
        aside={`Line drawing of a ${bikeClassLabel(model.class)}, not the exact model`}
        description={
          <>
            Parts listed as fitting the {name}. Confirm with the shop before ordering if you are unsure of your bike&apos;s
            version or year.
            {dealer && (
              <span className="mt-3 flex items-start gap-2 rounded-md border border-brand-bright/40 bg-brand-bright/10 px-3 py-2 text-sm text-on-dark">
                <BadgeCheck className="mt-0.5 size-4 shrink-0 text-brand-bright" aria-hidden="true" />
                <span>
                  {business.name} is a dealer for <strong className="text-white">{dealer.company}</strong>. Genuine{" "}
                  {brand?.name} parts at company price.
                </span>
              </span>
            )}
            <span className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-on-dark-muted">
              <span className="rounded border border-white/15 px-2 py-0.5 text-on-dark">{modelStatusLabels[model.status]}</span>
              {model.source && (
                <a href={model.source} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 underline hover:text-white">
                  Official model page <ExternalLink className="size-3.5" aria-hidden="true" />
                </a>
              )}
            </span>
            {/* Models without a variant table still show the brake and fuel facts from their official page. */}
            {!model.variants?.length && specLine(model) && (
              <span className="mt-2 block text-sm text-on-dark-muted">
                <span className="text-on-dark">Official spec:</span> {specLine(model)}
              </span>
            )}
          </>
        }
      >
        <div className="mt-5 flex flex-wrap gap-2">
          <WhatsAppButton message={`Hello ${business.name}, I need parts for my ${name}. `} label="Ask on WhatsApp" />
          <CallButton variant="outline-dark" label="Call the shop" />
        </div>
      </BlueprintBanner>

      <div className="container-page space-y-14 py-10">
        <section aria-labelledby="model-cats-title">
          <SectionHeader
            id="model-cats-title"
            eyebrow="Available part categories"
            title={`Parts for the ${model.name}`}
            description={groups.length > 0 ? "Choose a part type to see the listings for this bike." : undefined}
          />
          {groups.length > 0 ? (
            <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {groups.map(({ group, count }) => (
                <li key={group.slug}>
                  <CategoryImageCard group={group} count={count} href={`/models/${model.slug}?category=${group.slug}#parts`} />
                </li>
              ))}
            </ul>
          ) : (
            <>
              <div className="card mb-4 flex flex-wrap items-center justify-between gap-3 p-5">
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
          {groups.length > 0 && notListed.length > 0 && (
            <p className="mt-3 text-sm text-muted">
              Also available on request: {notListed.map((g) => categoryShortName(g)).join(", ")}. Ask the shop for these parts.
            </p>
          )}
        </section>

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

        {popular.length > 0 && (
          <section aria-labelledby="model-popular-title">
            <SectionHeader id="model-popular-title" eyebrow="Popular for your bike" title={`Popular parts for the ${name}`} />
            <ProductGrid products={popular} priorityCount={4} />
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
