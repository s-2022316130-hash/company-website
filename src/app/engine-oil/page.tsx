import type { Metadata } from "next";
import Link from "next/link";
import { ProductListing } from "@/components/catalog/ProductListing";
import { PhotoBanner } from "@/components/layout/Banners";
import { loadCatalog } from "@/lib/catalog/catalog";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Motorcycle Engine Oil & Fluids",
  description:
    "Motorcycle engine oil, gear oil, brake fluid, coolant, chain lubricant and care products at Nirob Autos, Madhupur.",
  path: "/engine-oil",
});

export default async function EngineOilPage(props: PageProps<"/engine-oil">) {
  const [searchParams, catalog] = await Promise.all([props.searchParams, loadCatalog()]);
  const group = catalog.groups.find((g) => g.slug === "oils-fluids");
  return (
    <>
      <PhotoBanner
        photo="catOils"
        eyebrow="Maintenance"
        title="Engine oil & maintenance fluids"
        description="Oils, fluids and care products for routine maintenance. Tell us your bike model and we'll confirm the right grade."
        crumbs={[{ label: "Engine oil & fluids", href: "/engine-oil" }]}
      >
        {group && (
          <ul className="mt-5 flex flex-wrap gap-2">
            {group.subcategories.map((s) => (
              <li key={s.slug}>
                <Link href={`/categories/${s.slug}`} className="chip chip-dark">
                  {s.name}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </PhotoBanner>
      <div className="container-page py-8">
        <ProductListing
          basePath="/engine-oil"
          searchParams={searchParams}
          scope={{ category: "oils-fluids" }}
          emptyTitle="No oils or fluids listed yet"
        />
      </div>
    </>
  );
}
