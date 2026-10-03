"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { ArrowRight, Minus, Package, Plus, ShoppingCart, Trash2, X } from "lucide-react";
import { MAX_LINE_QUANTITY, type CartLine } from "@/lib/cart/cart";
import { dispatchCart, useCart } from "@/lib/cart/use-cart";
import { formatPrice, pluralize } from "@/lib/format";

const OPEN_EVENT = "nirob:open-cart";

/** Opens the cart drawer from anywhere (header and phone bar cart buttons). */
export function openCartDrawer() {
  window.dispatchEvent(new Event(OPEN_EVENT));
}

/**
 * Side drawer with the cart: slides in from the right, items stagger in, quantities change in place.
 * The full cart page (/cart) and the order form (/order) are unchanged; the drawer links to both.
 */
export function CartDrawer() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  // Bumped on every open so the item list remounts and staggers in again.
  const [opens, setOpens] = useState(0);
  const { lines, totals } = useCart();
  const pathname = usePathname();
  const close = () => dialogRef.current?.close();

  useEffect(() => {
    const open = () => {
      if (dialogRef.current?.open) return;
      dialogRef.current?.showModal();
      setOpens((n) => n + 1);
    };
    window.addEventListener(OPEN_EVENT, open);
    return () => window.removeEventListener(OPEN_EVENT, open);
  }, []);

  // Leaving the page (e.g. "Continue to order") closes the drawer.
  useEffect(() => {
    dialogRef.current?.close();
  }, [pathname]);

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="cart-drawer-title"
      onClick={(e) => {
        if (e.target === dialogRef.current) close();
      }}
      className="dialog-motion drawer-right my-0 ml-auto mr-0 h-dvh max-h-none w-[min(26rem,92vw)] max-w-none bg-canvas p-0 text-ink shadow-modal"
    >
      <div className="flex h-full flex-col">
        <div className="flex items-center justify-between gap-3 border-b border-line bg-surface px-4 py-3">
          <h2 id="cart-drawer-title" className="display text-2xl">
            Your cart{" "}
            {totals.itemCount > 0 && (
              <span key={totals.itemCount} className="inline-block animate-tick text-base text-muted">
                ({totals.itemCount})
              </span>
            )}
          </h2>
          <button type="button" className="btn btn-ghost btn-sm -mr-2" onClick={close} aria-label="Close cart">
            <X className="size-5" aria-hidden="true" />
          </button>
        </div>

        {lines.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
            <span className="tech-grid mb-4 grid size-16 place-items-center rounded-full">
              <ShoppingCart className="size-7 text-steel" aria-hidden="true" />
            </span>
            <p className="display text-2xl">Your cart is empty</p>
            <p className="mt-1.5 text-sm text-muted">Search for a part, or start from your motorcycle.</p>
            <div className="mt-5 flex flex-wrap justify-center gap-2">
              <Link href="/shop" onClick={close} className="btn btn-primary">
                Shop parts
              </Link>
              <Link href="/part-finder" onClick={close} className="btn btn-outline">
                Find parts by bike
              </Link>
            </div>
          </div>
        ) : (
          <>
            <ul key={opens} className="stagger-in flex-1 space-y-2 overflow-y-auto overscroll-contain p-3" aria-label="Items in your cart">
              {lines.map((line, i) => (
                <DrawerLine key={line.productId} line={line} index={i} onNavigate={close} />
              ))}
            </ul>
            <div className="border-t border-line bg-surface p-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
              <dl className="space-y-1.5 text-sm">
                <div className="flex justify-between">
                  <dt className="text-muted">Items</dt>
                  <dd key={totals.itemCount} className="animate-tick font-semibold tabular-nums">
                    {totals.itemCount}
                  </dd>
                </div>
                {totals.pricedSubtotal > 0 && (
                  <div className="flex justify-between">
                    <dt className="text-muted">Listed prices</dt>
                    <dd key={totals.pricedSubtotal} className="animate-tick font-semibold tabular-nums">
                      {formatPrice(totals.pricedSubtotal)}
                    </dd>
                  </div>
                )}
                {totals.unpricedLines > 0 && (
                  <div className="flex justify-between gap-3">
                    <dt className="text-muted">Price to confirm</dt>
                    <dd className="text-right font-semibold">{pluralize(totals.unpricedLines, "item")}</dd>
                  </div>
                )}
              </dl>
              <p className="mt-3 text-xs text-muted">
                No payment is taken online. The store confirms price, availability and any delivery charge.
              </p>
              <div className="mt-3 grid gap-2">
                <Link href="/order" onClick={close} className="btn btn-primary btn-lg w-full">
                  Continue to order <ArrowRight className="size-4" aria-hidden="true" />
                </Link>
                <Link href="/cart" onClick={close} className="btn btn-outline w-full">
                  View full cart
                </Link>
              </div>
            </div>
          </>
        )}
      </div>
    </dialog>
  );
}

