import type { Metadata } from "next";
import { ChevronDown } from "lucide-react";
import { CallButton, WhatsAppButton } from "@/components/contact/ContactActions";
import { PageHeader } from "@/components/layout/PageHeader";
import { business } from "@/config/business";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Frequently Asked Questions",
  description: `How ordering, pickup, courier delivery, prices and part compatibility work at ${business.name}, Madhupur.`,
  path: "/faq",
});

/**
 * Answers describe only what has been confirmed: WhatsApp/phone ordering, store pickup,
 * nationwide courier, no online payment. Add payment, returns and warranty answers once the shop confirms them.
 */
const faqs: { q: string; a: string }[] = [
  {
    q: "How do I order a part?",
    a: `Add products to your cart, then send the order request from the order page by WhatsApp (${business.whatsapp
      .map((w) => w.display)
      .join(" or ")}) or by calling ${business.phones.orders.display}. The store replies to confirm.`,
  },
  {
    q: "Can I pay online?",
    a: "No. The website does not take payments. The store confirms the final price with you before anything is paid.",
  },
  {
    q: "Do you deliver?",
    a: `Yes. You can collect from the shop at ${business.address.full}, or have parts sent by courier anywhere in Bangladesh. The store tells you the delivery charge before sending.`,
  },
  {
    q: "Why do some products say “Call for price”?",
    a: "Prices for some parts change often or have not been listed online yet. Call or WhatsApp and the store will tell you the current price.",
  },
  {
    q: "How do I know a part fits my motorcycle?",
    a: "Each product lists the motorcycle models it is recorded as fitting. If you are unsure, send your bike model (and a photo of the old part if you can) on WhatsApp and the store will check before you order.",
  },
  {
    q: "My bike model isn’t listed. Can you still help?",
    a: "Yes, probably. The online catalogue is still growing. Call or WhatsApp with your bike model and the part you need.",
  },
  {
    q: "What does “Call to confirm” mean?",
    a: "Stock is not tracked live on the website. “Call to confirm” means you should check availability with the store before coming in or ordering.",
  },
  {
    q: "When is the shop open?",
    a: `${business.hours.label}.`,
  },
];

export default function FaqPage() {
  return (
    <>
      <PageHeader title="Frequently asked questions" crumbs={[{ label: "FAQ", href: "/faq" }]} />
      <div className="container-page max-w-3xl space-y-3 py-6">
        {faqs.map((f) => (
          <details key={f.q} className="card group p-0 [&_summary::-webkit-details-marker]:hidden">
            <summary className="flex min-h-14 cursor-pointer items-center justify-between gap-3 px-5 py-3 font-semibold text-ink">
              {f.q}
              <ChevronDown className="size-5 shrink-0 text-muted transition-transform group-open:rotate-180" aria-hidden="true" />
            </summary>
            <p className="px-5 pb-4 text-[0.9375rem] text-ink">{f.a}</p>
          </details>
        ))}
        <div className="card mt-6 flex flex-wrap items-center justify-between gap-3 p-5">
          <p className="font-semibold text-ink">Still have a question?</p>
          <div className="flex flex-wrap gap-2">
            <CallButton />
            <WhatsAppButton />
          </div>
        </div>
      </div>
    </>
  );
}
