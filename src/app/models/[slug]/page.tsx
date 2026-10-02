import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { TrackView } from "@/components/analytics/Track";
import { ProductGrid } from "@/components/catalog/ProductCard";
import { ProductListing } from "@/components/catalog/ProductListing";
import { CallButton, WhatsAppButton } from "@/components/contact/ContactActions";
import { PageHeader } from "@/components/layout/PageHeader";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { business } from "@/config/business";
import { categoryCounts, loadCatalog, modelDisplayName, productFitsModel } from "@/lib/catalog/catalog";
import { pageMetadata } from "@/lib/seo";

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
  const name = modelDisplayName(model, catalog.brandBySlug);
  const fits = catalog.products.filter((p) => productFitsModel(p, model.id));
  const counts = categoryCounts(fits);
  const groupsWithParts = catalog.groups.filter((g) => counts.has(g.slug));
  // Not model-specific maintenance items and accessories, clearly labelled as such.
  const maintenance = catalog.products
    .filter((p) => p.fitment === "universal" && (p.category === "oils-fluids" || p.category === "accessories"))
    .slice(0, 4);

  return (
    <>
      <TrackView event="model_view" props={{ model: model.id }} />
      <PageHeader
        title={`${name} parts`}
        description={`Parts listed as fitting the ${name}. Confirm with the store before ordering if you are unsure of your bike's version.`}
        crumbs={[
          { label: "Motorcycles", href: "/models" },
          ...(brand ? [{ label: brand.name, href: `/brands/${brand.slug}` }] : []),
          { label: model.name, href: `/models/${model.slug}` },
        ]}
      >
        {groupsWithParts.length > 0 && (
          <ul className="mt-5 flex flex-wrap gap-2" aria-label="Part types for this bike">
            {groupsWithParts.map((g) => (
              <li key={g.slug}>
                <Link href={`/part-finder?brand=${model.brand}&model=${model.id}&category=${g.slug}`} className="chip">
                  {g.name}
                  <span className="text-xs text-muted">{counts.get(g.slug)}</span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </PageHeader>

      <div className="container-page space-y-12 py-6">
        <ProductListing
          basePath={`/models/${model.slug}`}
          searchParams={searchParams}
          scope={{ model: model.id }}
          emptyTitle={`No parts listed for the ${name} yet`}
          emptyDescription={`The online catalogue does not list ${name} parts yet, but the store may have them. Ask by phone or WhatsApp.`}
        />

        {fits.length === 0 && (
          <div className="flex flex-wrap justify-center gap-2">
            <WhatsAppButton
              message={`Hello ${business.name}, I need parts for my ${name}. `}
              label={`Ask about ${model.name} parts`}
            />
            <CallButton variant="outline" />
          </div>
        )}

        {maintenance.length > 0 && (
          <section aria-labelledby="maint-title">
            <SectionHeader
              id="maint-title"
              title="Maintenance products & accessories"
              description="These are not specific to one model. Ask the store which grade or size suits your bike."
              action={{ label: "Engine oil & fluids", href: "/engine-oil" }}
            />
            <ProductGrid products={maintenance} />
          </section>
        )}
      </div>
    </>
  );
}
