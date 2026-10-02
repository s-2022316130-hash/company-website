import Link from "next/link";
import { AddToCartButton } from "@/components/cart/AddToCartButton";
import { canRequest } from "@/lib/catalog/labels";
import { toCartLine } from "@/lib/catalog/present";
import type { ProductView } from "@/lib/types";
import { AvailabilityBadge, PriceDisplay, ProductTypeBadge, SampleBadge } from "./Badges";
import { ProductImage } from "./ProductImage";

/** Up to two model chips plus a "+n" count, or a plain note for non-model-specific items. */
function CompatibilityChips({ product }: { product: ProductView }) {
  if (product.fitment === "universal") {
    return <p className="truncate text-xs text-muted">Not model-specific</p>;
  }
  if (product.fitment === "unconfirmed" || product.models.length === 0) {
    return <p className="truncate text-xs text-muted">Fitment not listed: ask us</p>;
  }
  const shown = product.models.slice(0, 2);
  const more = product.models.length - shown.length;
  return (
    <ul className="flex flex-wrap gap-1" aria-label="Fits">
      {shown.map((m) => (
        <li
          key={m.id}
          className="rounded border border-line bg-canvas px-1.5 py-0.5 text-[0.75rem] font-medium leading-tight text-steel"
        >
          {m.name}
        </li>
      ))}
      {more > 0 && <li className="px-1 py-0.5 text-[0.75rem] text-muted">+{more}</li>}
    </ul>
  );
}

export function ProductCard({ product, priority = false }: { product: ProductView; priority?: boolean }) {
  const brand = product.brands.length === 1 ? product.brands[0].name : undefined;
  return (
    <article className="card group relative flex w-full flex-col overflow-hidden transition-[box-shadow,transform] duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-ink/10">
      <div className="relative">
        <ProductImage
          image={product.displayImage}
          icon={product.categoryIcon}
          bikeClass={product.models[0]?.class}
          label={product.subcategoryName ?? product.categoryName}
          priority={priority}
          zoom
        />
        {/* Darken the top edge so the overlaid badges stay readable on any photo. */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-14 bg-gradient-to-b from-graphite/60 to-transparent" />
        <div className="absolute inset-x-2 top-2 flex items-start justify-between gap-1">
          {product.isSample ? <SampleBadge className="shadow-sm" /> : <span />}
          {brand && (
            <span className="rounded bg-graphite/85 px-1.5 py-0.5 font-display text-xs font-semibold uppercase tracking-wider text-white">
              {brand}
            </span>
          )}
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-1.5 border-t-2 border-brand/80 p-3">
        <p className="truncate font-display text-xs font-semibold uppercase tracking-[0.12em] text-muted">
          {product.subcategoryName ?? product.categoryName}
        </p>
        <h3 className="text-sm font-semibold leading-snug text-ink sm:text-[0.9375rem]">
          {/* Stretched link: the whole card opens the product; the cart button sits above it. */}
          <Link
            href={`/products/${product.slug}`}
            className="line-clamp-2 after:absolute after:inset-0 after:content-[''] group-hover:text-brand"
          >
            {product.name}
          </Link>
        </h3>
        <div className="hidden sm:block">
          <CompatibilityChips product={product} />
        </div>
        <div className="mt-auto space-y-2 pt-1.5">
          <div className="flex flex-wrap items-center justify-between gap-x-2 gap-y-1">
            <PriceDisplay price={product.price} compareAtPrice={product.compareAtPrice} />
            <ProductTypeBadge type={product.productType} />
          </div>
          <AvailabilityBadge status={product.stockStatus} />
          <AddToCartButton line={toCartLine(product)} disabled={!canRequest(product.stockStatus)} className="relative z-10" />
        </div>
      </div>
    </article>
  );
}

export function ProductGrid({
  products,
  priorityCount = 0,
  columns = "default",
}: {
  products: ProductView[];
  priorityCount?: number;
  columns?: "default" | "wide" | "three";
}) {
  const grid = {
    default: "grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 xl:grid-cols-4",
    wide: "grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-6",
    three: "grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3",
  }[columns];
  return (
    <ul className={grid}>
      {products.map((p, i) => (
        <li key={p.id} className="flex">
          <ProductCard product={p} priority={i < priorityCount} />
        </li>
      ))}
    </ul>
  );
}
