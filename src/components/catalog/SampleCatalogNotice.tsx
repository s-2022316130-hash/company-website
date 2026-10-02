import { FlaskConical } from "lucide-react";

/** Shown while the catalogue still contains development sample records. */
export function SampleCatalogNotice() {
  return (
    <div className="border-b border-warning/25 bg-warning-soft">
      <p className="container-page flex items-start gap-2 py-2.5 text-sm text-ink">
        <FlaskConical className="mt-0.5 size-4 shrink-0 text-warning" aria-hidden="true" />
        <span>
          <strong className="font-semibold">Catalogue preview.</strong> Products marked “Sample listing” are placeholders
          while the store’s real stock is being added. Call or WhatsApp to check any part.
        </span>
      </p>
    </div>
  );
}
