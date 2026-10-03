import { cx } from "@/lib/cx";

/** Placeholder block with a soft highlight sweeping across every 1.8s (CSS .skeleton in globals.css). */
export function Skeleton({ className }: { className?: string }) {
  return <div className={cx("skeleton rounded-md", className)} aria-hidden="true" />;
}

/** Same shape as ProductCard: photo, part type, two-line name, fitment, price, availability, button. */
export function ProductCardSkeleton() {
  return (
    <div className="card overflow-hidden" aria-hidden="true">
      <Skeleton className="aspect-square rounded-none" />
      <div className="space-y-2 border-t border-line p-3">
        <Skeleton className="h-2.5 w-1/3" />
        <Skeleton className="h-4 w-11/12" />
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-4 w-16 rounded-sm" />
        <div className="flex items-center justify-between pt-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-14 rounded-sm" />
        </div>
        <Skeleton className="h-3 w-28" />
        <Skeleton className="mt-1 h-10 w-full" />
      </div>
    </div>
  );
}

export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: count }, (_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}

/** Dark title band matching PageHeader. */
function HeaderBandSkeleton() {
  return (
    <div className="bg-graphite">
      <div className="container-page space-y-3 py-6 sm:py-9">
        <div className="h-3.5 w-40 rounded-sm bg-white/10" />
        <div className="h-9 w-72 max-w-full rounded-sm bg-white/15" />
        <div className="h-4 w-96 max-w-full rounded-sm bg-white/10" />
      </div>
    </div>
  );
}

/** Listing pages (shop, search, categories, brands, models): header, filters, then product cards. */
export function ListingPageSkeleton({ label = "Loading products" }: { label?: string }) {
  return (
    <div role="status" aria-label={label}>
      <HeaderBandSkeleton />
      <div className="container-page py-6">
        <div className="grid gap-6 lg:grid-cols-[15rem_minmax(0,1fr)]">
          <div className="hidden lg:block">
            <div className="card space-y-4 p-4">
              <Skeleton className="h-5 w-20" />
              {Array.from({ length: 6 }, (_, i) => (
                <Skeleton key={i} className="h-4 w-full" />
              ))}
              <Skeleton className="h-5 w-24" />
              {Array.from({ length: 4 }, (_, i) => (
                <Skeleton key={i} className="h-4 w-5/6" />
              ))}
            </div>
          </div>
          <div className="min-w-0">
            <div className="mb-3 flex items-center justify-between">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-10 w-40" />
            </div>
            <ProductGridSkeleton />
          </div>
        </div>
      </div>
    </div>
  );
}
