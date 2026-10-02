import { FlaskConical } from "lucide-react";
import { productTypeLabels, stockStatusLabels } from "@/lib/catalog/labels";
import { cx } from "@/lib/cx";
import { formatPrice } from "@/lib/format";
import type { ProductType, StockStatus } from "@/lib/types";

const stockStyles: Record<StockStatus, { dot: string; text: string }> = {
  "in-stock": { dot: "bg-success", text: "text-success" },
  "low-stock": { dot: "bg-warning", text: "text-warning" },
  "out-of-stock": { dot: "bg-danger", text: "text-danger" },
  "available-on-request": { dot: "bg-steel", text: "text-steel" },
  "call-for-availability": { dot: "bg-steel", text: "text-steel" },
};

export function AvailabilityBadge({ status, className }: { status: StockStatus; className?: string }) {
  const s = stockStyles[status];
  return (
    <span className={cx("inline-flex items-center gap-1.5 text-xs font-semibold", s.text, className)}>
      <span className={cx("size-2 shrink-0 rounded-full", s.dot)} aria-hidden="true" />
      {stockStatusLabels[status]}
    </span>
  );
}

export function PriceDisplay({
  price,
  compareAtPrice,
  size = "md",
}: {
  price?: number;
  compareAtPrice?: number;
  size?: "md" | "lg";
}) {
  if (price === undefined) {
    return (
      <span className={cx("font-semibold text-steel", size === "lg" ? "text-xl" : "text-sm")}>{formatPrice(undefined)}</span>
    );
  }
  return (
    <span className="inline-flex flex-wrap items-baseline gap-x-2">
      <span className={cx("font-display font-bold text-ink", size === "lg" ? "text-3xl" : "text-lg")}>
        {formatPrice(price)}
      </span>
      {compareAtPrice !== undefined && compareAtPrice > price && (
        <span className="text-sm text-muted line-through">
          <span className="sr-only">Was </span>
          {formatPrice(compareAtPrice)}
        </span>
      )}
    </span>
  );
}

/** Only rendered for verified types; "unknown" shows nothing. */
export function ProductTypeBadge({ type }: { type: ProductType }) {
  if (type === "unknown") return null;
  return (
    <span className="inline-flex items-center rounded border border-line-strong bg-surface px-1.5 py-0.5 text-xs font-semibold text-steel">
      {productTypeLabels[type]}
    </span>
  );
}

export function SampleBadge({ className }: { className?: string }) {
  return (
    <span
      className={cx(
        "inline-flex items-center gap-1 rounded border border-warning/30 bg-warning-soft px-1.5 py-0.5 text-xs font-semibold text-warning",
        className,
      )}
      title="Demo catalogue entry, not confirmed store stock"
    >
      <FlaskConical className="size-3" aria-hidden="true" />
      Demo catalogue
    </span>
  );
}
