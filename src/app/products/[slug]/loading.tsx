import { Skeleton } from "@/components/ui/Skeleton";

/** Mirrors the product page: breadcrumb, photo, then the name and purchase card. */
export default function ProductLoading() {
  return (
    <div className="container-page py-5 sm:py-7" role="status" aria-label="Loading product">
      <Skeleton className="h-4 w-64 max-w-full" />
      <div className="mt-5 grid gap-6 lg:grid-cols-2 lg:gap-10">
        <Skeleton className="aspect-[4/3] w-full rounded-lg lg:aspect-square" />
        <div className="space-y-3">
          <Skeleton className="h-3 w-40" />
          <Skeleton className="h-10 w-4/5" />
          <div className="flex gap-2">
            <Skeleton className="h-6 w-28 rounded-sm" />
            <Skeleton className="h-6 w-36 rounded-sm" />
          </div>
          <div className="card mt-5 space-y-4 p-5">
            <div className="flex justify-between">
              <Skeleton className="h-7 w-32" />
              <Skeleton className="h-4 w-28" />
            </div>
            <Skeleton className="h-16 w-full rounded-lg" />
            <Skeleton className="h-11 w-40" />
            <div className="grid gap-2 sm:grid-cols-2">
              <Skeleton className="h-13 w-full" />
              <Skeleton className="h-13 w-full" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
