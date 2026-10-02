import { BadgeCheck, CircleHelp, FlaskConical } from "lucide-react";
import { dealershipFor, sellsOriginalParts } from "@/config/business";
import { authenticityLabels, CATALOGUE_DISCLAIMER, confidenceLabels, inventoryStatusLabels } from "@/lib/catalog/labels";
import { cx } from "@/lib/cx";
import { formatPrice } from "@/lib/format";
import type { Authenticity, CompatibilityConfidence, InventoryStatus } from "@/lib/types";

const stockStyles: Record<InventoryStatus, { dot: string; text: string }> = {
  "in-stock": { dot: "bg-success", text: "text-success" },
  "low-stock": { dot: "bg-warning", text: "text-warning" },
  "out-of-stock": { dot: "bg-danger", text: "text-danger" },
  "available-on-request": { dot: "bg-steel", text: "text-steel" },
  "call-to-confirm": { dot: "bg-steel", text: "text-steel" },
  "catalogue-only": { dot: "border border-steel bg-transparent", text: "text-steel" },
};

/** Stock status. "Catalogue item" means listed but not confirmed on the shelf. */
export function AvailabilityBadge({ status, className }: { status: InventoryStatus; className?: string }) {
  const s = stockStyles[status];
  return (
    <span
      className={cx("inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide", s.text, className)}
      title={status === "catalogue-only" ? CATALOGUE_DISCLAIMER : undefined}
    >
      <span className={cx("size-2 shrink-0 rounded-full", s.dot)} aria-hidden="true" />
      {inventoryStatusLabels[status]}
    </span>
  );
}

/** How sure the listed fitment is. */
export function ConfidenceBadge({ confidence, className }: { confidence: CompatibilityConfidence; className?: string }) {
  const sure = confidence !== "needs-confirmation";
  const Icon = sure ? BadgeCheck : CircleHelp;
  return (
    <span className={cx("inline-flex items-center gap-1 text-xs font-medium", sure ? "text-success" : "text-warning", className)}>
      <Icon className="size-3.5 shrink-0" aria-hidden="true" />
      {confidenceLabels[confidence]}
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

/** Only rendered when the shop has verified it; "unknown" shows nothing. */
export function AuthenticityBadge({ authenticity }: { authenticity: Authenticity }) {
  if (authenticity === "unknown") return null;
  return (
    <span className="inline-flex items-center rounded border border-line-strong bg-surface px-1.5 py-0.5 text-xs font-semibold text-steel">
      {authenticityLabels[authenticity]}
    </span>
  );
}

/**
 * What the shop states about a motorcycle brand, from its business card: dealer (genuine parts at
 * company price) or original parts. Renders nothing for other brands.
 */
export function BrandRelationBadge({ brandSlug, className }: { brandSlug: string; className?: string }) {
  const dealer = dealershipFor(brandSlug);
  if (!dealer && !sellsOriginalParts(brandSlug)) return null;
  return (
    <span
      className={cx(
        "inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-xs font-semibold",
        dealer ? "bg-brand-bright text-white" : "border border-white/20 bg-black/40 text-on-dark",
        className,
      )}
      title={dealer ? `Dealer for ${dealer.company}: genuine parts at company price` : "Original parts sold"}
    >
      <BadgeCheck className="size-3" aria-hidden="true" />
      {dealer ? "Dealer · genuine parts" : "Original parts"}
    </span>
  );
}

/** Only for records with productStatus "demo": placeholder data that is not a real catalogue entry. */
export function DemoBadge({ className }: { className?: string }) {
  return (
    <span
      className={cx(
        "inline-flex items-center gap-1 rounded border border-warning/30 bg-warning-soft px-1.5 py-0.5 text-xs font-semibold text-warning",
        className,
      )}
      title="Demo entry, not a real catalogue item"
    >
      <FlaskConical className="size-3" aria-hidden="true" />
      Demo
    </span>
  );
}
