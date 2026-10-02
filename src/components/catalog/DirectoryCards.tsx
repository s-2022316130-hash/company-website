import Link from "next/link";
import { ArrowRight, ChevronRight } from "lucide-react";
import { BikeVisual } from "@/components/bikes/BikeVisual";
import { BrandMark } from "@/components/brand/BrandMark";
import { PhotoFill } from "@/components/media/Photo";
import { CategoryIcon } from "@/components/ui/CategoryIcon";
import { GearRing } from "@/components/ui/Mechanical";
import { BrandRelationBadge } from "./Badges";
import type { PopularPart } from "@/lib/catalog/catalog";
import { categoryPath } from "@/lib/catalog/paths";
import { cx } from "@/lib/cx";
import { pluralize } from "@/lib/format";
import { motorcycleImage } from "@/lib/images";
import type { BikeClass, Brand, CategoryGroup, ModelStatus, MotorcycleModel } from "@/lib/types";

/** One-word category name for compact lists, e.g. "Brake Parts" → "Brake". */
export function categoryShortName(group: CategoryGroup): string {
  if (group.slug === "oils-fluids") return "Oils";
  return group.name.split(/[\s,/&]+/)[0];
}

const classNames: Record<BikeClass, string> = {
  commuter: "Commuter",
  street: "Street",
  sport: "Sport",
  cruiser: "Cruiser",
  scooter: "Scooter",
  offroad: "Dual-sport",
};

export function bikeClassName(c: BikeClass): string {
  return classNames[c];
}

const statusBadge: Partial<Record<ModelStatus, string>> = {
  "bd-earlier": "Earlier BD model",
  "official-other": "Outside BD line-up",
};

