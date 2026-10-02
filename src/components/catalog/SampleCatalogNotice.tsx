import { FlaskConical } from "lucide-react";

/** Shown while the catalogue still contains demo records. */
export function SampleCatalogNotice() {
  return (
    <div className="border-b border-warning/25 bg-warning-soft">
      <p className="container-page flex items-start gap-2 py-2 text-[0.8125rem] text-ink sm:text-sm">
        <FlaskConical className="mt-0.5 size-4 shrink-0 text-warning" aria-hidden="true" />
        <span>
          <strong className="font-semibold">Catalogue preview:</strong> items marked “Demo catalogue” show how the shop is
          organised; they are not confirmed stock.<span className="max-sm:hidden"> Call or WhatsApp to check any part.</span>
        </span>
      </p>
    </div>
  );
}
