import Link from "next/link";
import { CircleAlert, Info } from "lucide-react";
import type { ProductView } from "@/lib/types";

/** Structured fitment panel: model links grouped by brand, or an honest note when fitment is not model-based. */
export function CompatibilityList({ product }: { product: ProductView }) {
  if (product.fitment === "universal") {
    return (
      <p className="flex gap-2 text-sm text-ink">
        <Info className="mt-0.5 size-4 shrink-0 text-steel" aria-hidden="true" />
        This product is not specific to one motorcycle model. Ask the store if you are unsure it suits your bike.
      </p>
    );
  }

  if (product.fitment === "unconfirmed" || product.models.length === 0) {
    return (
      <p className="flex gap-2 rounded-lg bg-warning-soft p-3 text-sm text-ink">
        <CircleAlert className="mt-0.5 size-4 shrink-0 text-warning" aria-hidden="true" />
        Compatible models are not listed for this product yet. Call or WhatsApp with your bike model and the store will
        confirm fit.
      </p>
    );
  }

  return (
    <ul className="space-y-3">
      {product.brands.map((brand) => (
        <li key={brand.slug}>
          <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-muted">{brand.name}</p>
          <ul className="flex flex-wrap gap-2">
            {product.models
              .filter((m) => m.brand === brand.slug)
              .map((m) => (
                <li key={m.id}>
                  <Link href={`/models/${m.slug}`} className="chip">
                    {brand.name} {m.name}
                  </Link>
                </li>
              ))}
          </ul>
        </li>
      ))}
    </ul>
  );
}
