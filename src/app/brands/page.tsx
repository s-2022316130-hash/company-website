import type { Metadata } from "next";
import { BrandCard, ModelLink } from "@/components/catalog/DirectoryCards";
import { PageHeader } from "@/components/layout/PageHeader";
import { countBy, loadCatalog, modelsForBrand } from "@/lib/catalog/catalog";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Motorcycle Brands",
  description:
    "Spare parts organised by motorcycle brand: Bajaj, Honda, Yamaha, Suzuki, TVS, Hero and Runner. Nirob Autos, Madhupur.",
  path: "/brands",
});

export default async function BrandsPage() {
  const catalog = await loadCatalog();
  const brandCounts = countBy(catalog.products, (p) => p.brands.map((b) => b.slug));
  const modelCounts = countBy(catalog.products, (p) => p.compatibleModels);

  return (
    <>
      <PageHeader
        title="Shop by motorcycle brand"
        description="Choose your bike's brand, then your model, to see the parts listed for it."
        crumbs={[{ label: "Brands", href: "/brands" }]}
      />
      <div className="container-page space-y-10 py-6">
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4 xl:grid-cols-7">
          {catalog.brands.map((b) => (
            <li key={b.slug}>
              <BrandCard brand={b} modelCount={modelsForBrand(catalog, b.slug).length} productCount={brandCounts.get(b.slug) ?? 0} />
            </li>
          ))}
        </ul>

        {catalog.brands.map((b) => (
          <section key={b.slug} aria-labelledby={`brand-${b.slug}`}>
            <h2 id={`brand-${b.slug}`} className="mb-3 font-display text-xl font-bold text-ink">
              {b.name} models
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
