import type { Metadata } from "next";
import Link from "next/link";
import { Check } from "lucide-react";
import { BikeVisual } from "@/components/bikes/BikeVisual";
import { BrandMark } from "@/components/brand/BrandMark";
import { BrandRelationBadge } from "@/components/catalog/Badges";
import { bikeClassName, CategoryImageCard, categoryShortName, ModelCard } from "@/components/catalog/DirectoryCards";
import { ProductGrid } from "@/components/catalog/ProductCard";
import { ProductImage } from "@/components/catalog/ProductImage";
import { getPhoto } from "@/config/images";
import { CallButton, WhatsAppButton } from "@/components/contact/ContactActions";
import { PageHeader } from "@/components/layout/PageHeader";
import { EmptyState } from "@/components/ui/EmptyState";
import { business } from "@/config/business";
import {
  brandFeatureModel,
  brandsByRelation,
  countBy,
  loadCatalog,
  modelCategoryGroups,
  modelDisplayName,
  modelsForBrand,
  productFitsModel,
  productInCategory,
  spreadByCategory,
} from "@/lib/catalog/catalog";
import { cx } from "@/lib/cx";
import { pluralize } from "@/lib/format";
import { motorcycleImage } from "@/lib/images";
import { pageMetadata } from "@/lib/seo";
import type { MotorcycleModel } from "@/lib/types";

export const metadata: Metadata = pageMetadata({
  title: "Part Finder: Find Parts for Your Motorcycle",
  description:
    "Choose your motorcycle brand and model, then the part you need, to see compatible spare parts at Nirob Autos, Madhupur.",
  path: "/part-finder",
});

const first = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v) ?? "";

