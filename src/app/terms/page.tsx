import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/PageHeader";
import { business, dealerList } from "@/config/business";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Terms of use",
  description: `How orders and product information work on the ${business.name} website.`,
  path: "/terms",
});

// States how the site works today. Returns, warranty and payment terms are intentionally absent
// until the shop confirms them; have this page reviewed before launch.
export default function TermsPage() {
  return (
    <>
      <PageHeader title="Terms of use" crumbs={[{ label: "Terms", href: "/terms" }]} />
      <div className="container-page max-w-3xl py-6">
        <div className="card space-y-4 p-5 text-[0.9375rem] leading-relaxed text-ink sm:p-6">
          <h2 className="font-display text-lg font-bold">Order requests</h2>
          <p>
            Sending an order from this website is a request, not a completed purchase. An order is only agreed once{" "}
            {business.name} confirms the price, availability and, for courier orders, the delivery charge with you.
          </p>
          <h2 className="font-display text-lg font-bold">Prices and availability</h2>
          <p>
            Prices shown on the website, where listed, are a guide and may change. Stock is not tracked live. The store
            confirms both when you order.
          </p>
          <h2 className="font-display text-lg font-bold">Compatibility information</h2>
          <p>
            Compatible models are listed to help you find parts. Motorcycles can differ between versions and years, so
            please confirm fit with the store before ordering if you are unsure.
          </p>
          <h2 className="font-display text-lg font-bold">Brand names</h2>
          <p>
            {business.name} is an authorized dealer for {dealerList()} and sells their genuine parts at company price. It also sells
            original Yamaha, Suzuki and Honda parts, without being a dealer for those brands. Other motorcycle and part
            brand names are used only to describe compatibility. A product is described as genuine only when the shop has
            confirmed it. Manufacturer logos and official model photos are shown only when the distributor has supplied
            them or permitted their use; until then the site shows brand names and original line drawings.
          </p>
        </div>
      </div>
    </>
  );
}