/** Photo-backed category card: the image does the talking, text sits on a dark gradient. */
export function CategoryImageCard({
  group,
  count,
  href,
  className,
  sizes = "(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw",
}: {
  group: CategoryGroup;
  count: number;
  /** Defaults to the category page; brand and model pages link to their own filtered list. */
  href?: string;
  className?: string;
  sizes?: string;
}) {
  return (
    <Link
      href={href ?? categoryPath(group.slug)}
      className={cx(
        "group relative isolate block aspect-[4/5] overflow-hidden rounded-lg bg-graphite text-white sm:aspect-[4/3]",
        className,
      )}
    >
      {group.image ? (
        <PhotoFill
          photo={group.image}
          sizes={sizes}
          decorative
          className="transition-transform duration-700 ease-out group-hover:scale-[1.07]"
        />
      ) : (
        <div className="blueprint absolute inset-0" />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-graphite via-graphite/55 to-graphite/0 transition-opacity duration-500 group-hover:opacity-90" />
      <span className="absolute left-3 top-3 grid size-9 place-items-center rounded-md bg-graphite/70 text-brand-bright ring-1 ring-white/15 backdrop-blur-sm">
        <CategoryIcon name={group.icon} className="size-5" />
      </span>
      <span className="absolute right-3 top-3 rounded bg-graphite/70 px-1.5 py-0.5 text-xs font-medium text-on-dark ring-1 ring-white/15 backdrop-blur-sm">
        {count > 0 ? pluralize(count, "part") : "Ask in store"}
      </span>
      <span className="absolute inset-x-3 bottom-3 transition-transform duration-500 ease-out group-hover:-translate-y-1">
        <span className="display block text-xl leading-none sm:text-2xl">{group.name}</span>
        <span className="mt-1.5 block text-xs font-medium text-on-dark-muted sm:text-sm">{group.shortLabel}</span>
      </span>
    </Link>
  );
}

/**
 * Dark brand card for "Brands we deal in": the brand's feature model (official photo when supplied,
 * otherwise its drawing), the shop's relationship with the brand, and a few model names.
 */
export function BrandShowroomCard({
  brand,
  feature,
  modelNames,
  modelCount,
  productCount,
}: {
  brand: Brand;
  /** Model whose image stands for the brand. */
  feature?: MotorcycleModel;
  modelNames: string[];
  modelCount: number;
  productCount: number;
}) {
  return (
    <Link
      href={`/brands/${brand.slug}`}
      className="group card-dark relative flex h-full flex-col overflow-hidden transition-colors hover:border-brand-bright/60"
    >
      <div className="relative aspect-[16/9] overflow-hidden">
        <BikeVisual
          bikeClass={feature?.class ?? "street"}
          image={feature ? motorcycleImage(feature, brand.name) : undefined}
          name={feature ? `${brand.name} ${feature.name}` : brand.name}
          annotate={false}
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 18rem"
          className="absolute inset-0"
        />
        <span
          aria-hidden="true"
          className="display pointer-events-none absolute -left-1 top-1 select-none text-[4.5rem] leading-none text-white/[0.06]"
        >
          {brand.name}
        </span>
        <BrandRelationBadge brandSlug={brand.slug} className="absolute right-3 top-3" />
      </div>
      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="flex items-baseline justify-between gap-2">
          <h3 className="text-white">
            <BrandMark slug={brand.slug} name={brand.name} className="text-3xl" logoClassName="h-8" />
          </h3>
          <span className="text-xs text-on-dark-muted">{pluralize(modelCount, "model")}</span>
        </div>
        {modelNames.length > 0 && (
          <ul className="flex flex-wrap gap-1.5" aria-label={`${brand.name} models`}>
            {modelNames.map((n) => (
              <li key={n} className="rounded border border-graphite-3 bg-white/[0.03] px-2 py-0.5 text-xs text-on-dark">
                {n}
              </li>
            ))}
          </ul>
        )}
        <span className="mt-auto flex items-center justify-between gap-2 border-t border-graphite-3 pt-3 text-sm">
          <span className="text-on-dark-muted">{productCount > 0 ? `${pluralize(productCount, "part")} listed` : "Ask us for parts"}</span>
          <span className="inline-flex items-center gap-1 font-semibold text-brand-bright">
            Explore parts <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
          </span>
        </span>
      </div>
    </Link>
  );
}

/**
 * Motorcycle model card: official photo (when supplied) or drawing, name, class and the part types
 * listed for it. Compact enough for two columns on a phone.
 */
export function ModelCard({
  model,
  brandName,
  productCount,
  categories = [],
  href,
  cta = "View compatible parts",
  ctaShort,
  className,
}: {
  model: MotorcycleModel;
  brandName: string;
  productCount: number;
  /** Short names of part categories with listings for this model. */
  categories?: string[];
  /** Defaults to the model page; the part finder links to its next step instead. */
  href?: string;
  cta?: string;
  /** Shorter call to action for narrow cards on phones. */
  ctaShort?: string;
  className?: string;
}) {
  const badge = statusBadge[model.status];
  const short = ctaShort ?? (cta === "View compatible parts" ? "View parts" : cta);
  const summary =
    productCount > 0
      ? [pluralize(productCount, "part"), categories.slice(0, 3).join(" • ")].filter(Boolean).join(" · ")
      : "Parts available on request";
  return (
    <Link
      href={href ?? `/models/${model.slug}`}
      className={cx(
        "group card flex h-full flex-col overflow-hidden transition-[box-shadow,transform] duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-ink/10",
        className,
      )}
    >
      <div className="relative">
        <BikeVisual
          bikeClass={model.class}
          image={motorcycleImage(model, brandName)}
          name={`${brandName} ${model.name}`}
          sizes="(min-width: 1024px) 22vw, (min-width: 768px) 30vw, 48vw"
          className="aspect-[16/10]"
        />
        {badge && (
          <span className="absolute left-2 top-2 rounded bg-graphite/85 px-1.5 py-0.5 text-[0.75rem] font-medium text-on-dark ring-1 ring-white/15">
            {badge}
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-1 border-t-2 border-brand/80 p-3 sm:p-3.5">
        <p className="truncate font-display text-xs font-semibold uppercase tracking-[0.14em] text-muted">
          {brandName} · {bikeClassName(model.class)}
        </p>
        <h3 className="display text-xl text-ink group-hover:text-brand sm:text-2xl">{model.name}</h3>
        <p className="line-clamp-1 text-xs text-muted">{summary}</p>
        <span className="mt-auto inline-flex items-center gap-1 pt-2 text-sm font-semibold text-brand">
          <span className="sm:hidden">{short}</span>
          <span className="max-sm:hidden">{cta}</span>
          <ChevronRight className="size-4 shrink-0 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
        </span>
      </div>
    </Link>
  );
}

/** Compact links to the bikes a part fits, each with the bike's photo or drawing. */
export function FitsBikeList({
  title,
  models,
  brandName,
  moreCount = 0,
  moreHref,
  className,
}: {
  title: string;
  models: MotorcycleModel[];
  brandName: (slug: string) => string;
  moreCount?: number;
  moreHref?: string;
  className?: string;
}) {
  if (models.length === 0) return null;
  return (
    <div className={className}>
      <p className="font-display text-sm font-semibold uppercase tracking-[0.14em] text-muted">{title}</p>
      <ul className="mt-2 grid gap-2 sm:grid-cols-2">
        {models.map((m) => {
          const brand = brandName(m.brand);
          return (
            <li key={m.id}>
              <Link
                href={`/models/${m.slug}`}
                className="group card flex items-center gap-3 overflow-hidden pr-3 transition-colors hover:border-ink"
              >
                <BikeVisual
                  bikeClass={m.class}
                  image={motorcycleImage(m, brand)}
                  name={`${brand} ${m.name}`}
                  annotate={false}
                  sizes="112px"
                  className="aspect-[16/10] w-28 shrink-0"
                />
                <span className="min-w-0 flex-1 py-2">
                  <span className="block truncate font-display text-xs font-semibold uppercase tracking-[0.12em] text-muted">{brand}</span>
                  <span className="block truncate font-semibold text-ink group-hover:text-brand">{m.name}</span>
                </span>
                <ChevronRight className="size-4 shrink-0 text-muted" aria-hidden="true" />
              </Link>
            </li>
          );
        })}
      </ul>
      {moreCount > 0 && moreHref && (
        <a href={moreHref} className="mt-2 inline-flex min-h-10 items-center text-sm font-semibold text-brand underline">
          +{pluralize(moreCount, "more bike")}
        </a>
      )}
    </div>
  );
}

/** Compact image tile for "Popular parts". */
export function PopularPartCard({ part }: { part: PopularPart }) {
  return (
    <Link
      href={categoryPath(part.slug)}
      className="group relative isolate flex aspect-[5/4] flex-col justify-end overflow-hidden rounded-lg bg-graphite p-3 text-white"
    >
      {part.image ? (
        <PhotoFill
          photo={part.image}
          sizes="(min-width: 1024px) 20vw, (min-width: 640px) 33vw, 50vw"
          decorative
          className="-z-10 transition-transform duration-700 ease-out group-hover:scale-[1.07]"
        />
      ) : (
        <div className="blueprint absolute inset-0 -z-10 grid place-items-center">
          <span className="relative grid size-20 place-items-center">
            <GearRing className="absolute inset-0 text-on-dark-muted opacity-40" />
            <CategoryIcon name={part.icon} className="relative size-8 text-brand-bright" />
          </span>
        </div>
      )}
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-graphite via-graphite/40 to-transparent" />
      <span className="display text-lg leading-tight sm:text-xl">{part.label}</span>
      <span className="mt-0.5 text-xs text-on-dark-muted">{part.count > 0 ? pluralize(part.count, "listing") : "Ask in store"}</span>
    </Link>
  );
}
