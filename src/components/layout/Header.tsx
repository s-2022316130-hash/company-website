import { BadgeCheck, Clock, MapPin, MessageCircle, Phone } from "lucide-react";
import { CallButton } from "@/components/contact/ContactActions";
import { SearchBar } from "@/components/search/SearchBar";
import { business, primaryWhatsApp } from "@/config/business";
import { whatsAppUrl } from "@/lib/order";
import { CartButton, DesktopNav, HeaderShell, MobileMenu, SearchToggle } from "./HeaderClient";
import { Logo } from "./Logo";

const PHONE_SEARCH_ID = "header-search-phone";

/**
 * Site header, fixed to the top. Rows: utility bar (tablet and up; tucks away on scroll), main row
 * (logo, search, call, cart), then the phone search row or the desktop nav row (tucks behind the main
 * row while scrolling down, returns on scroll up). Over the homepage hero it starts transparent.
 */
export function Header() {
  return (
    <HeaderShell>
      <div className="site-header__row site-header__utility hidden md:block">
        <div className="container-page flex h-full items-center justify-between gap-4 text-[0.8125rem] text-on-dark-muted">
          <p className="flex min-w-0 items-center gap-4">
            <span className="inline-flex shrink-0 items-center gap-1.5">
              <Clock className="size-3.5 text-brand-bright" aria-hidden="true" />
              Open {business.hours.label.toLowerCase()}
            </span>
            <span className="inline-flex min-w-0 items-center gap-1.5">
              <MapPin className="size-3.5 shrink-0 text-brand-bright" aria-hidden="true" />
              <span className="truncate">{business.address.short}</span>
            </span>
            <span className="hidden items-center gap-1.5 whitespace-nowrap xl:inline-flex">
              <BadgeCheck className="size-3.5 text-brand-bright" aria-hidden="true" />
              Authorized dealer: {business.dealerships.map((d) => d.company).join(" · ")}
            </span>
          </p>
          <p className="flex shrink-0 items-center gap-4">
            <a
              href={whatsAppUrl(primaryWhatsApp.waId)}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden items-center gap-1.5 hover:text-white lg:max-xl:inline-flex 2xl:inline-flex"
            >
              <MessageCircle className="size-3.5 text-[#4ade80]" aria-hidden="true" />
              WhatsApp {primaryWhatsApp.display}
              <span className="sr-only"> (opens WhatsApp)</span>
            </a>
            <a href={`tel:${business.phones.orders.e164}`} className="inline-flex items-center gap-1.5 font-semibold text-white hover:underline">
              <Phone className="size-3.5 text-brand-bright" aria-hidden="true" />
              Orders: {business.phones.orders.display}
            </a>
          </p>
        </div>
      </div>

      <div className="site-header__row site-header__main">
        <div className="container-page flex h-full items-center gap-1 sm:gap-3 lg:gap-5">
          <MobileMenu />
          <Logo inverted />
          <div className="header-search ml-2 hidden max-w-2xl flex-1 md:block">
            <SearchBar />
          </div>
          <div className="ml-auto flex items-center gap-1 sm:gap-2">
            <SearchToggle inputId={PHONE_SEARCH_ID} className="md:hidden" />
            <CallButton size="sm" label="Call to order" className="hidden lg:inline-flex" />
            <CartButton />
          </div>
        </div>
      </div>

      <div className="site-header__row site-header__sub md:hidden">
        <div className="container-page pt-0.5">
          <SearchBar inputId={PHONE_SEARCH_ID} />
        </div>
      </div>

      <nav aria-label="Main" className="site-header__row site-header__sub hidden border-t border-white/[0.06] lg:block">
        <div className="container-page h-full">
          <DesktopNav />
        </div>
      </nav>
    </HeaderShell>
  );
}
