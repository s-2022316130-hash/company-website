import Link from "next/link";
import { ArrowRight, ChevronRight } from "lucide-react";
import { BikeVisual } from "@/components/bikes/BikeVisual";
import { BrandMark } from "@/components/brand/BrandMark";
import { PhotoFill } from "@/components/media/Photo";
import { PartArt } from "@/components/parts/PartArt";
import { CategoryIcon } from "@/components/ui/CategoryIcon";
import { GearRing } from "@/components/ui/Mechanical";
import { BrandRelationBadge } from "./Badges";
import type { PopularPart } from "@/lib/catalog/catalog";
import { categoryPath } from "@/lib/catalog/paths";
import { cx } from "@/lib/cx";
import { pluralize } from "@/lib/format";
import { motorcycleImage } from "@/lib/images";
import type { BikeClass, Brand, CategoryGroup, ModelStatus, MotorcycleModel } from "@/lib/types";

/*
 * Hover language shared by these cards (desktop only; Tailwind's hover variant ignores touch):
 * images zoom 4–5% over 600ms, cards rise 3–4px with a soft shadow, arrows nudge 4px forward.
 */

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

const imageZoom = "transition-[scale] duration-emphasis ease-card group-hover:scale-[1.05]";

/** Photo-backed category card: the image does the talking, text sits on a dark gradient. */
export function CategoryImageCard({
  group,
  count,
  href,
  className,
  compact = false,
  sizes = "(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw",
}: {
  group: CategoryGroup;
  count: number;
  /** Defaults to the category page; brand and model pages link to their own filtered list. */
  href?: string;
  className?: string;
  /** Tall, narrow card for the seven-across homepage grid. */
  compact?: boolean;
  sizes?: string;
}) {
  return (
    <Link
      href={href ?? categoryPath(group.slug)}
      className={cx(
        "group relative isolate block w-full overflow-hidden rounded-lg bg-graphite text-white",
        compact ? "aspect-[4/5]" : "aspect-[4/5] sm:aspect-[4/3]",
        className,
      )}
    >
      {group.image ? (
        <PhotoFill photo={group.image} sizes={sizes} decorative className={imageZoom} />
      ) : (
        <div className="blueprint absolute inset-0" />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-graphite via-graphite/50 to-graphite/0 transition-opacity duration-standard ease-ui group-hover:opacity-80" />
      <div className="absolute inset-0 bg-graphite/0 transition-colors duration-standard ease-ui group-hover:bg-graphite/10" />
      <span className="absolute left-2.5 top-2.5 grid size-8 place-items-center rounded-md bg-graphite/80 text-brand-bright ring-1 ring-white/15 sm:left-3 sm:top-3 sm:size-9 md:bg-graphite/70 md:backdrop-blur-sm">
        <CategoryIcon name={group.icon} className="size-4.5 sm:size-5" />
      </span>
      {!compact && (
        <span className="absolute right-3 top-3 rounded-sm bg-graphite/80 px-1.5 py-0.5 text-xs font-medium text-on-dark ring-1 ring-white/15 md:bg-graphite/70 md:backdrop-blur-sm">
          {count > 0 ? pluralize(count, "part") : "Ask in store"}
        </span>
      )}
      <span className="absolute inset-x-3 bottom-3 transition-[translate] duration-standard ease-card group-hover:-translate-y-1.5">
        <span className={cx("display block leading-none", compact ? "text-lg xl:text-xl" : "text-xl sm:text-2xl")}>{group.name}</span>
        <span className="mt-1.5 flex items-center justify-between gap-2 text-xs font-medium text-on-dark-muted">
          <span className="truncate">{compact ? (count > 0 ? pluralize(count, "part") : "Ask in store") : group.shortLabel}</span>
          <ArrowRight
            className="size-4 shrink-0 -translate-x-1 text-brand-bright opacity-0 transition-[opacity,translate] duration-small ease-ui group-hover:translate-x-0 group-hover:opacity-100"
            aria-hidden="true"
          />
        </span>
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
      className="group card-dark card-lift relative flex h-full w-full flex-col overflow-hidden hover:-translate-y-1"
    >
      <div className="relative aspect-[16/9] overflow-hidden">
        <BikeVisual
          bikeClass={feature?.class ?? "street"}
          image={feature ? motorcycleImage(feature, brand.name) : undefined}
          name={feature ? `${brand.name} ${feature.name}` : brand.name}
          annotate={false}
          hover="ride"
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 18rem"
          className="absolute inset-0"
        />
        <span
          aria-hidden="true"
          className="display pointer-events-none absolute -left-1 top-1 select-none text-[4.5rem] leading-none text-white/[0.06] transition-colors duration-standard group-hover:text-white/[0.09]"
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
          <span className="label-tech text-on-dark-muted">{pluralize(modelCount, "model")}</span>
        </div>
        {modelNames.length > 0 && (
          <ul className="flex flex-wrap gap-1.5" aria-label={`${brand.name} models`}>
            {modelNames.map((n) => (
              <li key={n} className="rounded-sm border border-graphite-3 bg-white/[0.03] px-2 py-0.5 text-xs text-on-dark">
                {n}
              </li>
            ))}
          </ul>
        )}
        <span className="mt-auto flex items-center justify-between gap-2 border-t border-graphite-3 pt-3 text-sm">
          <span className="text-on-dark-muted">{productCount > 0 ? `${pluralize(productCount, "part")} listed` : "Ask us for parts"}</span>
          <span className="inline-flex items-center gap-1 font-semibold text-brand-bright">
            Explore parts
            <ArrowRight className="size-4 transition-transform duration-small ease-ui group-hover:translate-x-1" aria-hidden="true" />
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
      className={cx("group card card-lift flex h-full w-full flex-col overflow-hidden hover:-translate-y-1", className)}
    >
      <div className="relative overflow-hidden">
        <BikeVisual
          bikeClass={model.class}
          image={motorcycleImage(model, brandName)}
          name={`${brandName} ${model.name}`}
          hover="ride"
          sizes="(min-width: 1024px) 22vw, (min-width: 768px) 30vw, 48vw"
          className="aspect-[16/10]"
        />
        {badge && (
          <span className="absolute left-2 top-2 rounded-sm bg-graphite/85 px-1.5 py-0.5 text-[0.75rem] font-medium text-on-dark ring-1 ring-white/15">
            {badge}
          </span>
        )}
        <span
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 h-0.5 origin-left scale-x-0 bg-brand-bright transition-[scale] duration-standard ease-card group-hover:scale-x-100"
        />
      </div>
      <div className="flex flex-1 flex-col gap-1 border-t border-line p-3 sm:p-3.5">
        <p className="label-tech truncate text-muted">
          {brandName} · {bikeClassName(model.class)}
        </p>
        <h3 className="display text-xl text-ink transition-colors duration-fast group-hover:text-brand sm:text-2xl">{model.name}</h3>
        <p className="line-clamp-1 text-xs text-muted">{summary}</p>
        <span className="mt-auto inline-flex items-center gap-1 pt-2 text-sm font-semibold text-brand">
          <span className="sm:hidden">{short}</span>
          <span className="max-sm:hidden">{cta}</span>
          <ChevronRight className="size-4 shrink-0 transition-transform duration-small ease-ui group-hover:translate-x-1" aria-hidden="true" />
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
      <p className="label-tech text-muted">{title}</p>
      <ul className="mt-2 grid gap-2 sm:grid-cols-2">
        {models.map((m) => {
          const brand = brandName(m.brand);
          return (
            <li key={m.id}>
              <Link
                href={`/models/${m.slug}`}
                className="group card card-lift flex items-center gap-3 overflow-hidden pr-3"
              >
                <BikeVisual
                  bikeClass={m.class}
                  image={motorcycleImage(m, brand)}
                  name={`${brand} ${m.name}`}
                  annotate={false}
                  hover="ride"
                  sizes="112px"
                  className="aspect-[16/10] w-28 shrink-0"
                />
                <span className="min-w-0 flex-1 py-2">
                  <span className="label-tech block truncate text-muted">{brand}</span>
                  <span className="block truncate font-semibold text-ink transition-colors group-hover:text-brand">{m.name}</span>
                </span>
                <ChevronRight className="size-4 shrink-0 text-muted transition-transform duration-small ease-ui group-hover:translate-x-1" aria-hidden="true" />
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

/**
 * Compact tile for "Frequently replaced": the part type's line drawing on blueprint (or its photo when
 * there is no drawing), the name and the number of listings.
 */
export function PopularPartTile({ part }: { part: PopularPart }) {
  return (
    <Link
      href={categoryPath(part.slug)}
      className="group card-dark card-lift flex h-full w-full items-center gap-3 overflow-hidden p-2 pr-3"
    >
      <span className="blueprint relative grid size-14 shrink-0 place-items-center overflow-hidden rounded-md text-on-dark sm:size-16">
        {part.art ? (
          <PartArt kind={part.art} className={cx("w-[80%]", imageZoom)} />
        ) : part.image ? (
          <PhotoFill photo={part.image} sizes="64px" decorative className={imageZoom} />
        ) : (
          <>
            <GearRing className="absolute inset-1 text-on-dark-muted opacity-40" />
            <CategoryIcon name={part.icon} className="relative size-6 text-brand-bright" />
          </>
        )}
      </span>
      <span className="min-w-0 flex-1">
        <span className="line-clamp-2 font-display text-base font-semibold uppercase leading-[1.05] tracking-[0.04em] text-white">
          {part.label}
        </span>
        <span className="text-xs text-on-dark-muted">{part.count > 0 ? pluralize(part.count, "listing") : "Ask in store"}</span>
      </span>
      <ArrowRight className="size-4 shrink-0 text-brand-bright transition-transform duration-small ease-ui group-hover:translate-x-1" aria-hidden="true" />
    </Link>
  );
}
