import Link from "next/link";
import type { CSSProperties } from "react";
import { ArrowRight, Bike, CircleHelp, ExternalLink, Phone, QrCode, ScanSearch, ShieldCheck } from "lucide-react";
import { BrandMark } from "@/components/brand/BrandMark";
import { BrandShowroomCard, CategoryImageCard, ModelCard, PopularPartTile } from "@/components/catalog/DirectoryCards";
import { ProductCard } from "@/components/catalog/ProductCard";
import { WhatsAppButton } from "@/components/contact/ContactActions";
import { LogoMark } from "@/components/layout/Logo";
import { PhotoFill } from "@/components/media/Photo";
import { Reveal } from "@/components/motion/Reveal";
import { ScrollRail } from "@/components/motion/ScrollRail";
import { SearchBar } from "@/components/search/SearchBar";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { business, dealerList } from "@/config/business";
import type { PhotoKey } from "@/config/images";
import type { PopularPart } from "@/lib/catalog/catalog";
import { categoryPath } from "@/lib/catalog/paths";
import { pluralize } from "@/lib/format";
import type { Brand, CategoryGroup, MotorcycleModel, ProductView } from "@/lib/types";

const delay = (ms: number) => ({ "--delay": `${ms}ms` }) as CSSProperties;
const step = (i: number) => ({ "--reveal-i": i }) as CSSProperties;

