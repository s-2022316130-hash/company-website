import type { Metadata } from "next";
import Link from "next/link";
import { BrandRelationBadge } from "@/components/catalog/Badges";
import { CallButton, WhatsAppButton } from "@/components/contact/ContactActions";
import { LogoEmblem } from "@/components/layout/Logo";
import { PageHeader } from "@/components/layout/PageHeader";
import { business, dealerList } from "@/config/business";
import { brandsByRelation, loadCatalog } from "@/lib/catalog/catalog";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "About Nirob Auto's",
  description: `${business.name} (${business.banglaName}) has sold motorcycle spare parts, accessories and helmets in ${business.address.locality}, Bangladesh, since ${business.foundedYear}.`,
  path: "/about",
});

export default async function AboutPage() {
  const catalog = await loadCatalog();
  const { brands } = catalog;
  return (
    <>
      <PageHeader
        title={`About ${business.name}`}
        crumbs={[{ label: "About", href: "/about" }]}
        description={
          <span>
            <span lang="bn">{business.banglaName}</span> · {business.tagline}
          </span>
        }
      />
      {/* Factual store information only (business card and logo, 2026). Add the shop's own story and team when supplied. */}
      <div className="container-page grid grid-cols-1 gap-6 py-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <div className="card space-y-4 p-5 text-[0.9375rem] leading-relaxed text-ink sm:p-6">
          <LogoEmblem tone="light" className="h-28 sm:h-32" sizes="(min-width: 640px) 220px, 190px" />
          <p>
            {business.name} has been a motorcycle spare parts shop since {business.foundedYear}, at {business.address.full}{" "}
            (<span lang="bn">{business.address.bn}</span>). We are a {business.trade.toLowerCase()} of spare parts,
            accessories and helmets, open {business.hours.label.toLowerCase()}. The proprietor is {business.proprietor}.
          </p>
          <p>
            We are an authorized dealer for {dealerList()}, and sell their genuine parts at company price. We also sell all kinds of
            original Yamaha, Suzuki and Honda parts at affordable prices.
          </p>
          <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2" aria-label="Brands we deal in">
            {brandsByRelation(catalog).map((b) => (
              <li key={b.slug}>
                <Link
                  href={`/brands/${b.slug}`}
                  className="flex min-h-12 flex-wrap items-center justify-between gap-x-3 gap-y-1 rounded-md border border-line px-3 py-2 transition-colors hover:border-ink"
                >
                  <span className="display text-xl text-ink">{b.name}</span>
                  <BrandRelationBadge brandSlug={b.slug} detail tone="light" />
                </Link>
              </li>
            ))}
          </ul>
          <p>
            This website organises parts around the bikes people ride: {brands.map((b) => b.name).join(", ")}. Search by
            part name or part number, or start from your motorcycle model with the{" "}
            <Link href="/part-finder" className="text-brand underline">
              part finder
            </Link>
            .
          </p>
          <p>
            Orders are placed by WhatsApp or phone. You can collect from the shop or have parts sent by courier anywhere in
            Bangladesh. The store confirms the price, availability and any delivery charge with you first.
          </p>
        </div>
        <aside className="card h-fit space-y-3 p-5">
          <h2 className="font-display text-lg font-bold">Talk to the shop</h2>
          <p className="text-sm text-muted">{business.hours.label}</p>
          <CallButton className="w-full" />
          <WhatsAppButton className="w-full" />
          <Link href="/contact" className="btn btn-outline w-full">
            Location & contact
          </Link>
        </aside>
      </div>
    </>
  );
}
