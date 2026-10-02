import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CircleCheck, ExternalLink, Info, ScrollText, ShieldCheck } from "lucide-react";
import { TrackView } from "@/components/analytics/Track";
import { ProductPurchase } from "@/components/cart/AddToCartButton";
import { AuthenticityBadge, AvailabilityBadge, ConfidenceBadge, DemoBadge, PriceDisplay } from "@/components/catalog/Badges";
import { CompatibilityList } from "@/components/catalog/CompatibilityList";
import { categoryShortName, FitsBikeList, ModelCard } from "@/components/catalog/DirectoryCards";
import { ProductGrid } from "@/components/catalog/ProductCard";
import { ProductGallery } from "@/components/catalog/ProductGallery";
import { CallButton, WhatsAppButton } from "@/components/contact/ContactActions";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { JsonLd } from "@/components/ui/JsonLd";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { business, dealershipFor, sellsOriginalParts } from "@/config/business";
import { absoluteUrl } from "@/config/site";
import {
  categoryPath,
  countBy,
  loadCatalog,
  modelCategoryGroups,
  modelDisplayName,
  relatedProducts,
  variantsFor,
} from "@/lib/catalog/catalog";
import { canRequest, CATALOGUE_DISCLAIMER, sourceTypeLabels } from "@/lib/catalog/labels";
import { fitmentSummary, productEyebrow, toCartLine } from "@/lib/catalog/present";
import { productEnquiryMessage } from "@/lib/order";
import { isIndexable, pageMetadata, productJsonLd, type Crumb } from "@/lib/seo";
import type { Brand, MotorcycleModel } from "@/lib/types";

/** Bikes shown beneath the part's picture; a longer list gets its own compatibility section. */
const FITS_SHOWN = 4;

