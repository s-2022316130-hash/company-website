import type { Metadata } from "next";
import Link from "next/link";
import { ProductListing } from "@/components/catalog/ProductListing";
import { PageHeader } from "@/components/layout/PageHeader";
import { loadCatalog } from "@/lib/catalog/catalog";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Motorcycle Accessories",
  description: "Motorcycle accessories at Nirob Autos, Madhupur: mobile holders, grips, covers, lights and more.",
  path: "/accessories",
});

export default async function AccessoriesPage(props: PageProps<"/accessories">) {
  const [searchParams, catalog] = await Promise.all([props.searchParams, loadCatalog()]);
  const group = catalog.groups.find((g) => g.slug === "accessories");
  return (
    <>
      <PageHeader
        title="Motorcycle accessories"
        description="Add-ons for everyday riding, kept separate from mechanical spare parts."
        crumbs={[{ label: "Accessories", href: "/accessories" }]}
      >
        {group && (
          <ul className="mt-5 flex flex-wrap gap-2">
            {group.subcategories.map((s) => (
              <li key={s.slug}>
                <Link href={`/categories/${s.slug}`} className="chip">
                  {s.name}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </PageHeader>
      <div className="container-page py-6">
        <ProductListing
          basePath="/accessories"
          searchParams={searchParams}
          scope={{ category: "accessories" }}
          emptyTitle="No accessories listed yet"
        />
      </div>
    </>
  );
}
