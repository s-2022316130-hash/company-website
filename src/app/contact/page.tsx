import type { Metadata } from "next";
import Link from "next/link";
import { StoreContactCard } from "@/components/contact/StoreContactCard";
import { PageHeader } from "@/components/layout/PageHeader";
import { JsonLd } from "@/components/ui/JsonLd";
import { business } from "@/config/business";
import { localBusinessJsonLd, pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Contact & Location",
  description: `Contact ${business.name}, motorcycle spare parts shop at ${business.address.full}. Call ${business.phones.orders.display}. Open ${business.hours.label.toLowerCase()}.`,
  path: "/contact",
});

export default function ContactPage() {
  return (
    <>
      <PageHeader
        title="Contact Nirob Auto's"
        description="Call, WhatsApp or visit the shop. Tell us your bike model and the part you need, and we'll check for you."
        crumbs={[{ label: "Contact", href: "/contact" }]}
      />
      <div className="container-page space-y-8 py-6">
        <StoreContactCard showMap />
        <section className="card p-5" aria-labelledby="how-title">
          <h2 id="how-title" className="font-display text-xl font-bold text-ink">
            Ordering a part
          </h2>
          <ol className="mt-3 list-decimal space-y-1.5 pl-5 text-[0.9375rem] text-ink">
            <li>
              Find the part in the <Link href="/shop" className="text-brand underline">shop</Link> or with the{" "}
              <Link href="/part-finder" className="text-brand underline">part finder</Link>, and add it to your cart.
            </li>
            <li>
              Go to <Link href="/order" className="text-brand underline">order</Link>, add your details and choose store pickup
              or courier delivery.
            </li>
            <li>Send the request by WhatsApp or phone. The store confirms price, availability and any delivery charge.</li>
          </ol>
          <p className="mt-3 text-sm text-muted">
            Not sure what the part is called? Send a photo of the old part on WhatsApp with your bike model.
          </p>
        </section>
      </div>
      <JsonLd data={localBusinessJsonLd()} />
    </>
  );
}
