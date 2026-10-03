import { Check } from "lucide-react";
import { cx } from "@/lib/cx";

const steps = ["Cart", "Your details", "Send request"] as const;

/** Progress through the order flow: cart → details → send. A finished step's number becomes a check that pops in. */
export function OrderSteps({ current, className }: { current: 1 | 2 | 3; className?: string }) {
  return (
    <ol className={cx("flex flex-wrap items-center gap-x-2 gap-y-2 sm:gap-x-3", className)} aria-label="Order steps">
      {steps.map((label, i) => {
        const n = i + 1;
        const done = n < current;
        const active = n === current;
        return (
          <li key={label} className="flex items-center gap-2 sm:gap-3" aria-current={active ? "step" : undefined}>
            <span
              className={cx(
                "grid size-7 shrink-0 place-items-center rounded-full font-display text-sm font-bold transition-colors duration-small ease-ui",
                done ? "bg-success text-white" : active ? "bg-brand text-white" : "bg-surface text-muted ring-1 ring-line-strong",
              )}
            >
              {done ? <Check className="size-4 animate-check-in" aria-hidden="true" /> : n}
            </span>
            <span className={cx("text-sm font-semibold", active ? "text-ink" : "text-muted")}>
              {label}
              <span className="sr-only">{done ? " (done)" : active ? " (current step)" : ""}</span>
            </span>
            {n < steps.length && (
              <span aria-hidden="true" className={cx("h-0.5 w-5 shrink-0 rounded-full transition-colors duration-small sm:w-10", done ? "bg-success" : "bg-line-strong")} />
            )}
          </li>
        );
      })}
    </ol>
  );
}
