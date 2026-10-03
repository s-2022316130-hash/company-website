import Link from "next/link";
import type { CSSProperties } from "react";
import { ArrowRight } from "lucide-react";
import { cx } from "@/lib/cx";

/** Reveal order inside a surrounding <Reveal>: label, then title, then description and link. */
const step = (i: number) => ({ "--reveal-i": i }) as CSSProperties;

export function SectionHeader({
  title,
  description,
  eyebrow,
  action,
  id,
  as: Heading = "h2",
  tone = "light",
  className,
}: {
  title: string;
  description?: string;
  eyebrow?: string;
  action?: { label: string; href: string };
  id?: string;
  as?: "h1" | "h2";
  tone?: "light" | "dark";
  className?: string;
}) {
  const dark = tone === "dark";
  return (
    <div className={cx("mb-6 flex flex-wrap items-end justify-between gap-x-6 gap-y-3 sm:mb-8", className)}>
      <div className="max-w-2xl">
        {eyebrow && (
          <p className={cx("reveal-item eyebrow mb-2 flex items-center gap-2", dark && "eyebrow-dark")} style={step(0)}>
            <span aria-hidden="true" className="h-px w-7 bg-current" />
            {eyebrow}
          </p>
        )}
        <Heading id={id} className={cx("reveal-item display text-section", dark ? "text-white" : "text-ink")} style={step(1)}>
          {title}
        </Heading>
        {description && (
          <p className={cx("reveal-item mt-2.5 text-[0.9375rem]", dark ? "text-on-dark-muted" : "text-muted")} style={step(2)}>
            {description}
          </p>
        )}
      </div>
      {action && (
        <Link
          href={action.href}
          className={cx(
            "reveal-item group/action inline-flex min-h-10 items-center gap-1.5 font-display text-[0.9375rem] font-semibold uppercase tracking-[0.08em] transition-colors",
            dark ? "text-brand-bright hover:text-white" : "text-brand hover:text-brand-strong",
          )}
          style={step(2)}
        >
          {action.label}
          <ArrowRight className="size-4 transition-transform duration-small ease-ui group-hover/action:translate-x-1" aria-hidden="true" />
        </Link>
      )}
    </div>
  );
}