/**
 * Homepage hero, the site's signature. The photo settles from 1.05 under a lifting veil and trails the
 * page by 18px on scroll (tablet and up); the label, headline lines, copy, search and buttons follow
 * 80–100ms apart. Sits under the transparent header. Everything is usable from the first frame.
 */
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
    <section className="hero text-white" aria-labelledby="hero-title">
      <div className="hero-media parallax-hero">
        <PhotoFill photo="hero" sizes="100vw" priority decorative />
      </div>
      {/* Phones: the copy sits low, so darken from the bottom. Desktop: darken the left half. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-2 bg-[linear-gradient(0deg,rgb(14_17_21)_0%,rgb(14_17_21/0.94)_40%,rgb(14_17_21/0.25)_66%,rgb(14_17_21/0)_82%)] lg:bg-[linear-gradient(90deg,rgb(14_17_21/0.96)_0%,rgb(14_17_21/0.84)_36%,rgb(14_17_21/0.28)_64%,rgb(14_17_21/0.12)_100%)]"
      />
      {/* Keeps the transparent header readable over the brightest part of the photo. */}
      <div aria-hidden="true" className="absolute inset-x-0 top-0 -z-2 h-40 bg-gradient-to-b from-graphite/70 to-transparent lg:h-56 lg:from-graphite/85" />
      <div aria-hidden="true" className="fins absolute inset-0 -z-2 opacity-40" />
      <div aria-hidden="true" className="hero-veil" />

      <div className="container-page flex min-h-[calc(100svh-var(--header-offset)-7rem)] flex-col justify-end pb-8 pt-20 md:min-h-[calc(min(100svh,54rem)-var(--header-offset)-3.5rem)] lg:justify-center lg:py-10">
        <div className="max-w-2xl">
          <h1 id="hero-title">
            <span className="hero-rise label-tech flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[0.8125rem] text-brand-bright" style={delay(100)}>
              <LogoMark className="size-7 shrink-0" />
              <span>{business.name}</span>
              <span aria-hidden="true" className="h-3.5 w-px bg-white/30" />
              <span lang="bn" className="font-sans text-sm font-semibold normal-case tracking-normal text-on-dark">
                {business.banglaName}
              </span>
            </span>
            <span className="mt-3 block font-display text-hero font-bold uppercase sm:mt-4">
              <span className="hero-line">
                <span style={delay(200)}>Motorcycle parts.</span>
              </span>
              <span className="hero-line text-brand-bright">
                <span style={delay(280)}>Built around</span>
              </span>
              <span className="hero-line text-brand-bright">
                <span style={delay(360)}>your ride.</span>
              </span>
            </span>
          </h1>
          <p className="hero-rise mt-4 max-w-xl text-base text-on-dark sm:text-lg" style={delay(440)}>
            Genuine Bajaj, TVS, Runner and Hero parts at company price, plus original Yamaha, Suzuki and Honda parts. Find
            yours by bike or part name, then order by WhatsApp or phone.
          </p>
          <div className="hero-rise mt-5 hidden md:block" style={delay(520)}>
            <SearchBar size="lg" className="max-w-xl" />
            <div className="mt-2.5 flex flex-wrap items-center gap-2">
              <span className="text-sm text-on-dark-muted">Try:</span>
              {searchExamples.map((ex) => (
                <Link key={ex} href={`/search?q=${encodeURIComponent(ex)}`} className="chip chip-dark min-h-9">
                  {ex}
                </Link>
              ))}
            </div>
          </div>
          <div className="hero-rise mt-5 grid grid-cols-2 gap-2.5 sm:flex sm:flex-wrap sm:gap-3" style={delay(600)}>
            <Link href="/shop" className="group btn btn-primary btn-lg max-sm:px-3">
              Shop parts
              <ArrowRight className="size-4 transition-transform duration-small ease-ui group-hover:translate-x-1" aria-hidden="true" />
            </Link>
            <Link href="/part-finder" className="btn btn-outline-dark btn-lg max-sm:px-3">
              <Bike className="size-5" aria-hidden="true" /> Find your bike
            </Link>
          </div>
          <a
            href={`tel:${business.phones.orders.e164}`}
            className="hero-rise mt-3 inline-flex min-h-10 items-center gap-2 text-sm font-semibold text-on-dark transition-colors hover:text-white lg:hidden"
            style={delay(680)}
          >
            <Phone className="size-4 text-brand-bright" aria-hidden="true" />
            Or call {business.name}: {business.phones.orders.display}
          </a>
        </div>
      </div>

      <div className="hero-rise border-t border-white/10 bg-black/45 md:backdrop-blur-sm" style={delay(740)}>
        <div className="container-page scrollbar-none flex items-center gap-x-5 overflow-x-auto py-3.5 font-display text-sm font-semibold uppercase tracking-[0.14em] text-on-dark-muted">
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
    <Reveal as="section" aria-labelledby="brands-title">
      <SectionHeader
        id="brands-title"
        eyebrow="Shop by brand"
        title="Brands we deal in"
        description={`Authorized dealer for ${dealerList()}, with genuine parts at company price. Original Yamaha, Suzuki and Honda parts at affordable prices.`}
        action={{ label: "All brands", href: "/brands" }}
      />
      <ScrollRail label="Motorcycle brands" itemClassName="w-[17.5rem] sm:w-auto" gridFrom="sm" gridCols="sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => (
          <BrandShowroomCard key={c.brand.slug} {...c} />
        ))}
        <Link
          href="/models"
          className="group flex h-full min-h-64 w-full flex-col justify-between rounded-lg border-2 border-dashed border-line-strong p-5 transition-colors duration-standard ease-ui hover:border-brand hover:bg-surface"
        >
          <span className="display text-3xl text-ink">Know only your model?</span>
          <span className="text-sm text-muted">Search the motorcycle directory by name, from Shine 100 to Gixxer SF 250.</span>
          <span className="inline-flex items-center gap-1 font-display font-semibold uppercase tracking-[0.08em] text-brand">
            Find your bike <ArrowRight className="size-4 transition-transform duration-small ease-ui group-hover:translate-x-1" aria-hidden="true" />
          </span>
        </Link>
      </ScrollRail>
    </Reveal>
  );
}

