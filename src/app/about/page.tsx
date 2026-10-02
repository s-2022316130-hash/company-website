import type { Metadata } from "next";
import Link from "next/link";
import { CallButton, WhatsAppButton } from "@/components/contact/ContactActions";
import { PageHeader } from "@/components/layout/PageHeader";
import { business } from "@/config/business";
import { loadCatalog } from "@/lib/catalog/catalog";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "About Nirob Autos",
  description: `${business.name} (${business.banglaName}) is a motorcycle spare parts and accessories shop in ${business.address.locality}, Bangladesh.`,
  path: "/about",
});

export default async function AboutPage() {
  const { brands } = await loadCatalog();
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
      {/* Factual store information only. Add the shop's own story, founding year and team here when supplied. */}
      <div className="container-page grid gap-6 py-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <div className="card space-y-4 p-5 text-[0.9375rem] leading-relaxed text-ink sm:p-6">
          <p>
            {business.name} is a motorcycle spare parts shop at {business.address.full}. We sell spare parts, maintenance
            products and accessories for motorcycles, and we are open {business.hours.label.toLowerCase()}.
          </p>
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
