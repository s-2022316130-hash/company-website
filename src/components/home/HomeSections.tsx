import Link from "next/link";
import { ArrowRight, Bike, CircleHelp, ExternalLink, Phone, QrCode, ScanSearch, ShieldCheck } from "lucide-react";
import { BrandMark } from "@/components/brand/BrandMark";
import { BrandShowroomCard, ModelCard } from "@/components/catalog/DirectoryCards";
import { ProductGrid } from "@/components/catalog/ProductCard";
import { WhatsAppButton } from "@/components/contact/ContactActions";
import { LogoMark } from "@/components/layout/Logo";
import { PhotoFill } from "@/components/media/Photo";
import { SearchBar } from "@/components/search/SearchBar";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { business, dealerList } from "@/config/business";
import type { Brand, CategoryGroup, MotorcycleModel, ProductView } from "@/lib/types";

/** Homepage hero: full-bleed motorcycle photo under a dark gradient, the shop's name and what it sells. */
export function Hero({
  searchExamples,
  dealers,
  originals,
}: {
  searchExamples: string[];
  /** Dealership names as on the business card, e.g. "Uttara Motors (Bajaj)". */
  dealers: string[];
  /** Brands the shop sells original parts for. */
  originals: string[];
}) {
  return (
    <section className="relative isolate overflow-hidden bg-graphite text-white" aria-labelledby="hero-title">
      <PhotoFill photo="hero" sizes="100vw" priority decorative className="-z-20 animate-hero-in" />
      {/* Phones: text sits at the bottom, so darken from the bottom up. Desktop: darken the left half. */}
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(0deg,rgb(14_17_21)_0%,rgb(14_17_21/0.9)_46%,rgb(14_17_21/0.3)_74%,rgb(14_17_21/0.55)_100%)] lg:bg-[linear-gradient(90deg,rgb(14_17_21/0.97)_0%,rgb(14_17_21/0.88)_36%,rgb(14_17_21/0.35)_64%,rgb(14_17_21/0.1)_100%)]" />
      <div className="absolute inset-0 -z-10 fins opacity-50" />
      <div className="container-page flex min-h-[620px] flex-col justify-end pb-9 pt-40 sm:min-h-[660px] lg:min-h-[640px] lg:justify-center lg:py-20">
        <div className="max-w-2xl animate-fade-up">
          <p className="eyebrow eyebrow-dark flex items-center gap-2">
            <ShieldCheck className="size-4" aria-hidden="true" />
            Authorized dealer · Genuine &amp; original parts
          </p>
          <h1 id="hero-title" className="mt-4">
            <span className="flex items-center gap-3 sm:gap-4">
              <LogoMark className="size-11 shrink-0 sm:size-16" />
              <span className="display block text-[3.3rem] leading-[0.88] text-white sm:text-[5.5rem] lg:text-[6.25rem]">
                {business.name}
              </span>
            </span>
            <span lang="bn" className="mt-2 block text-xl font-semibold text-on-dark sm:mt-3 sm:text-2xl">
              {business.banglaName}
            </span>
            <span className="display mt-4 block text-[1.65rem] text-brand-bright sm:text-[2.6rem]">
              Motorcycle spare parts &amp; genuine products
            </span>
          </h1>
          <p className="mt-4 max-w-xl text-base text-on-dark sm:text-lg">
            Spare parts, maintenance products and accessories, organised by brand, model and part type, from our shop in{" "}
            {business.address.locality}, {business.address.region}.
          </p>
          <SearchBar size="lg" className="mt-6 hidden max-w-xl md:block" />
          <div className="mt-3 hidden flex-wrap items-center gap-2 md:flex">
            <span className="text-sm text-on-dark-muted">Try:</span>
            {searchExamples.map((ex) => (
              <Link key={ex} href={`/search?q=${encodeURIComponent(ex)}`} className="chip chip-dark min-h-9">
                {ex}
              </Link>
            ))}
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/shop" className="btn btn-primary btn-lg">
              Shop parts <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
            <Link href="/part-finder" className="btn btn-outline-dark btn-lg">
              <Bike className="size-5" aria-hidden="true" /> Find parts for your bike
            </Link>
          </div>
          <a
            href={`tel:${business.phones.orders.e164}`}
            className="mt-4 inline-flex min-h-10 items-center gap-2 text-sm font-semibold text-on-dark hover:text-white"
          >
            <Phone className="size-4 text-brand-bright" aria-hidden="true" />
            Or call Nirob Autos: {business.phones.orders.display}
          </a>
        </div>
      </div>
      <div className="border-t border-white/10 bg-black/40 backdrop-blur-sm">
        <div className="container-page scrollbar-none flex items-center gap-x-5 overflow-x-auto py-3 font-display text-sm font-semibold uppercase tracking-[0.14em] text-on-dark-muted">
          <span className="inline-flex shrink-0 items-center gap-1.5 text-brand-bright">
            <ShieldCheck className="size-4" aria-hidden="true" /> Authorized dealer
          </span>
          {dealers.map((d) => (
            <span key={d} className="shrink-0 text-on-dark">
              {d}
            </span>
          ))}
          <span aria-hidden="true" className="h-4 w-px shrink-0 bg-white/20" />
          <span className="shrink-0 text-brand-bright">Original parts</span>
          {originals.map((o) => (
            <span key={o} className="shrink-0">
              {o}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

export interface BrandCardData {
  brand: Brand;
  feature?: MotorcycleModel;
  modelNames: string[];
  modelCount: number;
  productCount: number;
}

/** "Brands we deal in": one card per brand, dealerships first, then the brands it sells original parts for. */
export function BrandShowcase({ cards }: { cards: BrandCardData[] }) {
  return (
    <section aria-labelledby="brands-title" className="reveal">
      <SectionHeader
        id="brands-title"
        eyebrow="Shop by brand"
        title="Brands we deal in"
        description={`Authorized dealer for ${dealerList()}, with genuine parts at company price. Original Yamaha, Suzuki and Honda parts at affordable prices.`}
        action={{ label: "All brands", href: "/brands" }}
      />
      <ul className="scrollbar-none -mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-1 sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 lg:grid-cols-4">
        {cards.map((c) => (
          <li key={c.brand.slug} className="w-72 shrink-0 snap-start sm:w-auto">
            <BrandShowroomCard {...c} />
          </li>
        ))}
        <li className="w-72 shrink-0 snap-start sm:w-auto">
          <Link
            href="/models"
            className="group flex h-full min-h-64 flex-col justify-between rounded-[0.625rem] border-2 border-dashed border-line-strong p-5 transition-colors hover:border-brand hover:bg-surface"
          >
            <span className="display text-3xl text-ink">Know only your model?</span>
            <span className="text-sm text-muted">Search the motorcycle directory by name, from Shine 100 to Gixxer SF 250.</span>
            <span className="inline-flex items-center gap-1 font-display font-semibold uppercase tracking-[0.08em] text-brand">
              Find your bike <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
            </span>
          </Link>
        </li>
      </ul>
    </section>
  );
}

const TVS_GENUINE = "https://bangladesh.tvsmotor.com/en/after-sales/genuine-parts";
const HONDA_GENUINE = "https://www.bdhonda.com/services/genuine-parts";

/**
 * "Original parts. Built for your bike.": the shop's dealerships and original-parts brands, how listings
 * label authenticity, and two checks the manufacturers themselves publish (read 2026-10-03).
 */
export function GenuineParts({
  dealers,
  originals,
}: {
  dealers: { brand: Brand; company: string }[];
  originals: Brand[];
}) {
  return (
    <section className="relative isolate overflow-hidden bg-graphite pt-14 text-on-dark sm:pt-20" aria-labelledby="genuine-title">
      <div className="absolute inset-0 -z-10 fins opacity-40" />
      <div className="container-page grid items-center gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:gap-14">
        <div className="min-w-0">
          <p className="eyebrow eyebrow-dark flex items-center gap-2">
            <span aria-hidden="true" className="h-px w-7 bg-current" /> Genuine &amp; original parts
          </p>
          <h2 id="genuine-title" className="display mt-1.5 text-[2.4rem] text-white sm:text-6xl">
            Original parts. Built for your bike.
          </h2>
          <p className="mt-3 max-w-xl text-on-dark sm:text-lg">
            {business.name} is an authorized dealer of {dealerList()}, selling their genuine parts at company price. We also
            sell original Yamaha, Suzuki and Honda parts at affordable prices.
          </p>

          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            <div>
              <p className="flex items-center gap-1.5 font-display text-sm font-semibold uppercase tracking-[0.14em] text-brand-bright">
                <ShieldCheck className="size-4" aria-hidden="true" /> Authorized dealer
              </p>
              <ul className="mt-2 space-y-1.5">
                {dealers.map(({ brand, company }) => (
                  <li key={brand.slug}>
                    <Link
                      href={`/brands/${brand.slug}`}
                      className="group flex min-h-11 items-center justify-between gap-3 rounded-md border border-graphite-3 bg-white/[0.03] px-3 py-1.5 transition-colors hover:border-brand-bright/60"
                    >
                      <BrandMark slug={brand.slug} name={brand.name} className="text-xl text-white" logoClassName="h-6" />
                      <span className="truncate text-xs text-on-dark-muted">{company === brand.name ? "Dealer" : company}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="font-display text-sm font-semibold uppercase tracking-[0.14em] text-brand-bright">Original parts</p>
              <ul className="mt-2 space-y-1.5">
                {originals.map((brand) => (
                  <li key={brand.slug}>
                    <Link
                      href={`/brands/${brand.slug}`}
                      className="group flex min-h-11 items-center justify-between gap-3 rounded-md border border-graphite-3 bg-white/[0.03] px-3 py-1.5 transition-colors hover:border-brand-bright/60"
                    >
                      <BrandMark slug={brand.slug} name={brand.name} className="text-xl text-white" logoClassName="h-6" />
                      <ArrowRight className="size-4 text-on-dark-muted transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <h3 className="mt-8 font-display text-lg font-semibold uppercase tracking-[0.08em] text-white">How to check a part</h3>
          <ul className="mt-3 space-y-3 text-sm">
            <li className="flex gap-3">
              <CircleHelp className="mt-0.5 size-5 shrink-0 text-brand-bright" aria-hidden="true" />
              <span>
                Each listing says <strong className="text-white">Genuine part</strong>, <strong className="text-white">OEM part</strong> or{" "}
                <strong className="text-white">Aftermarket</strong> once the shop has checked it. <strong className="text-white">Contact store</strong>{" "}
                means it has not been checked yet, so ask before you order.
              </span>
            </li>
            <li className="flex gap-3">
              <QrCode className="mt-0.5 size-5 shrink-0 text-brand-bright" aria-hidden="true" />
              <span>
                TVS genuine parts carry a label with a QR code; scanning it confirms the part is genuine.{" "}
                <a href={TVS_GENUINE} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-0.5 underline hover:text-white">
                  TVS Bangladesh <ExternalLink className="size-3" aria-hidden="true" />
                </a>
              </span>
            </li>
            <li className="flex gap-3">
              <ScanSearch className="mt-0.5 size-5 shrink-0 text-brand-bright" aria-hidden="true" />
              <span>
                Honda part numbers can be checked against the genuine parts list on Bangladesh Honda&apos;s website.{" "}
                <a href={HONDA_GENUINE} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-0.5 underline hover:text-white">
                  Bangladesh Honda <ExternalLink className="size-3" aria-hidden="true" />
                </a>
              </span>
            </li>
          </ul>

          <div className="mt-7 flex flex-wrap gap-3">
            <WhatsAppButton
              size="lg"
              message={`Hello ${business.name}, I am looking for a genuine part for my motorcycle. `}
              label="Ask for a genuine part"
            />
            <Link href="/brands" className="btn btn-outline-dark btn-lg">
              Browse by brand
            </Link>
          </div>
        </div>

        {/* Close-ups of motorcycle components: decorative stock photos, not photos of stock for sale. */}
        <div className="grid grid-cols-2 gap-3" aria-hidden="true">
          <div className="relative row-span-2 min-h-80 overflow-hidden rounded-lg">
            <PhotoFill photo="chainKit" sizes="(min-width: 1024px) 22vw, 50vw" decorative />
          </div>
          <div className="relative aspect-square overflow-hidden rounded-lg">
            <PhotoFill photo="piston" sizes="(min-width: 1024px) 22vw, 50vw" decorative />
          </div>
          <div className="relative aspect-square overflow-hidden rounded-lg">
            <PhotoFill photo="brakeDisc" sizes="(min-width: 1024px) 22vw, 50vw" decorative />
          </div>
        </div>
      </div>
      <div className="chain-rule mt-14 opacity-70 sm:mt-20" aria-hidden="true" />
    </section>
  );
}

/** "Parts for the bikes you ride": riding photo band, then a scrollable rail of model cards. */
export function BikesShowcase({
  models,
  brandName,
  counts,
  categoriesFor,
}: {
  models: MotorcycleModel[];
  brandName: (slug: string) => string;
  counts: Map<string, number>;
  categoriesFor: (modelId: string) => string[];
}) {
  return (
    <section aria-labelledby="bikes-title">
      <div className="relative isolate overflow-hidden bg-graphite text-white">
        <PhotoFill photo="ridingRoad" sizes="100vw" decorative className="-z-20" />
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgb(14_17_21/0.92)_0%,rgb(14_17_21/0.7)_55%,rgb(14_17_21/0.35)_100%)]" />
        <div className="container-page pb-32 pt-14 sm:pb-36 sm:pt-20">
          <p className="eyebrow eyebrow-dark flex items-center gap-2">
            <span aria-hidden="true" className="h-px w-7 bg-current" /> Popular motorcycles
          </p>
          <h2 id="bikes-title" className="display mt-1.5 max-w-2xl text-[2.4rem] text-white sm:text-6xl">
            Parts for the bikes you ride
          </h2>
          <p className="mt-3 max-w-xl text-on-dark">
            From daily commuters to 250cc street bikes. Pick your model to see the parts listed for it.
          </p>
          <Link
            href="/models"
            className="mt-5 inline-flex min-h-10 items-center gap-1 font-display text-[0.9375rem] font-semibold uppercase tracking-[0.08em] text-brand-bright hover:text-white"
          >
            All motorcycles <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
      <div className="container-page -mt-24 sm:-mt-28">
        <ul className="scrollbar-none -mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-2 sm:mx-0 sm:px-0">
          {models.map((m) => (
            <li key={m.id} className="w-60 shrink-0 snap-start sm:w-72">
              <ModelCard
                model={m}
                brandName={brandName(m.brand)}
                productCount={counts.get(m.id) ?? 0}
                categories={categoriesFor(m.id)}
                className="shadow-lg shadow-ink/10"
              />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/**
 * "Your motorcycle. The right parts.": workshop photo break. The photo is atmosphere only; the shop
 * sells parts and does not offer servicing.
 */
export function WorkshopBanner() {
  return (
    <section className="relative isolate overflow-hidden bg-graphite text-white" aria-labelledby="workshop-title">
      <PhotoFill photo="workshop" sizes="100vw" decorative className="-z-20" />
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgb(14_17_21/0.95)_0%,rgb(14_17_21/0.8)_45%,rgb(14_17_21/0.25)_100%)]" />
      <div className="absolute inset-0 -z-10 fins opacity-40" />
      <div className="container-page py-20 sm:py-28">
        <div className="max-w-xl">
          <p className="eyebrow eyebrow-dark flex items-center gap-2">
            <span aria-hidden="true" className="h-px w-7 bg-current" /> Parts advice
          </p>
          <h2 id="workshop-title" className="display mt-1.5 text-[2.6rem] text-white sm:text-6xl">
            Your motorcycle. The right parts.
          </h2>
          <p className="mt-3 text-on-dark sm:text-lg">
            Tell us your bike&apos;s model and year, or send a photo of the old part on WhatsApp. The shop checks the fit
            before you order.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <WhatsAppButton
              size="lg"
              message={`Hello ${business.name}, I need a part for my motorcycle. Model and year: `}
              label="Send your bike details"
            />
            <Link href="/shop" className="btn btn-outline-dark btn-lg">
              Explore spare parts <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

/** Engine oil & maintenance: photo panel with part-type chips beside a short product grid. */
export function OilsFeature({ group, products }: { group?: CategoryGroup; products: ProductView[] }) {
  return (
    <section aria-labelledby="oils-title">
      <SectionHeader
        id="oils-title"
        eyebrow="Engine oil & maintenance"
        title="Oils, fluids and care"
        action={{ label: "All oils & fluids", href: "/engine-oil" }}
      />
      <div className="grid gap-4 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,2fr)]">
        <div className="relative isolate flex min-h-72 flex-col justify-end overflow-hidden rounded-lg bg-graphite p-5 text-white">
          <PhotoFill photo="catOils" sizes="(min-width: 1024px) 30vw, 100vw" decorative className="-z-20" />
          <div className="absolute inset-0 -z-10 bg-gradient-to-t from-graphite via-graphite/60 to-graphite/0" />
          <p className="display text-3xl">Keep it running smooth</p>
          <p className="mt-1.5 text-sm text-on-dark">
            Tell us your bike model and we&apos;ll confirm the right oil grade and quantity.
          </p>
          {group && (
            <ul className="mt-4 flex flex-wrap gap-2">
              {group.subcategories.map((s) => (
                <li key={s.slug}>
                  <Link href={`/categories/${s.slug}`} className="chip chip-dark min-h-9">
                    {s.name}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
        <ProductGrid products={products} columns="three" />
      </div>
    </section>
  );
}
