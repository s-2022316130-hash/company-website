"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, type ReactNode, type RefObject } from "react";
import { Bike, Menu, MessageCircle, Phone, Search, ShoppingCart, X } from "lucide-react";
import { TrackedAnchor } from "@/components/analytics/Track";
import { openCartDrawer } from "@/components/cart/CartDrawer";
import { business, primaryWhatsApp } from "@/config/business";
import { mainNav, secondaryNav } from "@/config/navigation";
import { useCart, useHydrated } from "@/lib/cart/use-cart";
import { cx } from "@/lib/cx";
import { pulse } from "@/lib/motion";
import { whatsAppUrl } from "@/lib/order";

/** Scroll distance before the header compacts. */
const COMPACT_AFTER = 96;
/** Travel needed before a change of scroll direction counts, so small jitters don't flicker the header. */
const DIRECTION_SLOP = 6;

function isTextEntry(el: EventTarget | null): boolean {
  if (el instanceof HTMLTextAreaElement || el instanceof HTMLSelectElement) return true;
  if (el instanceof HTMLInputElement) return !["checkbox", "radio", "button", "submit", "range"].includes(el.type);
  return el instanceof HTMLElement && el.isContentEditable;
}

/**
 * Fixed site header. Its state lives on <html data-header> (styled in globals.css, "Header"), written
 * by one passive scroll listener at most once per frame; React never re-renders on scroll.
 * Also marks <html data-typing> while a text field has focus, so the phone action bar steps aside.
 */
