"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ArrowRight, Minus, Package, Plus, ShoppingCart, Trash2 } from "lucide-react";
import { EmptyState } from "@/components/ui/EmptyState";
import { Skeleton } from "@/components/ui/Skeleton";
import { MAX_LINE_QUANTITY, type CartLine } from "@/lib/cart/cart";
import { dispatchCart, useCart, useHydrated } from "@/lib/cart/use-cart";
import { formatPrice, pluralize } from "@/lib/format";

export function CartView() {
  const hydrated = useHydrated();
  const { lines, totals } = useCart();
  const [confirmClear, setConfirmClear] = useState(false);

  if (!hydrated) {
    return (
      <div className="space-y-3" role="status" aria-label="Loading cart">
        <Skeleton className="h-28 w-full rounded-xl" />
        <Skeleton className="h-28 w-full rounded-xl" />
      </div>
    );
  }

  if (lines.length === 0) {
    return (
      <EmptyState
        icon={ShoppingCart}
        title="Your cart is empty"
        description="Find the part you need by searching, or start from your motorcycle model."
        actions={[
          { label: "Shop parts", href: "/shop" },
          { label: "Find parts by bike", href: "/part-finder", variant: "outline" },
        ]}
      />
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
      <section aria-labelledby="cart-items-title">
        <h2 id="cart-items-title" className="sr-only">
          Items in your cart
        </h2>
        <ul className="space-y-3">
          {lines.map((line) => (
            <CartItem key={line.productId} line={line} />
          ))}
        </ul>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <Link href="/shop" className="btn btn-outline btn-sm">
            Continue shopping
          </Link>
          {confirmClear ? (
            <span className="flex items-center gap-2 text-sm">
              Remove all items?
              <button
                type="button"
                className="btn btn-sm border-danger text-danger hover:bg-danger-soft"
                onClick={() => {
                  dispatchCart({ type: "clear" });
                  setConfirmClear(false);
                }}
              >
                Yes, clear cart
              </button>
              <button type="button" className="btn btn-ghost btn-sm" onClick={() => setConfirmClear(false)}>
                Keep items
              </button>
            </span>
          ) : (
            <button type="button" className="btn btn-ghost btn-sm text-muted" onClick={() => setConfirmClear(true)}>
              Clear cart
            </button>
          )}
        </div>
      </section>

      <aside className="card h-fit p-5 lg:sticky lg:top-36" aria-labelledby="summary-title">
        <h2 id="summary-title" className="font-display text-xl font-bold text-ink">
          Order summary
        </h2>
        <dl className="mt-4 space-y-2 text-[0.9375rem]">
          <div className="flex justify-between">
            <dt className="text-muted">Items</dt>
            <dd className="font-semibold">{totals.itemCount}</dd>
          </div>
          {totals.pricedSubtotal > 0 && (
            <div className="flex justify-between">
              <dt className="text-muted">Listed prices</dt>
              <dd className="font-semibold">{formatPrice(totals.pricedSubtotal)}</dd>
            </div>
          )}
          {totals.unpricedLines > 0 && (
            <div className="flex justify-between gap-3">
              <dt className="text-muted">Price to confirm</dt>
              <dd className="text-right font-semibold">{pluralize(totals.unpricedLines, "item")}</dd>
            </div>
          )}
        </dl>
        <p className="mt-4 rounded-lg bg-steel-soft p-3 text-sm text-ink">
          No payment is taken online. Send your order request and the store will confirm the final price, availability and
          any delivery charge.
        </p>
        <Link href="/order" className="btn btn-primary btn-lg mt-4 w-full">
          Continue to order <ArrowRight className="size-4" aria-hidden="true" />
        </Link>
      </aside>
    </div>
  );
}

function CartItem({ line }: { line: CartLine }) {
  return (
    <li className="card flex gap-3 p-3 sm:gap-4 sm:p-4">
      <Link
        href={`/products/${line.slug}`}
        className="tech-grid relative grid size-20 shrink-0 place-items-center overflow-hidden rounded-lg sm:size-24"
        tabIndex={-1}
        aria-hidden="true"
      >
        {line.image ? (
          <Image src={line.image.src} alt="" fill sizes="96px" className="object-contain p-1" />
        ) : (
          <Package className="size-8 text-steel opacity-60" />
        )}
      </Link>
      <div className="min-w-0 flex-1">
        <Link href={`/products/${line.slug}`} className="line-clamp-2 font-semibold leading-snug text-ink hover:text-brand">
          {line.name}
        </Link>
        {line.fitmentSummary && <p className="mt-0.5 truncate text-sm text-muted">{line.fitmentSummary}</p>}
        <p className="mt-1 text-sm font-semibold">
          {line.price !== undefined ? `${formatPrice(line.price)} each` : formatPrice(undefined)}
        </p>
        <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
          <div className="inline-flex items-center rounded-lg border border-line-strong" role="group" aria-label={`Quantity for ${line.name}`}>
            <button
              type="button"
              className="grid size-10 place-items-center rounded-l-lg hover:bg-steel-soft disabled:opacity-40"
              onClick={() => dispatchCart({ type: "setQuantity", productId: line.productId, quantity: line.quantity - 1 })}
              disabled={line.quantity <= 1}
              aria-label="Decrease quantity"
            >
              <Minus className="size-4" aria-hidden="true" />
            </button>
            <span className="w-9 text-center text-sm font-semibold tabular-nums" aria-live="polite">
              {line.quantity}
            </span>
            <button
              type="button"
              className="grid size-10 place-items-center rounded-r-lg hover:bg-steel-soft disabled:opacity-40"
              onClick={() => dispatchCart({ type: "setQuantity", productId: line.productId, quantity: line.quantity + 1 })}
              disabled={line.quantity >= MAX_LINE_QUANTITY}
              aria-label="Increase quantity"
            >
              <Plus className="size-4" aria-hidden="true" />
            </button>
          </div>
          <div className="flex items-center gap-3">
            {line.price !== undefined && (
              <span className="text-sm font-semibold">{formatPrice(line.price * line.quantity)}</span>
            )}
            <button
              type="button"
              onClick={() => dispatchCart({ type: "remove", productId: line.productId })}
              className="btn btn-ghost btn-sm text-danger"
              aria-label={`Remove ${line.name} from cart`}
            >
              <Trash2 className="size-4" aria-hidden="true" />
              <span className="max-sm:sr-only">Remove</span>
            </button>
          </div>
        </div>
      </div>
    </li>
  );
}
