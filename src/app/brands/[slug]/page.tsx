import type { Metadata } from "next";
import Form from "next/form";
import { notFound } from "next/navigation";
import { Search } from "lucide-react";
import { TrackView } from "@/components/analytics/Track";
import { ModelLink } from "@/components/catalog/DirectoryCards";
import { ProductListing } from "@/components/catalog/ProductListing";
import { PageHeader } from "@/components/layout/PageHeader";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { countBy, loadCatalog, modelsForBrand } from "@/lib/catalog/catalog";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata(props: PageProps<"/brands/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const { brandBySlug } = await loadCatalog();
  const brand = brandBySlug.get(slug);
  if (!brand) return { title: "Brand not found", robots: { index: false } };
  return pageMetadata({
    title: `${brand.name} Motorcycle Parts`,
    description: `Spare parts, filters, brake parts and maintenance products for ${brand.name} motorcycles at Nirob Autos, Madhupur. Browse by model.`,
    path: `/brands/${brand.slug}`,
  });
}

export default async function BrandPage(props: PageProps<"/brands/[slug]">) {
  const [{ slug }, searchParams] = await Promise.all([props.params, props.searchParams]);
  const catalog = await loadCatalog();
  const brand = catalog.brandBySlug.get(slug);
  if (!brand) notFound();

  const models = modelsForBrand(catalog, brand.slug);
  const modelCounts = countBy(catalog.products, (p) => p.compatibleModels);
  const q = typeof searchParams.q === "string" ? searchParams.q : "";

  return (
    <>
      <TrackView event="brand_view" props={{ brand: brand.slug }} />
      <PageHeader
        title={`${brand.name} motorcycle parts`}
        description={`Parts and maintenance products listed for ${brand.name} motorcycles. Pick your model for the most accurate list.`}
        crumbs={[
          { label: "Brands", href: "/brands" },
          { label: brand.name, href: `/brands/${brand.slug}` },
        ]}
      >
        <Form action={`/brands/${brand.slug}`} className="mt-5 flex max-w-xl gap-2" role="search" scroll={false}>
          <label htmlFor="brand-search" className="sr-only">
            Search within {brand.name} parts
          </label>
          <input
            id="brand-search"
            name="q"
            type="search"
            defaultValue={q}
            maxLength={120}
            placeholder={`Search ${brand.name} parts, e.g. brake pad`}
            className="input"
          />
          <button type="submit" className="btn btn-primary shrink-0">
            <Search className="size-4" aria-hidden="true" />
            <span className="max-sm:sr-only">Search</span>
          </button>
        </Form>
      </PageHeader>

      <div className="container-page space-y-10 py-6">
        <section aria-labelledby="models-title">
          <SectionHeader id="models-title" title={`${brand.name} models`} />
          <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
            {models.map((m) => (
              <li key={m.id}>
                <ModelLink model={m} productCount={modelCounts.get(m.id) ?? 0} showBrand={false} />
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="brand-products-title">
          <SectionHeader id="brand-products-title" title={`Parts listed for ${brand.name}`} />
          <ProductListing
            basePath={`/brands/${brand.slug}`}
            searchParams={searchParams}
            scope={{ brand: brand.slug }}
            emptyTitle={`No ${brand.name} parts listed yet`}
          />
        </section>
      </div>
    </>
  );
}