/** Variant limits and the version caution that go with a fitment list. */
function FitmentNotes({
  limited,
  recommended,
  brands,
}: {
  limited: { model: MotorcycleModel; variants: string[] }[];
  recommended: boolean;
  brands: Map<string, Brand>;
}) {
  return (
    <>
      {limited.length > 0 && (
        <ul className="mt-3 space-y-1 text-sm text-ink">
          {limited.map(({ model, variants }) => (
            <li key={model.id}>
              <span className="font-semibold">{modelDisplayName(model, brands)}:</span> only {variants.join(", ")}
            </li>
          ))}
        </ul>
      )}
      <p className="mt-3 text-sm text-muted">
        {recommended
          ? "The owner's manuals of these models name this grade. Other bikes that call for the same grade can use it too."
          : "Bikes can differ between versions and years. If you are not sure, tell us your bike's model and year before ordering."}
      </p>
    </>
  );
}

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
    // Catalogue-only entries are not confirmed stock: keep them out of search engines.
    noindex: !isIndexable(product),
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
  const modelCounts = countBy(catalog.products, (p) => p.compatibleModels);
  const requestable = canRequest(product.inventoryStatus);
  // Models where the part only fits some official variants (e.g. rear disc pads on a Pulsar 150 TD).
  const limited = product.models
    .map((m) => ({ model: m, variants: variantsFor(product, m) }))
    .filter((x) => x.variants.length > 0);
  const recommended = product.fitment === "universal" && product.models.length > 0;
  const listedBikes = product.fitment === "unconfirmed" ? [] : product.models;
  const shortFitList = listedBikes.length > 0 && listedBikes.length <= FITS_SHOWN;
  const enquiry = productEnquiryMessage(product.name, absoluteUrl(`/products/${product.slug}`));
  const brandName = (slug: string) => catalog.brandBySlug.get(slug)?.name ?? slug;
  // Brand note for parts listed for one brand's bikes: authorized dealer or original parts.
  const onlyBrand = product.fitment === "model-specific" && product.brands.length === 1 ? product.brands[0] : undefined;
  const dealer = onlyBrand ? dealershipFor(onlyBrand.slug) : undefined;
  const originalBrand = onlyBrand && !dealer && sellsOriginalParts(onlyBrand.slug) ? onlyBrand : undefined;

  return (
    <>
      <TrackView event="product_view" props={{ product_id: product.id, category: product.category }} />
      <JsonLd data={productJsonLd(product)} />

      <div className="container-page py-5 sm:py-7">
        <Breadcrumbs items={crumbs} />

        <div className="mt-5 grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-10">
          <div className="min-w-0 space-y-5">
            <ProductGallery
              images={product.images}
              fallback={product.displayImage}
              art={product.art}
              icon={product.categoryIcon}
              label={product.subcategoryName ?? product.categoryName}
              name={product.name}
            />
            {/* The picture shows the part; the bikes it fits are shown beneath it, never in its place.
                A short list is the whole compatibility section; a long one continues further down. */}
            {listedBikes.length > 0 && (
              <div id={shortFitList ? "compatibility" : undefined} className="scroll-mt-40">
                <FitsBikeList
                  title={recommended ? "Recommended by the manufacturer for" : "Fits"}
                  models={listedBikes.slice(0, FITS_SHOWN)}
                  brandName={brandName}
                  moreCount={listedBikes.length - Math.min(listedBikes.length, FITS_SHOWN)}
                  moreHref="#compatibility"
                />
                {shortFitList && <FitmentNotes limited={limited} recommended={recommended} brands={catalog.brandBySlug} />}
              </div>
            )}
          </div>

          <div className="min-w-0">
            <p className="font-display text-sm font-semibold uppercase tracking-[0.14em] text-muted">{productEyebrow(product)}</p>
            <h1 className="display mt-1 text-[2.25rem] text-ink sm:text-5xl">{product.name}</h1>
            {product.nameBn && (
              <p lang="bn" className="mt-1 text-lg text-muted">
                {product.nameBn}
              </p>
            )}

            <div className="mt-3 flex flex-wrap items-center gap-2">
              {product.productStatus === "demo" && <DemoBadge />}
              <AuthenticityBadge authenticity={product.authenticity} />
              <ConfidenceBadge confidence={product.compatibilityConfidence} className="text-sm" />
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
                <AvailabilityBadge status={product.inventoryStatus} className="text-sm" />
              </div>
              {product.inventoryStatus === "catalogue-only" && <p className="-mt-1 text-sm text-muted">{CATALOGUE_DISCLAIMER}</p>}
              {(dealer || originalBrand) && (
                <p className="flex items-start gap-2 text-sm text-ink">
                  <ShieldCheck className="mt-0.5 size-4 shrink-0 text-brand" aria-hidden="true" />
                  <span>
                    {dealer ? (
                      <>
                        {business.name} is an authorized dealer of <strong className="font-semibold">{dealer.company}</strong>: genuine{" "}
                        {onlyBrand?.name} parts at company price. Ask for the genuine part when you order.
                      </>
                    ) : (
                      <>{business.name} sells original {originalBrand?.name} parts. Ask for the original part when you order.</>
                    )}
                  </span>
                </p>
              )}

              <p className="flex items-start gap-2 rounded-lg bg-steel-soft p-3 text-sm text-ink">
                <CircleCheck className="mt-0.5 size-4 shrink-0 text-steel" aria-hidden="true" />
                <span>
                  <span className="font-semibold">{fitmentSummary(product)}.</span>{" "}
                  {limited.length > 0 && <span>Only {limited.map((x) => x.variants.join(", ")).join("; ")}. </span>}
                  {product.compatibilityConfidence === "needs-confirmation" && product.fitment !== "universal" && (
                    <span>Tell us your bike&apos;s variant and year so we can confirm the exact part. </span>
                  )}
                  <a href="#compatibility" className="text-brand underline">
                    See compatible motorcycles
                  </a>
                </span>
              </p>
              {product.notes && product.notes.length > 0 && (
                <ul className="space-y-1.5 text-sm text-muted">
                  {product.notes.map((n) => (
                    <li key={n} className="flex items-start gap-2">
                      <Info className="mt-0.5 size-4 shrink-0 text-warning" aria-hidden="true" />
                      {n}
                    </li>
                  ))}
                </ul>
              )}

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

        {!shortFitList && (
          <section id="compatibility" aria-labelledby="compat-title" className="mt-12 scroll-mt-40">
            <SectionHeader
              id="compat-title"
              eyebrow="Compatibility"
              title={recommended ? "Recommended by the manufacturer for" : "Fits these bikes"}
            />
            {product.models.length > 0 ? (
              <>
                <ul className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
                  {product.models.map((m) => (
                    <li key={m.id}>
                      <ModelCard
                        model={m}
                        brandName={brandName(m.brand)}
                        productCount={modelCounts.get(m.id) ?? 0}
                        categories={modelCategoryGroups(catalog, m.id).map(({ group }) => categoryShortName(group))}
                      />
                    </li>
                  ))}
                </ul>
                <FitmentNotes limited={limited} recommended={recommended} brands={catalog.brandBySlug} />
              </>
            ) : (
              <div className="card p-5">
                <CompatibilityList product={product} />
              </div>
            )}
          </section>
        )}

        <div className="mt-10 grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-10">
          <section aria-labelledby="details-title" className="card p-5 lg:col-span-2">
            <h2 id="details-title" className="display mb-3 text-2xl text-ink">
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
                      <th scope="row" className="w-2/5 py-2 pr-3 text-left align-top font-medium text-muted">
                        {s.label}
                      </th>
                      <td className="py-2 text-ink">
                        {s.value}
                        {s.source && (
                          <a
                            href={s.source}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="ml-2 inline-flex items-center gap-0.5 text-xs text-muted underline hover:text-brand"
                          >
                            Official source <ExternalLink className="size-3" aria-hidden="true" />
                          </a>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-sm text-muted">Specifications have not been listed for this product.</p>
            )}

            <p className="mt-5 flex flex-wrap items-center gap-x-2 gap-y-1 border-t border-line pt-4 text-xs text-muted">
              <ScrollText className="size-3.5" aria-hidden="true" />
              <span>
                Source: {sourceTypeLabels[product.source.type]}, {product.source.name}.
              </span>
              {product.source.url && (
                <a
                  href={product.source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-0.5 underline hover:text-brand"
                >
                  View source <ExternalLink className="size-3" aria-hidden="true" />
                </a>
              )}
            </p>
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
