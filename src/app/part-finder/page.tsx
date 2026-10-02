import type { Metadata } from "next";
import Link from "next/link";
import { Check, ChevronRight } from "lucide-react";
import { ProductGrid } from "@/components/catalog/ProductCard";
import { CallButton, WhatsAppButton } from "@/components/contact/ContactActions";
import { PageHeader } from "@/components/layout/PageHeader";
import { CategoryIcon } from "@/components/ui/CategoryIcon";
import { EmptyState } from "@/components/ui/EmptyState";
import { business } from "@/config/business";
import {
  categoryCounts,
  countBy,
  loadCatalog,
  modelDisplayName,
  modelsForBrand,
  productFitsModel,
  productInCategory,
} from "@/lib/catalog/catalog";
import { sortProducts } from "@/lib/catalog/listing";
import { cx } from "@/lib/cx";
import { pluralize } from "@/lib/format";
import { pageMetadata } from "@/lib/seo";

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
  const counts = categoryCounts(fits);
  const categorySlug = first(sp.category);
  const group = model ? catalog.groups.find((g) => g.slug === categorySlug) : undefined;
  const showAll = Boolean(model) && categorySlug === "all";

  const step = !brand ? 1 : !model ? 2 : !group && !showAll ? 3 : 4;
  const bikeName = model ? modelDisplayName(model, catalog.brandBySlug) : "";
  const results = model && (group || showAll) ? sortProducts(group ? fits.filter((p) => productInCategory(p, group.slug)) : fits, "popular") : [];
  const modelCounts = countBy(catalog.products, (p) => p.compatibleModels);

  const steps = [
    { n: 1, label: "Brand", value: brand?.name, href: "/part-finder" },
    { n: 2, label: "Model", value: model?.name, href: brand ? `/part-finder?brand=${brand.slug}` : undefined },
    {
      n: 3,
      label: "Part type",
      value: group?.name ?? (showAll ? "All parts" : undefined),
      href: model ? `/part-finder?brand=${model.brand}&model=${model.id}` : undefined,
    },
    { n: 4, label: "Results", value: undefined, href: undefined },
  ];

  return (
    <>
      <PageHeader
        title="Part finder"
        description="Choose your bike, then what you need. We'll show the parts listed for it."
        crumbs={[{ label: "Part finder", href: "/part-finder" }]}
      >
        <ol className="mt-5 grid grid-cols-4 gap-1 sm:gap-2" aria-label="Steps">
          {steps.map((s) => {
            const done = s.n < step;
            const current = s.n === step;
            const content = (
              <>
                <span
                  className={cx(
                    "grid size-7 shrink-0 place-items-center rounded-full text-xs font-bold",
                    done ? "bg-ink text-white" : current ? "bg-brand text-white" : "bg-steel-soft text-muted",
                  )}
                >
                  {done ? <Check className="size-4" aria-hidden="true" /> : s.n}
                </span>
                <span className="min-w-0">
                  <span className={cx("block text-xs", current ? "font-semibold text-ink" : "text-muted")}>{s.label}</span>
                  {s.value && <span className="block truncate text-sm font-semibold text-ink">{s.value}</span>}
                </span>
              </>
            );
            return (
              <li
                key={s.n}
                aria-current={current ? "step" : undefined}
                className={cx("border-t-4 pt-2", done || current ? "border-brand" : "border-line")}
              >
                {done && s.href ? (
                  <Link href={s.href} className="flex min-h-10 items-start gap-2 hover:opacity-80" aria-label={`Change ${s.label.toLowerCase()}: ${s.value}`}>
                    {content}
                  </Link>
                ) : (
                  <div className="flex min-h-10 items-start gap-2">{content}</div>
                )}
              </li>
            );
          })}
        </ol>
      </PageHeader>

      <div className="container-page py-6">
        {step === 1 && (
          <StepSection title="1. Choose your motorcycle brand">
            <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
              {catalog.brands.map((b) => (
                <li key={b.slug}>
                  <Link
                    href={`/part-finder?brand=${b.slug}`}
                    className="card flex min-h-20 items-center justify-center p-4 font-display text-xl font-bold text-ink transition-colors hover:border-ink hover:text-brand"
                  >
                    {b.name}
                  </Link>
                </li>
              ))}
            </ul>
          </StepSection>
        )}

        {step === 2 && brand && (
          <StepSection title={`2. Choose your ${brand.name} model`}>
            <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
              {modelsForBrand(catalog, brand.slug).map((m) => (
                <li key={m.id}>
                  <Link
                    href={`/part-finder?brand=${brand.slug}&model=${m.id}`}
                    className="card flex min-h-14 items-center justify-between gap-2 px-4 py-3 transition-colors hover:border-ink"
                  >
                    <span className="font-semibold text-ink">{m.name}</span>
                    <span className="flex items-center gap-1 text-xs text-muted">
                      {(modelCounts.get(m.id) ?? 0) > 0 ? pluralize(modelCounts.get(m.id)!, "part") : "Ask us"}
                      <ChevronRight className="size-4" aria-hidden="true" />
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-sm text-muted">
              Model not listed?{" "}
              <a href={`tel:${business.phones.orders.e164}`} className="font-semibold text-brand underline">
                Call {business.phones.orders.display}
              </a>{" "}
              and tell us your bike.
            </p>
          </StepSection>
        )}

        {step === 3 && model && (
          <StepSection title={`3. What do you need for the ${bikeName}?`}>
            {fits.length > 0 && (
              <Link
                href={`/part-finder?brand=${model.brand}&model=${model.id}&category=all`}
                className="btn btn-dark mb-4"
              >
                Show all {pluralize(fits.length, "part")} for this bike
              </Link>
            )}
            <ul className="grid grid-cols-1 gap-2 min-[400px]:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {catalog.groups.map((g) => {
                const n = counts.get(g.slug) ?? 0;
                return (
                  <li key={g.slug}>
                    <Link
                      href={`/part-finder?brand=${model.brand}&model=${model.id}&category=${g.slug}`}
                      className={cx(
                        "card flex items-center gap-3 p-3 transition-colors hover:border-ink",
                        n === 0 && "bg-canvas",
                      )}
                    >
                      <CategoryIcon name={g.icon} className="size-6 shrink-0 text-steel" />
                      <span className="min-w-0">
                        <span className="block text-sm font-semibold leading-tight text-ink">{g.name}</span>
                        <span className="text-xs text-muted">{n > 0 ? pluralize(n, "listing") : "Not listed online, ask us"}</span>
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </StepSection>
        )}

        {step === 4 && model && (
          <StepSection title={group ? `${group.name} for the ${bikeName}` : `All parts for the ${bikeName}`}>
            {results.length > 0 ? (
              <>
                <p className="mb-4 text-sm text-muted">{pluralize(results.length, "product")} listed as fitting this bike.</p>
                <ProductGrid products={results} priorityCount={4} />
              </>
            ) : (
              <EmptyState
                title="Nothing listed online for this yet"
                description={`We haven't listed ${group ? group.name.toLowerCase() : "parts"} for the ${bikeName} online. The store may still have it. Send a quick message and we'll check.`}
                actions={[{ label: "Choose another part type", href: `/part-finder?brand=${model.brand}&model=${model.id}`, variant: "outline" }]}
              >
                <div className="mt-5 flex flex-wrap justify-center gap-2">
                  <WhatsAppButton
                    message={`Hello ${business.name}, I need ${group ? group.name.toLowerCase() : "parts"} for my ${bikeName}. Do you have them?`}
                    label="Ask on WhatsApp"
                  />
                  <CallButton variant="outline" />
                </div>
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
      <h2 id="step-title" className="mb-4 font-display text-xl font-bold text-ink sm:text-2xl">
        {title}
      </h2>
      {children}
    </section>
  );
}
