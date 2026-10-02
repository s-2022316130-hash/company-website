import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/PageHeader";
import { business } from "@/config/business";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Privacy",
  description: `How the ${business.name} website handles your information.`,
  path: "/privacy",
});

// Describes what this website actually does. Have it reviewed before launch, and update it if analytics,
// accounts or an order database are added.
export default function PrivacyPage() {
  return (
    <>
      <PageHeader title="Privacy" crumbs={[{ label: "Privacy", href: "/privacy" }]} />
      <div className="container-page max-w-3xl py-6">
        <div className="card space-y-4 p-5 text-[0.9375rem] leading-relaxed text-ink sm:p-6">
          <h2 className="font-display text-lg font-bold">What this website stores</h2>
          <p>
            Your cart and recent searches are saved only in your own browser (local storage) so they are still there when
            you come back. They are not sent to {business.name}. Clearing your browser data removes them.
          </p>
          <h2 className="font-display text-lg font-bold">Order requests</h2>
          <p>
            The details you type on the order page (name, phone, address, motorcycle, notes) are not stored by this website.
            They are placed into a WhatsApp message that you choose to send, or shown on screen for you to read out on a call.
            Once you send a WhatsApp message, it is handled by WhatsApp and by {business.name} to answer your order.
          </p>
          <h2 className="font-display text-lg font-bold">Accounts, payments and tracking</h2>
          <p>
            There are no customer accounts and no online payments. No advertising or analytics service is connected to the
            website at present.
          </p>
          <h2 className="font-display text-lg font-bold">Contact</h2>
          <p>
            Questions about your information: call {business.phones.store.display} or visit the shop at {business.address.full}.
          </p>
        </div>
      </div>
    </>
  );
}
