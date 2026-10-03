import type { Metadata } from "next";
import Link from "next/link";
import { Ruler } from "lucide-react";
import { ProductListing } from "@/components/catalog/ProductListing";
import { WhatsAppButton } from "@/components/contact/ContactActions";
import { PhotoBanner } from "@/components/layout/Banners";
import { business } from "@/config/business";
import { helmetBrands, helmetStyleLabels, type HelmetStyle } from "@/data/catalogue/helmets";
import { makerSlug } from "@/lib/catalog/listing";
import { pageMetadata } from "@/lib/seo";

const modelCount = helmetBrands.reduce((n, b) => n + b.models.length, 0);

export const metadata: Metadata = pageMetadata({
  title: "Motorcycle Helmets",
  description: `${modelCount} helmet models from ${helmetBrands.length} brands at ${business.name}, Madhupur: Studds, Vega, Steelbird, LS2, MT, AGV, HJC and more. Call or WhatsApp for sizes, colours and prices.`,
  path: "/helmets",
});

/** Styles that at least one helmet has from a cited page; each links to a search within helmets. */
const styles = (Object.keys(helmetStyleLabels) as HelmetStyle[]).filter((s) =>
  helmetBrands.some((b) => b.models.some((m) => m.style === s && m.source)),
);

/** Helmets the shop carries (owner's list), by maker, with the usual filters. */
export default async function HelmetsPage(props: PageProps<"/helmets">) {
  const searchParams = await props.searchParams;
  return (
    <>
      <PhotoBanner
        photo="catAccessories"
        eyebrow={`${modelCount} models · ${helmetBrands.length} brands`}
        title="Motorcycle helmets"
        description="Helmets from the brands riders ask for, in the shop in Madhupur. Sizes and colours vary: call or WhatsApp to check what is in stock, or come and try one on."
        crumbs={[
          { label: "Accessories", href: "/accessories" },
          { label: "Helmets", href: "/helmets" },
        ]}
      >
        <ul className="mt-5 flex flex-wrap gap-2" aria-label="Helmet brands">
          {helmetBrands.map((b) => (
            <li key={b.slug}>
              <Link href={`/helmets?maker=${makerSlug(b.name)}`} className="chip chip-dark">
                {b.name}
                <span className="text-xs text-on-dark-muted">{b.models.length}</span>
              </Link>
            </li>
          ))}
        </ul>
        {styles.length > 0 && (
          <ul className="mt-3 flex flex-wrap items-center gap-2" aria-label="Helmet styles">
            <li className="label-tech text-on-dark-muted">Style</li>
            {styles.map((s) => (
              <li key={s}>
                <Link href={`/helmets?q=${encodeURIComponent(helmetStyleLabels[s])}`} className="chip chip-dark min-h-9">
                  {helmetStyleLabels[s]}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </PhotoBanner>

      <div className="container-page py-8">
        <aside className="card mb-6 flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
          <p className="flex gap-3 text-sm text-ink">
            <Ruler className="mt-0.5 size-5 shrink-0 text-brand" aria-hidden="true" />
            <span>
              <span className="font-semibold">Choosing a size:</span> measure around your head just above the eyebrows, then
              try the helmet on in the shop. It should sit snug, without pressure points. Ask which sizes and colours are in
              stock before you order.
            </span>
          </p>
          <WhatsAppButton
            message={`Hello ${business.name}, I want a helmet. Model and size: `}
            label="Ask about a helmet"
            className="shrink-0"
          />
        </aside>
        <ProductListing
          basePath="/helmets"
          searchParams={searchParams}
          scope={{ category: "helmets" }}
          emptyTitle="No helmets listed yet"
          emptyArt={{ kind: "part", part: "helmet-full" }}
        />
      </div>
    </>
  );
}
