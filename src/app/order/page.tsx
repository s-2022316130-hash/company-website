import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/PageHeader";
import { OrderForm } from "@/components/order/OrderForm";

export const metadata: Metadata = {
  title: "Send an order request",
  robots: { index: false, follow: false },
};

export default function OrderPage() {
  return (
    <>
      <PageHeader
        title="Send your order request"
        description="Add your details, choose pickup or courier, and send the request by WhatsApp or phone. The store confirms everything before you pay."
        crumbs={[
          { label: "Cart", href: "/cart" },
          { label: "Order", href: "/order" },
        ]}
      />
      <div className="container-page py-6">
        <OrderForm />
      </div>
    </>
  );
}