export default async function PartFinderPage(props: PageProps<"/part-finder">) {
  const [sp, catalog] = await Promise.all([props.searchParams, loadCatalog()]);

  // Invalid or mismatched values fall back to the previous step instead of erroring.
  const brand = catalog.brandBySlug.get(first(sp.brand));
  const model = brand ? catalog.models.find((m) => m.id === first(sp.model) && m.brand === brand.slug) : undefined;
  const fits = model ? catalog.products.filter((p) => productFitsModel(p, model.id)) : [];
  const groups = model ? modelCategoryGroups(catalog, model.id) : [];
  const categorySlug = first(sp.category);
  const group = model ? catalog.groups.find((g) => g.slug === categorySlug) : undefined;
  const showAll = Boolean(model) && categorySlug === "all";
  const groupFits = group ? fits.filter((p) => productInCategory(p, group.slug)) : [];
  // Step 4: the part types inside the chosen category that have listings for this bike.
  const partTypes = group
    ? group.subcategories
        .map((s) => ({ sub: s, count: groupFits.filter((p) => p.subcategory === s.slug).length }))
        .filter((x) => x.count > 0)
    : [];
  const partSlug = first(sp.part);
  const sub = partTypes.find((x) => x.sub.slug === partSlug)?.sub;
  const showGroup = Boolean(group) && (partSlug === "all" || partTypes.length <= 1);

  const step = !brand ? 1 : !model ? 2 : !group && !showAll ? 3 : group && !sub && !showGroup ? 4 : 5;
  const bikeName = model ? modelDisplayName(model, catalog.brandBySlug) : "";
  const results =
    step === 5 ? spreadByCategory(sub ? groupFits.filter((p) => p.subcategory === sub.slug) : group ? groupFits : fits, 400) : [];
  const modelCounts = countBy(catalog.products, (p) => p.compatibleModels);
  const modelHref = model ? `/part-finder?brand=${model.brand}&model=${model.id}` : "";
  const groupHref = group ? `${modelHref}&category=${group.slug}` : "";

  const steps = [
    { n: 1, label: "Brand", value: brand?.name, href: "/part-finder" },
    { n: 2, label: "Bike", value: model?.name, href: brand ? `/part-finder?brand=${brand.slug}` : undefined },
    { n: 3, label: "Category", value: group?.name ?? (showAll ? "All parts" : undefined), href: model ? modelHref : undefined },
    {
      n: 4,
      label: "Part",
      value: sub?.name ?? (showGroup && group ? `All ${categoryShortName(group).toLowerCase()}` : showAll ? "All parts" : undefined),
      href: group && partTypes.length > 1 ? groupHref : undefined,
    },
    { n: 5, label: "Results", value: undefined, href: undefined },
  ];

  return (
    <>
      <PageHeader
        eyebrow="Part finder"
        title="Find parts for your motorcycle"
        description="Choose your brand, then your bike, then what you need. We'll show the parts listed as fitting it."
        crumbs={[{ label: "Part finder", href: "/part-finder" }]}
      >
        <ol className="mt-6 grid grid-cols-5 gap-1.5 sm:gap-3" aria-label="Steps">
          {steps.map((s) => {
            const done = s.n < step;
            const current = s.n === step;
            const content = (
              <>
                <span
                  className={cx(
                    "grid size-8 shrink-0 place-items-center rounded-full font-display text-sm font-bold",
                    done ? "bg-white text-graphite" : current ? "bg-brand text-white" : "bg-white/10 text-on-dark-muted",
                  )}
                >
                  {done ? <Check className="size-4" aria-hidden="true" /> : `0${s.n}`}
                </span>
                <span className="min-w-0 max-w-full">
                  <span
                    className={cx(
                      "block truncate font-display text-[0.6875rem] uppercase tracking-[0.1em] sm:text-xs sm:tracking-[0.12em]",
                      current ? "text-white" : "text-on-dark-muted",
                    )}
                  >
                    {s.label}
                  </span>
                  {s.value && <span className="hidden truncate text-sm font-semibold text-white sm:block">{s.value}</span>}
                </span>
              </>
            );
            const layout = "flex min-h-10 flex-col items-start gap-1 sm:flex-row sm:gap-2";
            return (
              <li
                key={s.n}
                aria-current={current ? "step" : undefined}
                className={cx("min-w-0 border-t-[3px] pt-2.5", done || current ? "border-brand-bright" : "border-white/15")}
              >
                {done && s.href ? (
                  <Link href={s.href} className={cx(layout, "hover:opacity-80")} aria-label={`Change ${s.label.toLowerCase()}: ${s.value}`}>
                    {content}
                  </Link>
                ) : (
                  <div className={layout}>{content}</div>
                )}
              </li>
            );
          })}
        </ol>
      </PageHeader>

      <div className="container-page py-8 sm:py-10">
        {step === 1 && (
          <StepSection title="Choose your motorcycle brand">
            <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {brandsByRelation(catalog).map((b) => {
                const feature = brandFeatureModel(catalog, b.slug);
                return (
                  <li key={b.slug}>
                    <Link
                      href={`/part-finder?brand=${b.slug}`}
                      className="group card-dark flex h-full flex-col overflow-hidden transition-colors hover:border-brand-bright/60"
                    >
                      <span className="relative block">
                        <BikeVisual
                          bikeClass={feature?.class ?? "street"}
                          image={feature ? motorcycleImage(feature, b.name) : undefined}
                          name={feature ? `${b.name} ${feature.name}` : b.name}
                          annotate={false}
                          sizes="(min-width: 1024px) 22vw, (min-width: 640px) 30vw, 48vw"
                          className="aspect-[16/10]"
                        />
                        <BrandRelationBadge brandSlug={b.slug} className="absolute right-2 top-2" />
                      </span>
                      <span className="flex items-center justify-between gap-2 p-3">
                        <BrandMark slug={b.slug} name={b.name} className="text-2xl text-white" logoClassName="h-7" />
                        <span className="text-xs text-on-dark-muted">{pluralize(modelsForBrand(catalog, b.slug).length, "model")}</span>
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </StepSection>
        )}

        {step === 2 && brand && (
          <StepSection title={`Choose your ${brand.name}`}>
            <ul className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
              {modelsForBrand(catalog, brand.slug).map((m) => (
                <li key={m.id}>
                  <ModelCard
                    model={m}
                    brandName={brand.name}
                    productCount={modelCounts.get(m.id) ?? 0}
                    categories={modelCategoryGroups(catalog, m.id).map(({ group }) => categoryShortName(group))}
                    href={`/part-finder?brand=${brand.slug}&model=${m.id}`}
                    cta="Choose this bike"
                  />
                </li>
              ))}
            </ul>
            <p className="mt-5 text-sm text-muted">
              Bike not listed?{" "}
              <a href={`tel:${business.phones.orders.e164}`} className="font-semibold text-brand underline">
                Call {business.phones.orders.display}
              </a>{" "}
              and tell us your model.
            </p>
          </StepSection>
        )}

        {model && step >= 3 && (
          <SelectedBike
            name={bikeName}
            brandName={brand?.name ?? model.brand}
            model={model}
            partCount={fits.length}
            changeHref={`/part-finder?brand=${model.brand}`}
          />
        )}

        {step === 3 && model && (
          <StepSection title={`What do you need for the ${bikeName}?`}>
            {groups.length > 0 ? (
              <>
                <Link href={`${modelHref}&category=all`} className="btn btn-dark mb-5">
                  Show all {pluralize(fits.length, "part")} for this bike
                </Link>
                <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                  {groups.map(({ group: g, count }) => (
                    <li key={g.slug}>
                      <CategoryImageCard group={g} count={count} href={`${modelHref}&category=${g.slug}`} />
                    </li>
                  ))}
                </ul>
              </>
            ) : (
              <AskInstead bikeName={bikeName} what="parts" />
            )}
            {groups.length > 0 && groups.length < catalog.groups.length && (
              <p className="mt-4 text-sm text-muted">
                Also available on request:{" "}
                {catalog.groups
                  .filter((g) => !groups.some((x) => x.group.slug === g.slug))
                  .map((g) => categoryShortName(g))
                  .join(", ")}
                . Ask the shop for these parts.
              </p>
            )}
          </StepSection>
        )}

        {step === 4 && model && group && (
          <StepSection title={`Which ${categoryShortName(group).toLowerCase()} part for the ${bikeName}?`}>
            <Link href={`${groupHref}&part=all`} className="btn btn-dark mb-5">
              Show all {pluralize(groupFits.length, "part")} in {group.name}
            </Link>
            <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {partTypes.map(({ sub: s, count }) => {
                const photo = getPhoto(s.image);
                return (
                  <li key={s.slug}>
                    <Link href={`${groupHref}&part=${s.slug}`} className="card group flex h-full flex-col overflow-hidden hover:border-brand">
                      <ProductImage
                        image={photo ? { src: photo.src, alt: "", representative: true, position: photo.position } : undefined}
                        art={s.art}
                        icon={group.icon}
                        aspect="aspect-[4/3]"
                        sizes="(min-width: 1024px) 22vw, (min-width: 640px) 30vw, 48vw"
                        zoom
                      />
                      <span className="flex flex-1 items-center justify-between gap-2 border-t-2 border-brand/80 p-3">
                        <span className="font-semibold text-ink group-hover:text-brand">{s.name}</span>
                        <span className="shrink-0 text-xs text-muted">{pluralize(count, "part")}</span>
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </StepSection>
        )}

        {step === 5 && model && (
          <StepSection
            title={
              sub
                ? `${sub.name} for the ${bikeName}`
                : group
                  ? `${group.name} for the ${bikeName}`
                  : `All parts for the ${bikeName}`
            }
          >
            {results.length > 0 ? (
              <>
                <p className="mb-4 text-sm text-muted">{pluralize(results.length, "part")} listed as fitting this bike.</p>
                <ProductGrid products={results} priorityCount={4} />
              </>
            ) : (
              <EmptyState
                title="Parts available on request"
                description={`We haven't listed ${group ? group.name.toLowerCase() : "parts"} for the ${bikeName} online yet. Contact ${business.name} for fitment and we'll check.`}
                actions={[{ label: "Choose another part type", href: modelHref, variant: "outline" }]}
              >
                <AskButtons bikeName={bikeName} what={group ? group.name.toLowerCase() : "parts"} />
              </EmptyState>
            )}
          </StepSection>
        )}
      </div>
    </>
  );
}

function StepSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section aria-labelledby="step-title">
      <h2 id="step-title" className="display mb-5 text-3xl text-ink sm:text-4xl">
        {title}
      </h2>
      {children}
    </section>
  );
}

/** Banner showing the chosen bike once steps 1–2 are done. */
function SelectedBike({
  name,
  brandName,
  model,
  partCount,
  changeHref,
}: {
  name: string;
  brandName: string;
  model: MotorcycleModel;
  partCount: number;
  changeHref: string;
}) {
  return (
    <div className="card-dark mb-8 grid overflow-hidden sm:grid-cols-[minmax(0,16rem)_minmax(0,1fr)]">
      <BikeVisual
        bikeClass={model.class}
        image={motorcycleImage(model, brandName)}
        name={name}
        sizes="(min-width: 640px) 16rem, 100vw"
        className="aspect-[16/10] sm:aspect-auto sm:min-h-36"
      />
      <div className="flex flex-col justify-center gap-1 p-5">
        <p className="eyebrow eyebrow-dark">Your bike · {bikeClassName(model.class)}</p>
        <p className="display text-3xl text-white">{name}</p>
        <p className="text-sm text-on-dark-muted">
          {partCount > 0 ? `${pluralize(partCount, "catalogue item")} for this bike` : "Parts available on request"}
        </p>
        <p className="mt-2 flex flex-wrap gap-3 text-sm">
          <Link href={`/models/${model.slug}`} className="font-semibold text-brand-bright underline">
            Open bike page
          </Link>
          <Link href={changeHref} className="text-on-dark-muted underline hover:text-white">
            Change bike
          </Link>
        </p>
      </div>
    </div>
  );
}

function AskButtons({ bikeName, what }: { bikeName: string; what: string }) {
  return (
    <div className="mt-5 flex flex-wrap justify-center gap-2">
      <WhatsAppButton message={`Hello ${business.name}, I need ${what} for my ${bikeName}. Do you have them?`} label="Ask on WhatsApp" />
      <CallButton variant="outline" />
    </div>
  );
}

function AskInstead({ bikeName, what }: { bikeName: string; what: string }) {
  return (
    <EmptyState
      title="Parts available on request"
      description={`The online catalogue doesn't list ${what} for the ${bikeName} yet. Contact ${business.name} for fitment and we'll check.`}
    >
      <AskButtons bikeName={bikeName} what={what} />
    </EmptyState>
  );
}
