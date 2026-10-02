import { Info } from "lucide-react";
import { CATALOGUE_DISCLAIMER } from "@/lib/catalog/labels";

/** Shown while the catalogue contains entries the shop has not confirmed as stock. */
export function CatalogueNotice() {
  return (
    <div className="border-b border-warning/25 bg-warning-soft">
      <p className="container-page flex items-start gap-2 py-2 text-[0.8125rem] text-ink sm:text-sm">
        <Info className="mt-0.5 size-4 shrink-0 text-warning" aria-hidden="true" />
        <span>
          <strong className="font-semibold">Parts catalogue:</strong> {CATALOGUE_DISCLAIMER}
        </span>
      </p>
    </div>
  );
}
