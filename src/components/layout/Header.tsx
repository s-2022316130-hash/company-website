import { Clock, MapPin, Phone } from "lucide-react";
import { CallButton } from "@/components/contact/ContactActions";
import { SearchBar } from "@/components/search/SearchBar";
import { business } from "@/config/business";
import { CartLink, DesktopNav, MobileMenu } from "./HeaderClient";
import { Logo } from "./Logo";

export function Header() {
  return (
    <header className="sticky top-0 z-40 bg-graphite text-on-dark shadow-[0_1px_0_rgb(255_255_255/0.06)]">
      <div className="hidden border-b border-white/5 bg-black/30 md:block">
        <div className="container-page flex h-9 items-center justify-between gap-4 text-[0.8125rem] text-on-dark-muted">
          <p className="flex items-center gap-4">
            <span className="inline-flex items-center gap-1.5">
              <Clock className="size-3.5 text-brand-bright" aria-hidden="true" />
              Open {business.hours.label.toLowerCase()}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="size-3.5 text-brand-bright" aria-hidden="true" />
              {business.address.full}
            </span>
          </p>
          <a href={`tel:${business.phones.orders.e164}`} className="inline-flex items-center gap-1.5 font-semibold text-white hover:underline">
            <Phone className="size-3.5 text-brand-bright" aria-hidden="true" />
            Orders: {business.phones.orders.display}
          </a>
        </div>
      </div>

      <div className="container-page flex items-center gap-2 py-2.5 sm:gap-4">
        <MobileMenu />
        <Logo inverted />
        <SearchBar className="hidden max-w-2xl flex-1 md:block" />
        <div className="ml-auto flex items-center gap-2">
          <CallButton size="sm" label="Call to order" className="hidden lg:inline-flex" />
          <CartLink />
        </div>
      </div>

      <div className="container-page pb-3 md:hidden">
        <SearchBar />
      </div>

      <nav aria-label="Main" className="hidden border-t border-white/5 lg:block">
        <div className="container-page">
          <DesktopNav />
        </div>
      </nav>
    </header>
  );
}