/** "Shop by category": photo cards, seven across on desktop and a swipe rail on phones, then the parts riders replace most. */
export function CategoryShowcase({
  groups,
  counts,
  popular,
}: {
  groups: CategoryGroup[];
  counts: Map<string, number>;
  popular: PopularPart[];
}) {
  return (
    <Reveal as="section" aria-labelledby="categories-title">
      <SectionHeader
        id="categories-title"
        eyebrow="Shop by category"
        title="Browse by part type"
        action={{ label: "All categories", href: "/categories" }}
      />
      <ScrollRail label="Part categories" itemClassName="w-[40%] sm:w-auto" gridFrom="sm" gridCols="sm:grid-cols-4 lg:grid-cols-7">
        {groups.map((g) => (
          <CategoryImageCard
            key={g.slug}
            group={g}
            count={counts.get(g.slug) ?? 0}
            compact
            sizes="(min-width: 1024px) 14vw, (min-width: 640px) 25vw, 40vw"
          />
        ))}
      </ScrollRail>

      {popular.length > 0 && (
        <div className="mt-8 sm:mt-10">
          <h3 className="reveal-item label-tech mb-3 flex items-center gap-2 text-muted" style={step(3)}>
            <span aria-hidden="true" className="h-px w-7 bg-current" /> Frequently replaced
          </h3>
          <ScrollRail label="Frequently replaced parts" itemClassName="w-[15rem] sm:w-auto" gridFrom="sm" gridCols="sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
            {popular.map((p) => (
              <PopularPartTile key={p.slug} part={p} />
            ))}
          </ScrollRail>
        </div>
      )}
    </Reveal>
  );
}

/** A rail of product cards with a section header: featured parts, accessories. */
export function ProductRail({
  id,
  eyebrow,
  title,
  description,
  action,
  products,
}: {
  id: string;
  eyebrow: string;
  title: string;
  description?: string;
  action?: { label: string; href: string };
  products: ProductView[];
}) {
  if (products.length === 0) return null;
  return (
    <Reveal as="section" aria-labelledby={id}>
      <SectionHeader id={id} eyebrow={eyebrow} title={title} description={description} action={action} />
      <ScrollRail label={title} itemClassName="w-[70%] sm:w-[44%] md:w-[31%] lg:w-[22.6%]">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </ScrollRail>
    </Reveal>
  );
}

/** "Parts for the bikes you ride": riding photo band, then a rail of model cards that overlaps it. */
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
    <Reveal as="section" aria-labelledby="bikes-title">
      <div className="relative isolate overflow-hidden bg-graphite text-white">
        <div className="absolute inset-0 -z-20 overflow-hidden">
          <div className="drift absolute -inset-y-6 inset-x-0">
            <PhotoFill photo="ridingRoad" sizes="100vw" decorative />
          </div>
        </div>
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgb(14_17_21/0.92)_0%,rgb(14_17_21/0.7)_55%,rgb(14_17_21/0.35)_100%)]" />
        <div className="container-page pb-32 pt-14 sm:pb-36 sm:pt-20">
          <p className="reveal-item eyebrow eyebrow-dark flex items-center gap-2" style={step(0)}>
            <span aria-hidden="true" className="h-px w-7 bg-current" /> Popular motorcycles
          </p>
          <h2 id="bikes-title" className="reveal-item display mt-2 max-w-2xl text-feature text-white" style={step(1)}>
            Parts for the bikes you ride
          </h2>
          <p className="reveal-item mt-3 max-w-xl text-on-dark" style={step(2)}>
            From daily commuters to 250cc street bikes. Pick your model to see the parts listed for it.
          </p>
          <Link
            href="/models"
            className="reveal-item group mt-5 inline-flex min-h-10 items-center gap-1.5 font-display text-[0.9375rem] font-semibold uppercase tracking-[0.08em] text-brand-bright transition-colors hover:text-white"
            style={step(2)}
          >
            All motorcycles <ArrowRight className="size-4 transition-transform duration-small ease-ui group-hover:translate-x-1" aria-hidden="true" />
          </Link>
        </div>
      </div>
      <div className="container-page -mt-24 sm:-mt-28">
        <ScrollRail label="Popular motorcycles" itemClassName="w-60 sm:w-72">
          {models.map((m) => (
            <ModelCard
              key={m.id}
              model={m}
              brandName={brandName(m.brand)}
              productCount={counts.get(m.id) ?? 0}
              categories={categoriesFor(m.id)}
              className="shadow-raised"
            />
          ))}
        </ScrollRail>
      </div>
    </Reveal>
  );
}

