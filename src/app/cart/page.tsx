import type { Metadata } from "next";
import { CartView } from "@/components/cart/CartView";
import { PageHeader } from "@/components/layout/PageHeader";

export const metadata: Metadata = {
  title: "Your cart",
  robots: { index: false, follow: false },
};

export default function CartPage() {
  return (
    <>
      <PageHeader title="Your cart" crumbs={[{ label: "Cart", href: "/cart" }]} />
      <div className="container-page py-6">
        <CartView />
      </div>
    </>
  );
}
