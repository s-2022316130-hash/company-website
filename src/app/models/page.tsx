import type { Metadata } from "next";
import Link from "next/link";
import { ModelLink } from "@/components/catalog/DirectoryCards";
import { PageHeader } from "@/components/layout/PageHeader";
import { countBy, loadCatalog, modelsForBrand } from "@/lib/catalog/catalog";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Motorcycle Models",
  description:
    "Find spare parts by motorcycle model: Pulsar, FZS, R15, Gixxer, Apache, CB Shine, Splendor and more. Nirob Autos, Madhupur.",
  path: "/models",
});

export default async function ModelsPage() {
  const catalog = await loadCatalog();
  const modelCounts = countBy(catalog.products, (p) => p.compatibleModels);
  return (
    <>
      <PageHeader
        title="Find parts by motorcycle"
        description="Choose your bike to see parts listed for it. If your model is not here, call or WhatsApp the store."
        crumbs={[{ label: "Motorcycles", href: "/models" }]}
      >
        <nav aria-label="Jump to brand" className="mt-5">
          <ul className="flex flex-wrap gap-2">
            {catalog.brands.map((b) => (
              <li key={b.slug}>
                <Link href={`#${b.slug}`} className="chip">
                  {b.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </PageHeader>
      <div className="container-page space-y-10 py-6">
        {catalog.brands.map((b) => (
          <section key={b.slug} id={b.slug} aria-labelledby={`h-${b.slug}`} className="scroll-mt-40">
            <h2 id={`h-${b.slug}`} className="mb-3 font-display text-xl font-bold text-ink">
              <Link href={`/brands/${b.slug}`} className="hover:text-brand">
                {b.name}
              </Link>
            </h2>
            <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
              {modelsForBrand(catalog, b.slug).map((m) => (
                <li key={m.id}>
                  <ModelLink model={m} productCount={modelCounts.get(m.id) ?? 0} showBrand={false} />
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </>
  );
}
