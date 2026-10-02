import Link from "next/link";
import { AddToCartButton } from "@/components/cart/AddToCartButton";
import { canRequest } from "@/lib/catalog/labels";
import { fitmentSummary, productEyebrow, toCartLine } from "@/lib/catalog/present";
import type { ProductView } from "@/lib/types";
import { AvailabilityBadge, PriceDisplay, ProductTypeBadge, SampleBadge } from "./Badges";
import { ProductImage } from "./ProductImage";

export function ProductCard({ product, priority = false }: { product: ProductView; priority?: boolean }) {
  return (
    <article className="card group relative flex w-full flex-col overflow-hidden transition-shadow hover:shadow-md hover:shadow-ink/5">
      <ProductImage image={product.images[0]} icon={product.categoryIcon} priority={priority} />
      {product.isSample && <SampleBadge className="absolute left-2 top-2" />}
      <div className="flex flex-1 flex-col gap-1 border-t border-line p-3">
        <p className="truncate text-xs font-medium uppercase tracking-wide text-muted">{productEyebrow(product)}</p>
        <h3 className="text-sm font-semibold leading-snug text-ink sm:text-[0.9375rem]">
          {/* Stretched link: the whole card opens the product; the cart button sits above it. */}
          <Link
            href={`/products/${product.slug}`}
            className="line-clamp-2 after:absolute after:inset-0 after:content-[''] group-hover:text-brand"
          >
            {product.name}
          </Link>
        </h3>
        <p className="hidden truncate text-xs text-muted sm:block">{fitmentSummary(product)}</p>
        <div className="mt-auto space-y-2 pt-2">
          <div className="flex flex-wrap items-center justify-between gap-x-2 gap-y-1">
            <PriceDisplay price={product.price} compareAtPrice={product.compareAtPrice} />
            <ProductTypeBadge type={product.productType} />
          </div>
          <AvailabilityBadge status={product.stockStatus} />
          <AddToCartButton
            line={toCartLine(product)}
            disabled={!canRequest(product.stockStatus)}
            className="relative z-10"
          />
        </div>
      </div>
    </article>
  );
}

export function ProductGrid({ products, priorityCount = 0 }: { products: ProductView[]; priorityCount?: number }) {
  return (
    <ul className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 xl:grid-cols-4">
      {products.map((p, i) => (
        <li key={p.id} className="flex">
          <ProductCard product={p} priority={i < priorityCount} />
        </li>
      ))}
    </ul>
  );
}