export interface SystemPanelData {
  group: CategoryGroup;
  /** Close-up shown on the panel; different from the category card photo. */
  photo: PhotoKey;
  count: number;
}

/**
 * "Inside the machine": engine, drive chain, brakes and electrics as four tall editorial panels.
 * A magazine-style break from the card grids; each panel leads to its category.
 */
export function MechanicalSystems({ systems }: { systems: SystemPanelData[] }) {
  return (
    <Reveal as="section" aria-labelledby="systems-title">
      <div className="tech-divider mb-10 sm:mb-14" aria-hidden="true" />
      <SectionHeader
        id="systems-title"
        eyebrow="By system"
        title="Inside the machine"
        description="Engine, drive chain, brakes and electrics. Start from the system, then find the part."
      />
      <ScrollRail label="Motorcycle systems" itemClassName="w-[78%] sm:w-[46%] lg:w-auto" gridFrom="lg" gridCols="lg:grid-cols-4">
        {systems.map(({ group, photo, count }, i) => (
          <Link key={group.slug} href={categoryPath(group.slug)} className="group flex w-full flex-col">
            <span className="relative block aspect-[3/4] overflow-hidden rounded-lg bg-graphite">
              <span className="reveal-media absolute inset-0 block">
                <PhotoFill
                  photo={photo}
                  sizes="(min-width: 1024px) 22vw, (min-width: 640px) 46vw, 78vw"
                  decorative
                  className="transition-[scale] duration-emphasis ease-card group-hover:scale-[1.05]"
                />
              </span>
              <span className="absolute inset-0 bg-gradient-to-t from-graphite/90 via-graphite/10 to-transparent" />
              <span className="display absolute left-4 top-3 text-6xl text-transparent [-webkit-text-stroke:1px_rgb(255_255_255/0.55)]">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="absolute inset-x-4 bottom-4 text-white transition-[translate] duration-standard ease-card group-hover:-translate-y-1.5">
                <span className="label-tech block text-brand-bright">{group.shortLabel}</span>
                <span className="display mt-1 block text-3xl leading-none">{group.name}</span>
              </span>
            </span>
            <span className="mt-3 flex items-center justify-between gap-3 border-b border-line pb-3 text-sm">
              <span className="text-muted">{count > 0 ? `${pluralize(count, "part")} listed` : "Ask in store"}</span>
              <span className="inline-flex items-center gap-1 font-semibold text-brand">
                Shop {group.name.split(/[\s&]+/)[0].toLowerCase()}
                <ArrowRight className="size-4 transition-transform duration-small ease-ui group-hover:translate-x-1" aria-hidden="true" />
              </span>
            </span>
          </Link>
        ))}
      </ScrollRail>
    </Reveal>
  );
}

const TVS_GENUINE = "https://bangladesh.tvsmotor.com/en/after-sales/genuine-parts";
const HONDA_GENUINE = "https://www.bdhonda.com/services/genuine-parts";

/**
 * Genuine parts: dark editorial band over an engine close-up. The shop's dealerships and original-parts
 * brands, how listings label authenticity, and two checks the manufacturers publish (read 2026-10-03).
 */
