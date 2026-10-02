import type { Metadata } from "next";
import { BrandRelationBadge } from "@/components/catalog/Badges";
import { BrandShowroomCard, categoryShortName, ModelCard } from "@/components/catalog/DirectoryCards";
import { PageHeader } from "@/components/layout/PageHeader";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { business, dealerList } from "@/config/business";
import {
  brandFeatureModel,
  brandsByRelation,
  countBy,
  loadCatalog,
  modelCategoryGroups,
  modelsForBrand,
} from "@/lib/catalog/catalog";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Motorcycle Brands",
  description:
    "Authorized dealer for Uttara Motors (Bajaj), TVS Motors, Runner Automobiles and Hero, with original Yamaha, Suzuki and Honda parts. Spare parts organised by brand and model at Nirob Autos, Madhupur.",
  path: "/brands",
});

export default async function BrandsPage() {
  const catalog = await loadCatalog();
  const brandCounts = countBy(catalog.products, (p) => p.brands.map((b) => b.slug));
  const modelCounts = countBy(catalog.products, (p) => p.compatibleModels);
  const brands = brandsByRelation(catalog);

  return (
    <>
      <PageHeader
        eyebrow="Brands we deal in"
        title="Motorcycle brands"
        description={`Choose your bike's brand, then your model, to see the parts listed for it. ${business.name} is an authorized dealer for ${dealerList()}, with genuine parts at company price, and sells original Yamaha, Suzuki and Honda parts.`}
        crumbs={[{ label: "Brands", href: "/brands" }]}
      />
      <div className="container-page space-y-14 py-10">
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {brands.map((b) => {
            const models = modelsForBrand(catalog, b.slug);
            return (
              <li key={b.slug}>
                <BrandShowroomCard
                  brand={b}
                  feature={brandFeatureModel(catalog, b.slug)}
                  modelNames={models.slice(0, 4).map((m) => m.name)}
                  modelCount={models.length}
                  productCount={brandCounts.get(b.slug) ?? 0}
                />
              </li>
            );
          })}
        </ul>

        {brands.map((b) => {
          const models = modelsForBrand(catalog, b.slug).filter((m) => m.status !== "official-other");
          if (models.length === 0) return null;
          return (
            <section key={b.slug} aria-labelledby={`brand-${b.slug}`}>
              <SectionHeader
                id={`brand-${b.slug}`}
                title={`${b.name} models`}
                action={{ label: `All ${b.name} parts`, href: `/brands/${b.slug}` }}
              />
              <BrandRelationBadge brandSlug={b.slug} detail tone="light" className="-mt-3 mb-4" />
              <ul className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
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
