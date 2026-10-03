"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Check, Minus, Plus, ShoppingCart } from "lucide-react";
import { MAX_LINE_QUANTITY, type CartLine } from "@/lib/cart/cart";
import { dispatchCart } from "@/lib/cart/use-cart";
import { cx } from "@/lib/cx";

type LineInput = Omit<CartLine, "quantity">;

/** Confirmation state shared by both buttons: green fill, a check that pops in. */
const addedStyle = "border-success bg-success text-white hover:bg-success";

/**
 * Compact add button for product cards. Fills in when the card is hovered; on click it turns into a
 * green "Added" for 1.8s while the header cart pulses (see CartButton).
 */
export function AddToCartButton({
  line,
  disabled,
  className,
}: {
  line: LineInput;
  disabled?: boolean;
  className?: string;
}) {
  const [added, setAdded] = useAddedFlash();
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={() => {
        dispatchCart({ type: "add", line });
        setAdded();
      }}
      className={cx(
        "btn btn-sm w-full",
        added ? addedStyle : "btn-outline group-hover:border-ink group-hover:bg-ink group-hover:text-white",
        className,
      )}
      aria-label={disabled ? `${line.name} is out of stock` : `Add ${line.name} to cart`}
    >
      {added ? <Check className="size-4 animate-check-in" aria-hidden="true" /> : <ShoppingCart className="size-4" aria-hidden="true" />}
      {disabled ? "Out of stock" : added ? <span className="animate-fade-in">Added</span> : "Add to cart"}
      <span className="sr-only" role="status">
        {added ? `${line.name} added to cart` : ""}
      </span>
    </button>
  );
}

/** Product-page purchase block: quantity stepper, add to cart, and order now. */
export function ProductPurchase({ line, disabled }: { line: LineInput; disabled?: boolean }) {
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useAddedFlash(4000);

  const add = () => dispatchCart({ type: "add", line, quantity: qty });

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <span className="text-sm font-medium text-ink" id="qty-label">
          Quantity
        </span>
        <div className="inline-flex items-center rounded-lg border border-line-strong bg-surface" role="group" aria-labelledby="qty-label">
          <button
            type="button"
            className="grid size-11 place-items-center rounded-l-lg transition-colors duration-fast hover:bg-steel-soft active:bg-line disabled:opacity-40"
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            disabled={qty <= 1}
            aria-label="Decrease quantity"
          >
            <Minus className="size-4" aria-hidden="true" />
          </button>
          <output key={qty} className="w-10 animate-tick text-center font-semibold tabular-nums" aria-live="polite">
            {qty}
          </output>
          <button
            type="button"
            className="grid size-11 place-items-center rounded-r-lg transition-colors duration-fast hover:bg-steel-soft active:bg-line disabled:opacity-40"
            onClick={() => setQty((q) => Math.min(MAX_LINE_QUANTITY, q + 1))}
            disabled={qty >= MAX_LINE_QUANTITY}
            aria-label="Increase quantity"
          >
            <Plus className="size-4" aria-hidden="true" />
          </button>
        </div>
      </div>
      <div className="grid gap-2 sm:grid-cols-2">
        <button
          type="button"
          className={cx("btn btn-lg", added ? addedStyle : "btn-dark")}
          disabled={disabled}
          onClick={() => {
            add();
            setAdded();
          }}
        >
          {added ? <Check className="size-5 animate-check-in" aria-hidden="true" /> : <ShoppingCart className="size-5" aria-hidden="true" />}
          {disabled ? "Out of stock" : added ? <span className="animate-fade-in">Added to cart</span> : "Add to cart"}
        </button>
        <Link
          href="/order"
          className={cx("btn btn-lg btn-primary", disabled && "pointer-events-none opacity-55")}
          aria-disabled={disabled}
          onClick={() => {
            if (!disabled) add();
          }}
        >
          Order now
        </Link>
      </div>
      <p className="min-h-5 text-sm" role="status">
        {added && (
          <span className="animate-fade-in">
            Added {qty} to your cart.{" "}
            <Link href="/cart" className="font-semibold text-brand underline">
              View cart
            </Link>
          </span>
        )}
      </p>
    </div>
  );
}

function useAddedFlash(ms = 1800): [boolean, () => void] {
  const [added, setAdded] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);
  return [
    added,
    () => {
      setAdded(true);
      clearTimeout(timer.current);
      timer.current = setTimeout(() => setAdded(false), ms);
    },
  ];
}