export function GenuineParts({
  dealers,
  originals,
}: {
  dealers: { brand: Brand; company: string }[];
  originals: Brand[];
}) {
  const brandLink =
    "group flex min-h-12 items-center justify-between gap-3 rounded-md border border-graphite-3 bg-white/[0.03] px-3 py-1.5 transition-colors duration-small hover:border-brand-bright/60 hover:bg-white/[0.06]";
  return (
    <section className="relative isolate overflow-hidden bg-graphite text-on-dark" aria-labelledby="genuine-title">
      <Reveal className="absolute inset-0 -z-20 overflow-hidden" aria-hidden="true">
        <div className="reveal-media absolute inset-0">
          <div className="drift absolute -inset-y-6 inset-x-0">
            <PhotoFill photo="engineService" sizes="100vw" decorative className="opacity-40" position="50% 40%" />
          </div>
        </div>
      </Reveal>
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(100deg,rgb(14_17_21/0.97)_0%,rgb(14_17_21/0.9)_45%,rgb(14_17_21/0.72)_100%)]" />
      <div className="absolute inset-0 -z-10 fins opacity-30" />

      <Reveal className="container-page section-y grid gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:gap-16">
        <div className="min-w-0">
          <p className="reveal-item eyebrow eyebrow-dark flex items-center gap-2" style={step(0)}>
            <span aria-hidden="true" className="h-px w-7 bg-current" /> Genuine &amp; original parts
          </p>
          <h2 id="genuine-title" className="reveal-item display mt-2 text-feature text-white" style={step(1)}>
            Genuine parts at company price.
          </h2>
          <p className="reveal-item mt-4 max-w-xl text-on-dark sm:text-lg" style={step(2)}>
            {business.name} is an authorized dealer of {dealerList()}, selling their genuine parts at company price. We also
            sell original Yamaha, Suzuki and Honda parts at affordable prices.
          </p>

          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            <div>
              <p className="reveal-item label-tech flex items-center gap-1.5 text-brand-bright" style={step(3)}>
                <ShieldCheck className="size-4" aria-hidden="true" /> Authorized dealer
              </p>
              <ul className="reveal-list mt-2.5 space-y-1.5" style={{ "--reveal-base": 4 } as CSSProperties}>
                {dealers.map(({ brand, company }) => (
                  <li key={brand.slug}>
                    <Link href={`/brands/${brand.slug}`} className={brandLink}>
                      <BrandMark slug={brand.slug} name={brand.name} className="text-xl text-white" logoClassName="h-6" />
                      <span className="truncate text-xs text-on-dark-muted">{company === brand.name ? "Dealer" : company}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="reveal-item label-tech text-brand-bright" style={step(3)}>
                Original parts
              </p>
              <ul className="reveal-list mt-2.5 space-y-1.5" style={{ "--reveal-base": 4 } as CSSProperties}>
                {originals.map((brand) => (
                  <li key={brand.slug}>
                    <Link href={`/brands/${brand.slug}`} className={brandLink}>
                      <BrandMark slug={brand.slug} name={brand.name} className="text-xl text-white" logoClassName="h-6" />
                      <ArrowRight className="size-4 text-on-dark-muted transition-transform duration-small ease-ui group-hover:translate-x-1" aria-hidden="true" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="reveal-item self-end" style={step(5)}>
          <div className="card-dark bg-graphite-2/80 p-5 sm:p-6 md:backdrop-blur-sm">
            <h3 className="font-display text-lg font-semibold uppercase tracking-[0.08em] text-white">How to check a part</h3>
            <ul className="mt-4 space-y-4 text-sm">
              <li className="flex gap-3">
                <CircleHelp className="mt-0.5 size-5 shrink-0 text-brand-bright" aria-hidden="true" />
                <span>
                  Each listing says <strong className="text-white">Genuine part</strong>, <strong className="text-white">OEM part</strong>{" "}
                  or <strong className="text-white">Aftermarket</strong> once the shop has checked it.{" "}
                  <strong className="text-white">Contact store</strong> means it has not been checked yet, so ask before you order.
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
            <div className="mt-6 flex flex-wrap gap-3">
              <WhatsAppButton message={`Hello ${business.name}, I am looking for a genuine part for my motorcycle. `} label="Ask for a genuine part" />
              <Link href="/brands" className="btn btn-outline-dark">
                Browse by brand
              </Link>
            </div>
          </div>
        </div>
      </Reveal>
      <div className="chain-rule opacity-70" aria-hidden="true" />
    </section>
  );
}

/**
 * Full-width visual break: workshop photo, one line and two actions. The photo is atmosphere only;
 * the shop sells parts and does not offer servicing.
 */
export function VisualBreak() {
  return (
    <section className="relative isolate overflow-hidden bg-graphite text-white" aria-labelledby="break-title">
      <div className="absolute inset-0 -z-20 overflow-hidden">
        <div className="drift absolute -inset-y-6 inset-x-0">
          <PhotoFill photo="workshop" sizes="100vw" decorative />
        </div>
      </div>
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgb(14_17_21/0.94)_0%,rgb(14_17_21/0.72)_48%,rgb(14_17_21/0.2)_100%)]" />
      <Reveal className="container-page py-24 sm:py-32 lg:py-40">
        <p className="reveal-item eyebrow eyebrow-dark flex items-center gap-2" style={step(0)}>
          <span aria-hidden="true" className="h-px w-7 bg-current" /> Your motorcycle · The right parts
        </p>
        <h2 id="break-title" className="reveal-item display mt-3 max-w-3xl text-feature text-white" style={step(1)}>
          Everything your motorcycle needs.
        </h2>
        <p className="reveal-item mt-4 max-w-xl text-on-dark sm:text-lg" style={step(2)}>
          Tell us your bike&apos;s model and year, or send a photo of the old part on WhatsApp. The shop checks the fit before
          you order.
        </p>
        <div className="reveal-item mt-7 flex flex-wrap gap-3" style={step(3)}>
          <Link href="/shop" className="group btn btn-primary btn-lg">
            Explore parts
            <ArrowRight className="size-4 transition-transform duration-small ease-ui group-hover:translate-x-1" aria-hidden="true" />
          </Link>
          <WhatsAppButton size="lg" message={`Hello ${business.name}, I need a part for my motorcycle. Model and year: `} label="Send your bike details" />
        </div>
      </Reveal>
    </section>
  );
}

/** Engine oil & maintenance: a photo panel with part-type chips beside a rail of products. */
export function OilsFeature({ group, products }: { group?: CategoryGroup; products: ProductView[] }) {
  return (
    <Reveal as="section" aria-labelledby="oils-title">
      <SectionHeader
        id="oils-title"
        eyebrow="Engine oil & maintenance"
        title="Oils, fluids and care"
        action={{ label: "All oils & fluids", href: "/engine-oil" }}
      />
      <div className="grid gap-4 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,2fr)] lg:gap-6">
        <div className="reveal-item relative isolate flex min-h-72 flex-col justify-end overflow-hidden rounded-lg bg-graphite p-5 text-white" style={step(2)}>
          <div className="reveal-media absolute inset-0 -z-20">
            <PhotoFill photo="catOils" sizes="(min-width: 1024px) 30vw, 100vw" decorative />
          </div>
          <div className="absolute inset-0 -z-10 bg-gradient-to-t from-graphite via-graphite/60 to-graphite/0" />
          <p className="display text-3xl">Keep it running smooth</p>
          <p className="mt-1.5 text-sm text-on-dark">Tell us your bike model and we&apos;ll confirm the right oil grade and quantity.</p>
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
        <div className="min-w-0">
          <ScrollRail label="Oils and fluids" itemClassName="w-[70%] sm:w-[44%] md:w-[31%] lg:w-[31.5%]">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </ScrollRail>
        </div>
      </div>
    </Reveal>
  );
}

const orderSteps = [
  { title: "Find the part", text: "Search by part name, bike model or part number, or let the part finder narrow it down." },
  { title: "Add it to your cart", text: "Collect everything you need. The shop confirms prices and availability for you." },
  { title: "Send your request", text: "The order goes to us on WhatsApp with your list already written, or read it out on a call." },
  { title: "Pick up or courier", text: `Collect from the shop in ${business.address.locality}, or we send it by courier anywhere in Bangladesh.` },
];

/** "How ordering works": the real ordering steps, numbered like a workshop manual. */
export function OrderingSteps() {
  return (
    <Reveal as="section" aria-labelledby="ordering-title">
      <div className="tech-divider mb-10 sm:mb-14" aria-hidden="true" />
      <SectionHeader id="ordering-title" eyebrow="How ordering works" title="Order in four steps" />
      <ol className="reveal-list grid gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
        {orderSteps.map((s, i) => (
          <li key={s.title} className="relative border-t-2 border-ink pt-4">
            <span className="label-tech text-brand">Step {String(i + 1).padStart(2, "0")}</span>
            <h3 className="display mt-1.5 text-2xl text-ink">{s.title}</h3>
            <p className="mt-1.5 text-sm text-muted">{s.text}</p>
          </li>
        ))}
      </ol>
    </Reveal>
  );
}
