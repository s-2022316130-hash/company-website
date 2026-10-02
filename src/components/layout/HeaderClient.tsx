"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRef, useState } from "react";
import { Bike, Menu, MessageCircle, Phone, ShoppingCart, X } from "lucide-react";
import { TrackedAnchor } from "@/components/analytics/Track";
import { business, primaryWhatsApp } from "@/config/business";
import { mainNav } from "@/config/navigation";
import { useCart, useHydrated } from "@/lib/cart/use-cart";
import { cx } from "@/lib/cx";
import { whatsAppUrl } from "@/lib/order";

function isActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function DesktopNav() {
  const pathname = usePathname();
  return (
    <ul className="flex items-center gap-1">
      {mainNav.map((item) => {
        const active = isActive(pathname, item.href);
        return (
          <li key={item.href}>
            <Link
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={cx(
                "inline-flex min-h-11 items-center border-b-2 px-3 font-display text-[0.9375rem] font-semibold uppercase tracking-[0.08em] transition-colors",
                active ? "border-brand-bright text-white" : "border-transparent text-on-dark-muted hover:text-white",
              )}
            >
              {item.label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

function useCartCount() {
  const hydrated = useHydrated();
  const { totals } = useCart();
  return hydrated ? totals.itemCount : 0;
}

export function CartLink() {
  const count = useCartCount();
  return (
    <Link
      href="/cart"
      className="relative grid size-11 place-items-center rounded-md text-white hover:bg-white/10"
      aria-label={count > 0 ? `Cart, ${count} item${count === 1 ? "" : "s"}` : "Cart, empty"}
    >
      <ShoppingCart className="size-6" aria-hidden="true" />
      {count > 0 && (
        <span className="absolute -right-0.5 -top-0.5 grid min-w-5 place-items-center rounded-full bg-brand px-1 text-xs font-bold text-white ring-2 ring-graphite">
          {count > 99 ? "99+" : count}
        </span>
      )}
    </Link>
  );
}

export function MobileMenu() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const close = () => dialogRef.current?.close();

  return (
    <>
      <button
        type="button"
        className="grid size-11 place-items-center rounded-md text-white hover:bg-white/10 lg:hidden"
        aria-label="Open menu"
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => {
          dialogRef.current?.showModal();
          setOpen(true);
        }}
      >
        <Menu className="size-6" aria-hidden="true" />
      </button>
      <dialog
        ref={dialogRef}
        aria-label="Menu"
        onClose={() => setOpen(false)}
        onClick={(e) => {
          if (e.target === dialogRef.current) close();
        }}
        className="m-0 h-dvh max-h-none w-[min(20rem,85vw)] max-w-none bg-graphite p-0 text-on-dark"
      >
        <div className="flex items-center justify-between border-b border-graphite-3 px-4 py-3">
          <span className="display text-xl text-white">Menu</span>
          <button
            type="button"
            className="grid size-10 place-items-center rounded-md text-white hover:bg-white/10"
            onClick={close}
            aria-label="Close menu"
          >
            <X className="size-5" aria-hidden="true" />
          </button>
        </div>
        <nav aria-label="Main">
          <ul className="py-2">
            {[{ label: "Home", href: "/" }, ...mainNav, { label: "FAQ", href: "/faq" }].map((item) => {
              const active = item.href === "/" ? pathname === "/" : isActive(pathname, item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={close}
                    aria-current={active ? "page" : undefined}
                    className={cx(
                      "flex min-h-12 items-center border-l-4 px-4 font-display text-lg font-semibold uppercase tracking-[0.06em]",
                      active ? "border-brand-bright bg-white/5 text-white" : "border-transparent text-on-dark hover:bg-white/5",
                    )}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
        <div className="chain-rule mx-4 opacity-60" aria-hidden="true" />
        <div className="space-y-1 px-4 py-4 text-sm text-on-dark-muted">
          <p>{business.address.full}</p>
          <p>{business.hours.label}</p>
          <p>
            Orders:{" "}
            <a href={`tel:${business.phones.orders.e164}`} className="font-semibold text-white">
              {business.phones.orders.display}
            </a>
          </p>
        </div>
      </dialog>
    </>
  );
}

/** Fixed bottom bar on phones: call, WhatsApp, part finder, cart. */
export function MobileActionBar() {
  const count = useCartCount();
  const item = "flex min-h-14 flex-1 flex-col items-center justify-center gap-0.5 text-xs font-semibold";
  return (
    <nav
      aria-label="Quick actions"
      className="fixed inset-x-0 bottom-0 z-40 flex border-t border-graphite-3 bg-graphite pb-[env(safe-area-inset-bottom)] text-on-dark md:hidden"
    >
      <TrackedAnchor
        href={`tel:${business.phones.orders.e164}`}
        event="phone_click"
        eventProps={{ number: business.phones.orders.e164, source: "mobile_bar" }}
        className={item}
      >
        <Phone className="size-5" aria-hidden="true" />
        Call
      </TrackedAnchor>
      <TrackedAnchor
        href={whatsAppUrl(primaryWhatsApp.waId)}
        target="_blank"
        rel="noopener noreferrer"
        event="whatsapp_click"
        eventProps={{ number: primaryWhatsApp.e164, source: "mobile_bar" }}
        className={cx(item, "text-[#4ade80]")}
      >
        <MessageCircle className="size-5" aria-hidden="true" />
        WhatsApp
      </TrackedAnchor>
      <Link href="/part-finder" className={cx(item, "text-brand-bright")}>
        <Bike className="size-5" aria-hidden="true" />
        Find part
      </Link>
      <Link href="/cart" className={cx(item, "relative")} aria-label={`Cart, ${count} items`}>
        <span className="relative">
          <ShoppingCart className="size-5" aria-hidden="true" />
          {count > 0 && (
            <span className="absolute -right-3 -top-2 grid min-w-5 place-items-center rounded-full bg-brand px-1 text-[0.6875rem] font-bold text-white">
              {count > 99 ? "99+" : count}
            </span>
          )}
        </span>
        Cart
      </Link>
    </nav>
  );
}
