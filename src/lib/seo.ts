import type { Metadata } from "next";
import { business } from "@/config/business";
import { absoluteUrl, siteUrl } from "@/config/site";
import type { ProductView, StockStatus } from "@/lib/types";

export interface Crumb {
  label: string;
  href: string;
}

/** Page metadata with canonical URL and Open Graph filled in consistently. */
export function pageMetadata(opts: {
  title: string;
  description: string;
  path: string;
  noindex?: boolean;
}): Metadata {
  return {
    title: opts.title,
    description: opts.description,
    alternates: { canonical: opts.path },
    openGraph: {
      title: opts.title,
      description: opts.description,
      url: opts.path,
      siteName: business.name,
      locale: "en_BD",
      type: "website",
    },
    robots: opts.noindex ? { index: false, follow: true } : undefined,
  };
}

/** Serialise JSON-LD safely for a <script> tag. */
export function jsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

export function localBusinessJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "AutoPartsStore",
    "@id": `${siteUrl}/#store`,
    name: business.name,
    alternateName: business.banglaName,
    description: business.description,
    url: siteUrl,
    telephone: business.phones.store.e164,
    address: {
      "@type": "PostalAddress",
      streetAddress: business.address.street,
      addressLocality: business.address.locality,
      addressCountry: business.address.countryCode,
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: business.hours.days,
        opens: business.hours.opens,
        closes: business.hours.closes,
      },
    ],
  };
}

export function breadcrumbJsonLd(crumbs: Crumb[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.label,
      item: absoluteUrl(c.href),
    })),
  };
}

// "call-for-availability" has no schema.org equivalent, so availability is omitted for it.
const schemaAvailability: Partial<Record<StockStatus, string>> = {
  "in-stock": "https://schema.org/InStock",
  "low-stock": "https://schema.org/LimitedAvailability",
  "out-of-stock": "https://schema.org/OutOfStock",
  "available-on-request": "https://schema.org/BackOrder",
};

/**
 * Product structured data. Search engines require an offer (price) for a valid
 * Product result, so this returns null for products without a price or for sample records.
 */
export function productJsonLd(product: ProductView) {
  if (product.isSample || product.price === undefined) return null;
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.shortDescription ?? product.description,
    sku: product.sku,
    mpn: product.partNumber,
    brand: product.partBrand ? { "@type": "Brand", name: product.partBrand } : undefined,
    image: product.images.map((img) => (img.src.startsWith("http") ? img.src : absoluteUrl(img.src))),
    category: product.subcategoryName ?? product.categoryName,
    url: absoluteUrl(`/products/${product.slug}`),
    offers: {
      "@type": "Offer",
      price: product.price,
      priceCurrency: product.currency ?? "BDT",
      availability: schemaAvailability[product.stockStatus],
      url: absoluteUrl(`/products/${product.slug}`),
      seller: { "@id": `${siteUrl}/#store` },
    },
  };
}