export function HeaderShell({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = document.documentElement;
    let lastY = window.scrollY;
    let frame = 0;

    const set = (next: string) => {
      if (root.dataset.header !== next) root.dataset.header = next;
    };
    const update = () => {
      frame = 0;
      const y = Math.max(0, window.scrollY);
      if (y <= COMPACT_AFTER) {
        lastY = y;
        set("top");
        return;
      }
      const dy = y - lastY;
      if (Math.abs(dy) < DIRECTION_SLOP) {
        if (root.dataset.header === "top") set("compact");
        return;
      }
      lastY = y;
      // Keep the search row in view while someone is typing in it.
      const typingInHeader = ref.current?.contains(document.activeElement) && isTextEntry(document.activeElement);
      set(dy > 0 && !typingInHeader ? "compact-hidden" : "compact");
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    const onFocusIn = (e: FocusEvent) => {
      if (isTextEntry(e.target)) root.dataset.typing = "";
    };
    const onFocusOut = () => {
      delete root.dataset.typing;
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("focusin", onFocusIn);
    document.addEventListener("focusout", onFocusOut);
    return () => {
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("focusin", onFocusIn);
      document.removeEventListener("focusout", onFocusOut);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <header ref={ref} className="site-header">
      {children}
    </header>
  );
}

function isActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function DesktopNav() {
  const pathname = usePathname();
  const link = "nav-link inline-flex h-11 items-center px-3 font-display font-semibold uppercase transition-colors duration-fast";
  return (
    <div className="flex h-full items-center justify-between gap-4">
      <ul className="-ml-3 flex items-center">
        {mainNav.map((item) => {
          const active = isActive(pathname, item.href);
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cx(link, "text-[0.9375rem] tracking-[0.08em]", active ? "text-white" : "text-on-dark-muted hover:text-white")}
              >
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
      <ul className="-mr-3 flex items-center">
        {secondaryNav.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              aria-current={isActive(pathname, item.href) ? "page" : undefined}
              className={cx(link, "text-sm tracking-[0.1em] text-on-dark-muted hover:text-white")}
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Phones: brings the tucked-away search row back and puts the cursor in it. */
export function SearchToggle({ inputId, className }: { inputId: string; className?: string }) {
  return (
    <button
      type="button"
      className={cx("header-search-toggle grid size-11 place-items-center rounded-md text-white hover:bg-white/10", className)}
      aria-label="Search parts"
      onClick={() => {
        document.documentElement.dataset.header = "compact";
        document.getElementById(inputId)?.focus({ preventScroll: true });
      }}
    >
      <Search className="size-5" aria-hidden="true" />
    </button>
  );
}

function useCartCount() {
  const hydrated = useHydrated();
  const { totals } = useCart();
  return hydrated ? totals.itemCount : 0;
}

/** Pulses the element when the cart count goes up (not when the stored cart first loads). */
function useCartPulse(count: number, ref: RefObject<Element | null>) {
  const hydrated = useHydrated();
  const previous = useRef<number | null>(null);
  useEffect(() => {
    if (!hydrated) return;
    if (previous.current !== null && count > previous.current) pulse(ref.current);
    previous.current = count;
  }, [count, hydrated, ref]);
}

/** Opens the cart drawer; a plain link to /cart without JavaScript or with a modifier key. */
function openDrawerOnClick(e: React.MouseEvent<HTMLAnchorElement>) {
  if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
  e.preventDefault();
  openCartDrawer();
}

function CountBadge({ count, className }: { count: number; className?: string }) {
  if (count <= 0) return null;
  return (
    <span
      key={count}
      className={cx(
        "absolute grid min-w-5 animate-check-in place-items-center rounded-full bg-brand px-1 font-bold text-white",
        className,
      )}
    >
      {count > 99 ? "99+" : count}
    </span>
  );
}

export function CartButton() {
  const count = useCartCount();
  const iconRef = useRef<HTMLSpanElement>(null);
  useCartPulse(count, iconRef);
  return (
    <Link
      href="/cart"
      onClick={openDrawerOnClick}
      aria-haspopup="dialog"
      className="grid size-11 place-items-center rounded-md text-white transition-colors hover:bg-white/10"
      aria-label={count > 0 ? `Cart, ${count} item${count === 1 ? "" : "s"}` : "Cart, empty"}
    >
      <span ref={iconRef} className="relative grid place-items-center">
        <ShoppingCart className="size-6" aria-hidden="true" />
        <CountBadge count={count} className="-right-2.5 -top-2 text-xs ring-2 ring-graphite" />
      </span>
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
        className="dialog-motion drawer-left m-0 h-dvh max-h-none w-[min(20rem,85vw)] max-w-none bg-graphite p-0 text-on-dark shadow-modal"
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
            {[{ label: "Home", href: "/" }, ...mainNav, ...secondaryNav].map((item) => {
              const active = item.href === "/" ? pathname === "/" : isActive(pathname, item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={close}
                    aria-current={active ? "page" : undefined}
                    className={cx(
                      "flex min-h-12 items-center border-l-4 px-4 font-display text-lg font-semibold uppercase tracking-[0.06em] transition-colors",
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

/** Fixed bottom bar on phones: call, WhatsApp, part finder, cart. Tucks away while scrolling down. */
export function MobileActionBar() {
  const count = useCartCount();
  const cartRef = useRef<HTMLSpanElement>(null);
  useCartPulse(count, cartRef);
  const item =
    "flex min-h-14 flex-1 flex-col items-center justify-center gap-0.5 text-xs font-semibold transition-[background-color,scale] duration-fast active:scale-95 active:bg-white/5";
  return (
    <nav
      aria-label="Quick actions"
      className="mobile-bar fixed inset-x-0 bottom-0 z-(--z-header) flex border-t border-graphite-3 bg-graphite pb-[env(safe-area-inset-bottom)] text-on-dark md:hidden"
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
      <Link href="/cart" onClick={openDrawerOnClick} aria-haspopup="dialog" className={item} aria-label={`Cart, ${count} items`}>
        <span ref={cartRef} className="relative">
          <ShoppingCart className="size-5" aria-hidden="true" />
          <CountBadge count={count} className="-right-3 -top-2 text-[0.6875rem]" />
        </span>
        Cart
      </Link>
    </nav>
  );
}
