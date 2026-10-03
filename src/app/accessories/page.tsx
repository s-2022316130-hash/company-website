import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PartArt } from "@/components/parts/PartArt";
import { ProductListing } from "@/components/catalog/ProductListing";
import { PhotoBanner } from "@/components/layout/Banners";
import { helmetBrands } from "@/data/catalogue/helmets";
import { categoryPath, loadCatalog } from "@/lib/catalog/catalog";
import { makerSlug } from "@/lib/catalog/listing";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Motorcycle Accessories",
  description: "Motorcycle accessories at Nirob Autos, Madhupur: helmets from Studds, Vega, Steelbird, LS2 and more, mobile holders, chargers, grips, covers and more.",
  path: "/accessories",
});

export default async function AccessoriesPage(props: PageProps<"/accessories">) {
  const [searchParams, catalog] = await Promise.all([props.searchParams, loadCatalog()]);
  const group = catalog.groups.find((g) => g.slug === "accessories");
  return (
    <>
      <PhotoBanner
        photo="catAccessories"
        eyebrow={group?.shortLabel}
        title="Motorcycle accessories"
        description="Add-ons for everyday riding, kept separate from mechanical spare parts."
        crumbs={[{ label: "Accessories", href: "/accessories" }]}
      >
        {group && (
          <ul className="mt-5 flex flex-wrap gap-2">
            {group.subcategories.map((s) => (
              <li key={s.slug}>
                <Link href={categoryPath(s.slug)} className="chip chip-dark">
                  {s.name}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </PhotoBanner>
      <div className="container-page py-8">
        <section
          aria-labelledby="acc-helmets-title"
          className="blueprint relative mb-8 grid gap-5 overflow-hidden rounded-xl p-5 text-on-dark sm:p-7 lg:grid-cols-[minmax(0,1fr)_14rem] lg:items-center"
        >
          <div>
            <p className="eyebrow eyebrow-dark">Helmets</p>
            <h2 id="acc-helmets-title" className="display mt-1 text-section text-white">
              {helmetBrands.reduce((n, b) => n + b.models.length, 0)} helmet models, {helmetBrands.length} brands
            </h2>
            <ul className="mt-4 flex flex-wrap gap-2" aria-label="Helmet brands">
              {helmetBrands.map((b) => (
                <li key={b.slug}>
                  <Link href={`/helmets?maker=${makerSlug(b.name)}`} className="chip chip-dark min-h-9">
                    {b.name}
                  </Link>
                </li>
              ))}
            </ul>
            <Link href="/helmets" className="group btn btn-primary mt-5">
              Shop helmets
              <ArrowRight className="size-4 transition-transform duration-small ease-ui group-hover:translate-x-1" aria-hidden="true" />
            </Link>
          </div>
          <PartArt kind="helmet-full" className="hidden w-full max-w-56 justify-self-center text-on-dark lg:block" />
        </section>
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
