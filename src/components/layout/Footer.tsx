import { Fragment } from "react";
import Link from "next/link";
import { Clock, Mail, MapPin, MessageCircle, Phone, Wallet } from "lucide-react";
import { CallButton, WhatsAppButton } from "@/components/contact/ContactActions";
import { business, dealerList } from "@/config/business";
import { footerInfoLinks, footerShopLinks } from "@/config/navigation";
import { categoryPath, loadCatalog } from "@/lib/catalog/catalog";
import { LogoEmblem } from "./Logo";

function LinkColumn({ title, links }: { title: string; links: { label: string; href: string }[] }) {
  return (
    <div>
      <h2 className="label-tech mb-3 text-brand-bright">{title}</h2>
      <ul className="space-y-0.5">
        {links.map((l) => (
          <li key={l.href}>
            <Link href={l.href} className="link-draw inline-flex min-h-8 items-center text-sm text-on-dark-muted hover:text-white">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Footer: a last call to action, then the shop's details and every route into the catalogue. */
export async function Footer() {
  const { brands, groups } = await loadCatalog();
  return (
    <footer className="relative mt-16 bg-graphite text-on-dark">
      <div className="chain-rule" aria-hidden="true" />
      <div className="fins">
        <div className="container-page">
          <div className="flex flex-wrap items-end justify-between gap-x-10 gap-y-6 border-b border-graphite-3 py-10 sm:py-12">
            <div className="max-w-xl">
              <p className="eyebrow eyebrow-dark flex items-center gap-2">
                <span aria-hidden="true" className="h-px w-7 bg-current" /> Can&apos;t find your part?
              </p>
              <p className="display mt-2 text-section text-white">Send us a photo of the old part.</p>
              <p className="mt-2 text-sm text-on-dark-muted">The shop checks the fit and tells you the price and availability.</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <WhatsAppButton size="lg" message={`Hello ${business.name}, I need this part for my motorcycle: `} label="WhatsApp the shop" />
              <CallButton size="lg" variant="outline-dark" />
            </div>
          </div>

          <div className="grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr_1fr]">
            <div className="space-y-4">
              <Link href="/" aria-label={`${business.name} home`} className="inline-block">
                <LogoEmblem tone="dark" className="h-20 sm:h-24" sizes="(min-width: 640px) 170px, 140px" />
              </Link>
              <p className="max-w-xs text-sm text-on-dark-muted">
                {business.tagline}. {business.trade} since {business.foundedYear}; authorized dealer for {dealerList()}.
              </p>
              <address className="space-y-2.5 text-sm not-italic text-on-dark">
                <p className="flex gap-2.5">
                  <MapPin className="mt-0.5 size-4 shrink-0 text-brand-bright" aria-hidden="true" />
                  <a href={business.directionsUrl} target="_blank" rel="noopener noreferrer" className="link-draw hover:text-white">
                    {business.address.full}
                    <span className="sr-only"> (opens Google Maps)</span>
                  </a>
                </p>
                <p className="flex gap-2.5">
                  <Clock className="mt-0.5 size-4 shrink-0 text-brand-bright" aria-hidden="true" />
                  <span>{business.hours.label}</span>
                </p>
                <p className="flex gap-2.5">
                  <Phone className="mt-0.5 size-4 shrink-0 text-brand-bright" aria-hidden="true" />
                  <span>
                    Orders:{" "}
                    <a href={`tel:${business.phones.orders.e164}`} className="link-draw whitespace-nowrap font-semibold text-white">
                      {business.phones.orders.display}
                    </a>
                    <br />
                    Store:{" "}
                    <a href={`tel:${business.phones.store.e164}`} className="link-draw whitespace-nowrap">
                      {business.phones.store.display}
                    </a>
                    ,{" "}
                    <a href={`tel:${business.phones.store2.e164}`} className="link-draw whitespace-nowrap">
                      {business.phones.store2.display}
                    </a>
                  </span>
                </p>
                <p className="flex gap-2.5">
                  <MessageCircle className="mt-0.5 size-4 shrink-0 text-[#4ade80]" aria-hidden="true" />
                  <span>
                    WhatsApp:{" "}
                    {business.whatsapp.map((w, i) => (
                      <Fragment key={w.waId}>
                        {i > 0 ? ", " : ""}
                        <span className="whitespace-nowrap">{w.display}</span>
                      </Fragment>
                    ))}
                  </span>
                </p>
                <p className="flex gap-2.5">
                  <Wallet className="mt-0.5 size-4 shrink-0 text-brand-bright" aria-hidden="true" />
                  <span>
                    {business.mobileBanking.services.join(" & ")}:{" "}
                    <span className="whitespace-nowrap">{business.mobileBanking.number.display}</span>
                  </span>
                </p>
                <p className="flex gap-2.5">
                  <Mail className="mt-0.5 size-4 shrink-0 text-brand-bright" aria-hidden="true" />
                  <a href={`mailto:${business.email}`} className="link-draw break-all hover:text-white">
                    {business.email}
                  </a>
                </p>
              </address>
            </div>
            <LinkColumn title="Shop" links={footerShopLinks} />
            <LinkColumn title="Brands" links={brands.map((b) => ({ label: `${b.name} parts`, href: `/brands/${b.slug}` }))} />
            <LinkColumn
              title="Categories"
              links={groups.slice(0, 8).map((g) => ({ label: g.name, href: categoryPath(g.slug) }))}
            />
            <LinkColumn title="Information" links={footerInfoLinks} />
          </div>
        </div>
      </div>
      <div className="border-t border-graphite-3">
        <div className="container-page py-5 text-xs text-on-dark-muted">
          <p>
            © {new Date().getFullYear()} {business.name} | <span lang="bn">{business.banglaName}</span>. Authorized dealer
            for {dealerList()}. Brand names are trademarks of their owners and show which bikes a part is listed for.
            Stock photography from Unsplash; manufacturer logos and photos appear only with permission. See{" "}
            <Link href="/credits" className="underline hover:text-white">
              image credits
            </Link>
            .
          </p>
        </div>
      </div>
    </footer>
  );
}
