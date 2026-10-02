import { Skeleton } from "@/components/ui/Skeleton";

export default function ProductLoading() {
  return (
    <div className="container-page py-7" role="status" aria-label="Loading product">
      <Skeleton className="h-4 w-64" />
      <div className="mt-5 grid gap-6 lg:grid-cols-2 lg:gap-10">
        <Skeleton className="aspect-square w-full rounded-xl" />
        <div className="space-y-3">
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-9 w-4/5" />
          <Skeleton className="h-48 w-full rounded-xl" />
        </div>
      </div>
    </div>
  );
}
