import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { CategoryIcon } from "@/components/ui/CategoryIcon";
import { categoryPath } from "@/lib/catalog/paths";
import { pluralize } from "@/lib/format";
import type { Brand, CategoryGroup, MotorcycleModel } from "@/lib/types";

export function BrandCard({ brand, modelCount, productCount }: { brand: Brand; modelCount: number; productCount: number }) {
  return (
    <Link
      href={`/brands/${brand.slug}`}
      className="card group flex min-h-24 flex-col justify-between p-4 transition-colors hover:border-ink"
    >
      <span className="font-display text-xl font-bold tracking-tight text-ink group-hover:text-brand">{brand.name}</span>
      <span className="mt-2 flex items-center justify-between text-xs text-muted">
        <span>
          {pluralize(modelCount, "model")} · {pluralize(productCount, "listing")}
        </span>
        <ChevronRight className="size-4 text-line-strong group-hover:text-ink" aria-hidden="true" />
      </span>
    </Link>
  );
}

export function ModelLink({
  model,
  brandName,
  productCount,
  showBrand = true,
}: {
  model: MotorcycleModel;
  brandName?: string;
  productCount: number;
  showBrand?: boolean;
}) {
  return (
    <Link
      href={`/models/${model.slug}`}
      className="card group flex min-h-14 items-center justify-between gap-2 px-4 py-3 transition-colors hover:border-ink"
    >
      <span className="min-w-0">
        {showBrand && brandName && <span className="block text-xs text-muted">{brandName}</span>}
        <span className="block truncate font-semibold text-ink group-hover:text-brand">{model.name}</span>
      </span>
      <span className="shrink-0 text-xs text-muted">{productCount > 0 ? pluralize(productCount, "part") : "Ask us"}</span>
    </Link>
  );
}

export function CategoryCard({ group, count }: { group: CategoryGroup; count: number }) {
  return (
    <Link
      href={categoryPath(group.slug)}
      className="card group flex items-center gap-3 p-3 transition-colors hover:border-ink sm:p-4"
    >
      <span className="tech-grid grid size-12 shrink-0 place-items-center rounded-lg text-steel group-hover:text-brand">
        <CategoryIcon name={group.icon} className="size-6" />
      </span>
      <span className="min-w-0">
        <span className="block text-sm font-semibold leading-tight text-ink sm:text-[0.9375rem]">{group.name}</span>
        <span className="mt-0.5 block text-xs text-muted">{count > 0 ? pluralize(count, "listing") : "Ask in store"}</span>
      </span>
    </Link>
  );
}
