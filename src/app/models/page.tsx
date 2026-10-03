import type { Metadata } from "next";
import { categoryShortName } from "@/components/catalog/DirectoryCards";
import { ModelDirectory, type DirectoryEntry } from "@/components/catalog/ModelDirectory";
import { PageHeader } from "@/components/layout/PageHeader";
import { countBy, loadCatalog, modelCategoryGroups, modelsForBrand } from "@/lib/catalog/catalog";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Find Parts for Your Motorcycle",
  description:
    "Motorcycle directory: choose your Bajaj, Honda, Yamaha, Suzuki, TVS, Hero or Runner model to explore compatible parts at Nirob Auto's, Madhupur.",
  path: "/models",
});

export default async function ModelsPage(props: PageProps<"/models">) {
  const [sp, catalog] = await Promise.all([props.searchParams, loadCatalog()]);
  const modelCounts = countBy(catalog.products, (p) => p.compatibleModels);
  const entries: DirectoryEntry[] = catalog.brands.flatMap((b) =>
    modelsForBrand(catalog, b.slug).map((m) => ({
      model: m,
      brandName: b.name,
      productCount: modelCounts.get(m.id) ?? 0,
      categories: modelCategoryGroups(catalog, m.id).map(({ group }) => categoryShortName(group)),
    })),
  );
  const brandParam = Array.isArray(sp.brand) ? sp.brand[0] : sp.brand;

  return (
    <>
      <PageHeader
        eyebrow="Motorcycle directory"
        title="Find parts for your motorcycle"
        description="Choose your motorcycle to explore compatible parts. Model names follow each manufacturer's official Bangladesh website."
        crumbs={[{ label: "Motorcycles", href: "/models" }]}
      />
      <div className="container-page py-8">
        <ModelDirectory
          entries={entries}
          brands={catalog.brands.map((b) => ({ slug: b.slug, name: b.name }))}
          initialBrand={brandParam}
        />
      </div>
    </>
  );
}
