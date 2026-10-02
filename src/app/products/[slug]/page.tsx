import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CircleCheck, Info } from "lucide-react";
import { TrackView } from "@/components/analytics/Track";
import { ProductPurchase } from "@/components/cart/AddToCartButton";
import { AvailabilityBadge, PriceDisplay, ProductTypeBadge, SampleBadge } from "@/components/catalog/Badges";
import { CompatibilityList } from "@/components/catalog/CompatibilityList";
import { ProductGrid } from "@/components/catalog/ProductCard";
import { ProductGallery } from "@/components/catalog/ProductGallery";
import { CallButton, WhatsAppButton } from "@/components/contact/ContactActions";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { JsonLd } from "@/components/ui/JsonLd";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { absoluteUrl } from "@/config/site";
import { categoryPath, loadCatalog, relatedProducts } from "@/lib/catalog/catalog";
import { canRequest } from "@/lib/catalog/labels";
import { fitmentSummary, productEyebrow, toCartLine } from "@/lib/catalog/present";
import { productEnquiryMessage } from "@/lib/order";
import { pageMetadata, productJsonLd, type Crumb } from "@/lib/seo";

export async function generateStaticParams() {
  const { products } = await loadCatalog();
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata(props: PageProps<"/products/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const { productBySlug } = await loadCatalog();
  const product = productBySlug.get(slug);
  if (!product) return { title: "Product not found", robots: { index: false } };

  const fit = fitmentSummary(product);
  const meta = pageMetadata({
    title: product.name,
    description:
      product.shortDescription ??
      `${product.name}. ${fit}. Check price and availability with Nirob Autos, Madhupur.`,
    path: `/products/${product.slug}`,
    // Sample records are placeholders, not real stock: keep them out of search engines.
    noindex: product.isSample,
  });
  if (product.images[0]) {
    meta.openGraph = { ...meta.openGraph, images: [{ url: product.images[0].src, alt: product.images[0].alt }] };
  }
  return meta;
}

export default async function ProductPage(props: PageProps<"/products/[slug]">) {
  const { slug } = await props.params;
  const catalog = await loadCatalog();
  const product = catalog.productBySlug.get(slug);
  if (!product) notFound();

  const crumbs: Crumb[] = [
    { label: "Shop", href: "/shop" },
    { label: product.categoryName, href: categoryPath(product.category) },
    ...(product.subcategory && product.subcategoryName
      ? [{ label: product.subcategoryName, href: `/categories/${product.subcategory}` }]
      : []),
    { label: product.name, href: `/products/${product.slug}` },
  ];
  const rails = relatedProducts(catalog, product);
  const requestable = canRequest(product.stockStatus);
  const enquiry = productEnquiryMessage(product.name, absoluteUrl(`/products/${product.slug}`));

  return (
    <>
      <TrackView event="product_view" props={{ product_id: product.id, category: product.category }} />
      <JsonLd data={productJsonLd(product)} />

      <div className="container-page py-5 sm:py-7">
        <Breadcrumbs items={crumbs} />

        <div className="mt-5 grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-10">
          <ProductGallery images={product.images} icon={product.categoryIcon} name={product.name} />

          <div className="min-w-0">
            <p className="text-sm font-medium uppercase tracking-wide text-muted">{productEyebrow(product)}</p>
            <h1 className="mt-1 font-display text-[1.75rem] font-bold leading-tight tracking-tight text-ink sm:text-4xl">
              {product.name}
            </h1>
            {product.nameBn && (
              <p lang="bn" className="mt-1 text-lg text-muted">
                {product.nameBn}
              </p>
            )}

            <div className="mt-3 flex flex-wrap items-center gap-2">
              {product.isSample && <SampleBadge />}
              <ProductTypeBadge type={product.productType} />
              {product.partBrand && <span className="text-sm text-muted">Made by {product.partBrand}</span>}
            </div>

            {(product.sku || product.partNumber) && (
              <dl className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-sm">
                {product.sku && (
                  <div className="flex gap-1">
                    <dt className="text-muted">SKU:</dt>
                    <dd className="font-medium text-ink">{product.sku}</dd>
                  </div>
                )}
                {product.partNumber && (
                  <div className="flex gap-1">
                    <dt className="text-muted">Part no.:</dt>
                    <dd className="font-medium text-ink">{product.partNumber}</dd>
                  </div>
                )}
              </dl>
            )}

            <div className="card mt-5 space-y-4 p-4 sm:p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <PriceDisplay price={product.price} compareAtPrice={product.compareAtPrice} size="lg" />
                <AvailabilityBadge status={product.stockStatus} className="text-sm" />
              </div>

              <p className="flex items-start gap-2 rounded-lg bg-steel-soft p-3 text-sm text-ink">
                <CircleCheck className="mt-0.5 size-4 shrink-0 text-steel" aria-hidden="true" />
                <span>
                  <span className="font-semibold">{fitmentSummary(product)}.</span>{" "}
                  <a href="#compatibility" className="text-brand underline">
                    See compatible motorcycles
                  </a>
                </span>
              </p>

              <ProductPurchase line={toCartLine(product)} disabled={!requestable} />

              <div className="border-t border-line pt-4">
                <p className="mb-2 text-sm font-semibold text-ink">Not sure it fits? Ask before you order.</p>
                <div className="grid gap-2 sm:grid-cols-2">
                  <CallButton variant="outline" label="Call to confirm" />
                  <WhatsAppButton message={enquiry} label="Ask on WhatsApp" />
                </div>
              </div>
            </div>

            <p className="mt-3 flex gap-2 text-sm text-muted">
              <Info className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
              No online payment. The store confirms price, availability and any delivery charge before you pay.
            </p>
          </div>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-10">
          <section id="compatibility" aria-labelledby="compat-title" className="card scroll-mt-40 p-5">
            <h2 id="compat-title" className="mb-4 font-display text-xl font-bold text-ink">
              Compatible motorcycles
            </h2>
            <CompatibilityList product={product} />
          </section>

          <section aria-labelledby="details-title" className="card p-5">
            <h2 id="details-title" className="mb-3 font-display text-xl font-bold text-ink">
              Product details
            </h2>
            {product.description || product.shortDescription ? (
              <p className="whitespace-pre-line text-[0.9375rem] text-ink">{product.description ?? product.shortDescription}</p>
            ) : (
              <p className="text-sm text-muted">No description yet. Ask the store for details.</p>
            )}

            {product.features && product.features.length > 0 && (
              <>
                <h3 className="mb-2 mt-5 font-semibold text-ink">Features</h3>
                <ul className="list-disc space-y-1 pl-5 text-[0.9375rem] text-ink">
                  {product.features.map((f) => (
                    <li key={f}>{f}</li>
                  ))}
                </ul>
              </>
            )}

            <h3 className="mb-2 mt-5 font-semibold text-ink">Specifications</h3>
            {product.specifications && product.specifications.length > 0 ? (
              <table className="w-full text-sm">
                <tbody>
                  {product.specifications.map((s) => (
                    <tr key={s.label} className="border-t border-line">
                      <th scope="row" className="w-2/5 py-2 pr-3 text-left font-medium text-muted">
                        {s.label}
                      </th>
                      <td className="py-2 text-ink">{s.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-sm text-muted">Specifications have not been listed for this product.</p>
            )}
          </section>
        </div>

        {rails.map((rail) => (
          <section key={rail.title} className="mt-12" aria-label={rail.title}>
            <SectionHeader title={rail.title} />
            <ProductGrid products={rail.products} />
          </section>
        ))}
      </div>
    </>
  );
}