function DrawerLine({ line, index, onNavigate }: { line: CartLine; index: number; onNavigate: () => void }) {
  return (
    <li className="card flex gap-3 p-2.5" style={{ "--i": Math.min(index, 8) } as CSSProperties}>
      <Link
        href={`/products/${line.slug}`}
        onClick={onNavigate}
        tabIndex={-1}
        aria-hidden="true"
        className="tech-grid relative grid size-16 shrink-0 place-items-center overflow-hidden rounded-md"
      >
        {line.image ? (
          <Image src={line.image.src} alt="" fill sizes="64px" className="object-cover" />
        ) : (
          <Package className="size-6 text-steel opacity-60" />
        )}
      </Link>
      <div className="min-w-0 flex-1">
        <Link href={`/products/${line.slug}`} onClick={onNavigate} className="line-clamp-2 text-sm font-semibold leading-snug hover:text-brand">
          {line.name}
        </Link>
        {line.fitmentSummary && <p className="truncate text-xs text-muted">{line.fitmentSummary}</p>}
        <div className="mt-1.5 flex items-center justify-between gap-2">
          <div className="inline-flex items-center rounded-md border border-line-strong bg-surface" role="group" aria-label={`Quantity for ${line.name}`}>
            <button
              type="button"
              className="grid size-9 place-items-center rounded-l-md hover:bg-steel-soft disabled:opacity-40"
              onClick={() => dispatchCart({ type: "setQuantity", productId: line.productId, quantity: line.quantity - 1 })}
              disabled={line.quantity <= 1}
              aria-label="Decrease quantity"
            >
              <Minus className="size-3.5" aria-hidden="true" />
            </button>
            <span key={line.quantity} className="w-8 animate-tick text-center text-sm font-semibold tabular-nums" aria-live="polite">
              {line.quantity}
            </span>
            <button
              type="button"
              className="grid size-9 place-items-center rounded-r-md hover:bg-steel-soft disabled:opacity-40"
              onClick={() => dispatchCart({ type: "setQuantity", productId: line.productId, quantity: line.quantity + 1 })}
              disabled={line.quantity >= MAX_LINE_QUANTITY}
              aria-label="Increase quantity"
            >
              <Plus className="size-3.5" aria-hidden="true" />
            </button>
          </div>
          <span className="text-xs font-semibold text-steel">
            {line.price !== undefined ? formatPrice(line.price * line.quantity) : formatPrice(undefined)}
          </span>
          <button
            type="button"
            onClick={() => dispatchCart({ type: "remove", productId: line.productId })}
            className="grid size-9 place-items-center rounded-md text-muted transition-colors hover:bg-danger-soft hover:text-danger"
            aria-label={`Remove ${line.name} from cart`}
          >
            <Trash2 className="size-4" aria-hidden="true" />
          </button>
        </div>
      </div>
    </li>
  );
}
