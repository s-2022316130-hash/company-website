import { cx } from "@/lib/cx";

export function Skeleton({ className }: { className?: string }) {
  return <div className={cx("animate-pulse rounded-md bg-steel-soft", className)} aria-hidden="true" />;
}

export function ProductCardSkeleton() {
  return (
    <div className="card overflow-hidden" aria-hidden="true">
      <Skeleton className="aspect-square rounded-none" />
      <div className="space-y-2 p-3">
        <Skeleton className="h-3 w-1/3" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="mt-3 h-10 w-full" />
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

export function ListingPageSkeleton() {
  return (
    <div className="container-page py-6" role="status" aria-label="Loading products">
      <Skeleton className="mb-3 h-4 w-48" />
      <Skeleton className="mb-6 h-8 w-72" />
      <div className="grid gap-6 lg:grid-cols-[16rem_1fr]">
        <div className="hidden space-y-3 lg:block">
          <Skeleton className="h-40 w-full" />
          <Skeleton className="h-40 w-full" />
        </div>
        <ProductGridSkeleton />
      </div>
    </div>
  );
}
