import Link from "next/link";
import { AddToCartButton } from "@/components/cart/AddToCartButton";
import { canRequest } from "@/lib/catalog/labels";
import { helmetSummary, isHelmet, toCartLine } from "@/lib/catalog/present";
import { cx } from "@/lib/cx";
import type { ProductView } from "@/lib/types";
import { AuthenticityBadge, AvailabilityBadge, ConfidenceBadge, DemoBadge, PriceDisplay } from "./Badges";
import { ProductImage } from "./ProductImage";

/** Fitment: one truncated line on phones; up to two model chips plus "+n" from small tablets up. */
function FitLine({ product }: { product: ProductView }) {
  if (isHelmet(product)) return <p className="truncate text-xs font-medium text-steel">{helmetSummary(product)}</p>;
  if (product.fitment === "universal") {
    const first = product.models[0];
    return (
      <p className="truncate text-xs text-muted">
        {first ? `Recommended for ${first.name}${product.models.length > 1 ? ` +${product.models.length - 1}` : ""}` : "Not model-specific"}
      </p>
    );
  }
  if (product.fitment === "unconfirmed" || product.models.length === 0) {
    return <p className="truncate text-xs text-muted">Fitment not listed: ask us</p>;
  }
  const shown = product.models.slice(0, 2);
  const more = product.models.length - shown.length;
  return (
    <>
      <p className="truncate text-xs font-medium text-steel sm:hidden">
        Fits {product.models[0].name}
        {product.models.length > 1 && <span className="text-muted"> +{product.models.length - 1}</span>}
      </p>
      <ul className="hidden flex-wrap gap-1 sm:flex" aria-label="Fits">
        {shown.map((m) => (
          <li
            key={m.id}
            className="rounded-sm border border-line bg-canvas px-1.5 py-0.5 text-[0.75rem] font-medium leading-tight text-steel"
          >
            {m.name}
          </li>
        ))}
        {more > 0 && <li className="px-1 py-0.5 text-[0.75rem] text-muted">+{more}</li>}
      </ul>
    </>
  );
}

/**
 * Product card, in order of what a rider scans for: the part, its name, which bikes it fits, price and
 * availability, then the cart button. Hover (desktop): the photo zooms 4%, the card's shadow deepens,
 * an accent line draws under the photo and the cart button fills. The card itself never moves.
 */
export function ProductCard({ product, priority = false }: { product: ProductView; priority?: boolean }) {
  const helmet = isHelmet(product);
  // Bike brand for parts; the maker for helmets, which fit any bike.
  const brand = helmet ? product.partBrand : product.brands.length === 1 ? product.brands[0].name : undefined;
  return (
    <article className="group card card-lift relative flex w-full flex-col overflow-hidden">
      <div className="relative">
        <ProductImage
          image={product.displayImage}
          art={product.art}
          icon={product.categoryIcon}
          label={product.subcategoryName ?? product.categoryName}
          priority={priority}
          zoom
        />
        {/* Darken the top edge so the overlaid badges stay readable on any photo. */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-14 bg-gradient-to-b from-graphite/60 to-transparent" />
        <div className="absolute inset-x-2 top-2 flex items-start justify-between gap-1">
          {product.productStatus === "demo" ? <DemoBadge className="shadow-sm" /> : <span />}
          {brand && (
            <span className="rounded-sm bg-graphite/85 px-1.5 py-0.5 font-display text-xs font-semibold uppercase tracking-wider text-white">
              {brand}
            </span>
          )}
        </div>
        <span
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 h-0.5 origin-left scale-x-0 bg-brand transition-[scale] duration-standard ease-card group-hover:scale-x-100"
        />
      </div>
      <div className="flex flex-1 flex-col gap-1.5 border-t border-line p-3">
        <p className="label-tech truncate text-muted">{product.subcategoryName ?? product.categoryName}</p>
        <h3 className="text-sm font-semibold leading-snug text-ink sm:text-[0.9375rem]">
          {/* Stretched link: the whole card opens the product; the cart button sits above it. */}
          <Link
            href={`/products/${product.slug}`}
            className="line-clamp-2 transition-colors duration-fast after:absolute after:inset-0 after:content-[''] group-hover:text-brand"
          >
            {product.name}
          </Link>
        </h3>
        <FitLine product={product} />
        {helmet ? (
          <p className="text-[0.75rem] text-muted">Size and colour: ask the shop</p>
        ) : (
          <ConfidenceBadge confidence={product.compatibilityConfidence} className="text-[0.75rem]" />
        )}
        <div className="mt-auto space-y-2 pt-2">
          <div className="flex flex-wrap items-center justify-between gap-x-2 gap-y-1">
            <PriceDisplay price={product.price} compareAtPrice={product.compareAtPrice} />
            <AuthenticityBadge authenticity={product.authenticity} hideUnknown />
          </div>
          <AvailabilityBadge status={product.inventoryStatus} />
          <AddToCartButton line={toCartLine(product)} disabled={!canRequest(product.inventoryStatus)} className="relative z-(--z-raised)" />
        </div>
      </div>
    </article>
  );
}

export function ProductGrid({
  products,
  priorityCount = 0,
  columns = "default",
  className,
}: {
  products: ProductView[];
  priorityCount?: number;
  columns?: "default" | "wide" | "three";
  className?: string;
}) {
  const grid = {
    default: "grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 xl:grid-cols-4",
    wide: "grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-6",
    three: "grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3",
  }[columns];
  return (
    <ul className={cx(grid, className)}>
      {products.map((p, i) => (
        <li key={p.id} className="flex">
          <ProductCard product={p} priority={i < priorityCount} />
        </li>
      ))}
    </ul>
  );
}
