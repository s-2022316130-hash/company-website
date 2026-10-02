import type { Metadata } from "next";
import { BrandShowroomCard, categoryShortName, ModelCard } from "@/components/catalog/DirectoryCards";
import { PageHeader } from "@/components/layout/PageHeader";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { business, dealerList } from "@/config/business";
import { countBy, loadCatalog, modelCategoryGroups, modelsForBrand } from "@/lib/catalog/catalog";
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
        eyebrow="Shop by brand"
        title="Motorcycle brands"
        description={`Choose your bike's brand, then your model, to see the parts listed for it. ${business.name} is a dealer for ${dealerList()}, with genuine parts at company price, and sells original Yamaha, Suzuki and Honda parts.`}
        crumbs={[{ label: "Brands", href: "/brands" }]}
      />
      <div className="container-page space-y-14 py-10">
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {catalog.brands.map((b) => {
            const models = modelsForBrand(catalog, b.slug);
            return (
              <li key={b.slug}>
                <BrandShowroomCard
                  brand={b}
                  modelNames={models.slice(0, 4).map((m) => m.name)}
                  modelCount={models.length}
                  productCount={brandCounts.get(b.slug) ?? 0}
                />
              </li>
            );
          })}
        </ul>

        {catalog.brands.map((b) => {
          const models = modelsForBrand(catalog, b.slug).filter((m) => m.status !== "official-other");
          if (models.length === 0) return null;
          return (
            <section key={b.slug} aria-labelledby={`brand-${b.slug}`}>
              <SectionHeader
                id={`brand-${b.slug}`}
                title={`${b.name} models`}
                action={{ label: `All ${b.name} parts`, href: `/brands/${b.slug}` }}
              />
              <ul className="grid grid-cols-1 gap-3 min-[460px]:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {models.slice(0, 8).map((m) => (
                  <li key={m.id}>
                    <ModelCard
                      model={m}
                      brandName={b.name}
                      productCount={modelCounts.get(m.id) ?? 0}
                      categories={modelCategoryGroups(catalog, m.id).map(({ group }) => categoryShortName(group))}
                    />
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
      </div>
    </>
  );
}
