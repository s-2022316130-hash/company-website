import type { Metadata } from "next";
import { ProductListing } from "@/components/catalog/ProductListing";
import { SampleCatalogNotice } from "@/components/catalog/SampleCatalogNotice";
import { PageHeader } from "@/components/layout/PageHeader";
import { hasSampleProducts, loadCatalog } from "@/lib/catalog/catalog";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Shop Motorcycle Spare Parts",
  description:
    "Browse motorcycle spare parts, maintenance products and accessories at Nirob Autos, Madhupur. Filter by bike brand, model and category.",
  path: "/shop",
});

export default async function ShopPage(props: PageProps<"/shop">) {
  const [searchParams, catalog] = await Promise.all([props.searchParams, loadCatalog()]);
  return (
    <>
      {hasSampleProducts(catalog) && <SampleCatalogNotice />}
      <PageHeader
        title="Shop all parts"
        description="Filter by motorcycle brand, model or category. Prices and availability are confirmed by the store when you order."
        crumbs={[{ label: "Shop", href: "/shop" }]}
      />
      <div className="container-page py-6">
        <ProductListing basePath="/shop" searchParams={searchParams} />
      </div>
    </>
  );
}
