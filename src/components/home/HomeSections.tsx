import Link from "next/link";
import { ArrowRight, Bike, Phone } from "lucide-react";
import { ModelCard } from "@/components/catalog/DirectoryCards";
import { ProductGrid } from "@/components/catalog/ProductCard";
import { LogoMark } from "@/components/layout/Logo";
import { PhotoFill } from "@/components/media/Photo";
import { SearchBar } from "@/components/search/SearchBar";
import { SpecLabel } from "@/components/ui/Mechanical";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { business } from "@/config/business";
import type { PhotoKey } from "@/config/photos";
import { categoryPath } from "@/lib/catalog/paths";
import type { CategoryGroup, MotorcycleModel, ProductView } from "@/lib/types";

/** Homepage hero: full-bleed motorcycle photo, dark gradient, product-first copy and search. */
export function Hero({ brandNames, searchExamples }: { brandNames: string[]; searchExamples: string[] }) {
  return (
    <section className="relative isolate overflow-hidden bg-graphite text-white" aria-labelledby="hero-title">
      <PhotoFill photo="hero" sizes="100vw" priority decorative className="-z-20 animate-hero-in" />
      {/* Phones: text sits at the bottom, so darken from the bottom up. Desktop: darken the left half. */}
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(0deg,rgb(14_17_21)_0%,rgb(14_17_21/0.9)_42%,rgb(14_17_21/0.25)_72%,rgb(14_17_21/0.55)_100%)] lg:bg-[linear-gradient(90deg,rgb(14_17_21/0.97)_0%,rgb(14_17_21/0.88)_34%,rgb(14_17_21/0.35)_62%,rgb(14_17_21/0.1)_100%)]" />
      <div className="absolute inset-0 -z-10 fins opacity-50" />
      <div className="container-page flex min-h-[600px] flex-col justify-end pb-9 pt-48 sm:min-h-[640px] lg:min-h-[600px] lg:justify-center lg:py-20">
        <div className="max-w-2xl animate-fade-up">
          <p className="flex items-center gap-3">
            <LogoMark className="size-9" />
            <span className="leading-none">
              <span className="display block text-xl tracking-[0.06em] text-white">{business.name}</span>
              <span lang="bn" className="mt-0.5 block text-sm text-on-dark-muted">
                {business.banglaName}
              </span>
            </span>
          </p>
          <h1 id="hero-title" className="display mt-5 text-[2.9rem] text-white sm:text-7xl lg:text-[5.25rem]">
            Find the Right Parts for Your Motorcycle
          </h1>
          <p className="mt-4 max-w-xl text-base text-on-dark sm:text-lg">
            Spare parts, maintenance products and accessories for the bikes Bangladesh rides, organised by brand, model
            and part type, from our shop in {business.address.locality}.
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
              Shop spare parts <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
            <Link href="/part-finder" className="btn btn-outline-dark btn-lg">
              <Bike className="size-5" aria-hidden="true" /> Find parts by bike
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
        <div className="container-page scrollbar-none flex items-center gap-x-6 gap-y-1 overflow-x-auto py-3 font-display text-sm font-semibold uppercase tracking-[0.16em] text-on-dark-muted">
          <span className="shrink-0 text-brand-bright">Parts for</span>
          {brandNames.map((b) => (
            <span key={b} className="shrink-0">
              {b}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

const dna: { index: string; label: string; photo: PhotoKey; text: string; slug: string }[] = [
  {
    index: "01",
    label: "Engine",
    photo: "engineService",
    text: "Pistons, rings, gaskets and timing parts keep compression and timing where they belong.",
    slug: "engine",
  },
  {
    index: "02",
    label: "Brakes",
    photo: "brakeDisc",
    text: "Pads, shoes and discs wear with every stop. Replace them before they reach metal.",
    slug: "brakes",
  },
  {
    index: "03",
    label: "Chain & drive",
    photo: "chainService",
    text: "A stretched chain wears its sprockets. Chain, sprockets and lube work as a set.",
    slug: "chain-drive",
  },
  {
    index: "04",
    label: "Electrical",
    photo: "sparkPlug",
    text: "Plugs, coils, batteries and regulators keep a bike starting, charging and lit.",
    slug: "electrical",
  },
];

/** Editorial close-ups of the four systems most riders replace parts for. */
export function MechanicalDna() {
  return (
    <section className="bg-graphite py-14 text-on-dark sm:py-20" aria-labelledby="dna-title">
      <div className="container-page">
        <SectionHeader
          id="dna-title"
          tone="dark"
          eyebrow="Mechanical DNA"
          title="Know the systems. Find the part."
          description="Four systems account for most everyday repairs. Start with the one giving you trouble."
        />
        <ul className="scrollbar-none -mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 lg:grid-cols-4">
          {dna.map((d) => (
            <li key={d.slug} className="w-[78%] shrink-0 snap-start sm:w-auto">
              <Link href={categoryPath(d.slug)} className="group card-dark flex h-full flex-col overflow-hidden">
                <div className="relative aspect-[4/5] overflow-hidden">
                  <PhotoFill
                    photo={d.photo}
                    sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 78vw"
                    className="transition-transform duration-700 ease-out group-hover:scale-[1.06]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-graphite-2 via-graphite-2/10 to-transparent" />
                  <SpecLabel index={d.index} label={d.label} className="absolute left-4 top-4 rounded bg-graphite/80 px-2 py-1 text-white" />
                </div>
                <div className="flex flex-1 flex-col gap-3 p-4">
                  <p className="text-sm text-on-dark">{d.text}</p>
                  <span className="mt-auto inline-flex items-center gap-1 font-display text-sm font-semibold uppercase tracking-[0.1em] text-brand-bright">
                    Shop {d.label.toLowerCase()} parts <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/** "Built Around the Bikes You Ride": riding photo band, then a scrollable rail of model cards. */
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
            <span aria-hidden="true" className="h-px w-7 bg-current" /> Shop by motorcycle
          </p>
          <h2 id="bikes-title" className="display mt-1.5 max-w-2xl text-[2.4rem] text-white sm:text-6xl">
            Built around the bikes you ride
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
            <li key={m.id} className="w-64 shrink-0 snap-start sm:w-72">
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

/** Full-width workshop photo break with a single call to action. */
export function WorkshopBanner() {
  return (
    <section className="relative isolate overflow-hidden bg-graphite text-white" aria-labelledby="workshop-title">
      <PhotoFill photo="workshop" sizes="100vw" decorative className="-z-20" />
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgb(14_17_21/0.95)_0%,rgb(14_17_21/0.8)_45%,rgb(14_17_21/0.25)_100%)]" />
      <div className="absolute inset-0 -z-10 fins opacity-40" />
      <div className="container-page py-20 sm:py-28">
        <div className="max-w-xl">
          <p className="eyebrow eyebrow-dark flex items-center gap-2">
            <span aria-hidden="true" className="h-px w-7 bg-current" /> From the workshop
          </p>
          <h2 id="workshop-title" className="display mt-1.5 text-[2.6rem] text-white sm:text-6xl">
            Everything your motorcycle needs
          </h2>
          <p className="mt-3 text-on-dark sm:text-lg">
            From routine maintenance to replacement parts, find the products you need for your ride, then confirm fit
            with the shop before you buy.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/shop" className="btn btn-primary btn-lg">
              Explore spare parts <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
            <Link href="/categories" className="btn btn-outline-dark btn-lg">
              Browse categories
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
