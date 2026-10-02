import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cx } from "@/lib/cx";

export function SectionHeader({
  title,
  description,
  eyebrow,
  action,
  id,
  as: Heading = "h2",
  tone = "light",
}: {
  title: string;
  description?: string;
  eyebrow?: string;
  action?: { label: string; href: string };
  id?: string;
  as?: "h1" | "h2";
  tone?: "light" | "dark";
}) {
  const dark = tone === "dark";
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-x-6 gap-y-2">
      <div className="max-w-2xl">
        {eyebrow && (
          <p className={cx("eyebrow mb-1.5 flex items-center gap-2", dark && "eyebrow-dark")}>
            <span aria-hidden="true" className="h-px w-7 bg-current" />
            {eyebrow}
          </p>
        )}
        <Heading id={id} className={cx("display text-[2rem] sm:text-[2.6rem]", dark ? "text-white" : "text-ink")}>
          {title}
        </Heading>
        {description && <p className={cx("mt-2 text-[0.9375rem]", dark ? "text-on-dark-muted" : "text-muted")}>{description}</p>}
      </div>
      {action && (
        <Link
          href={action.href}
          className={cx(
            "inline-flex min-h-10 items-center gap-1 font-display text-[0.9375rem] font-semibold uppercase tracking-[0.08em]",
            dark ? "text-brand-bright hover:text-white" : "text-brand hover:text-brand-strong",
          )}
        >
          {action.label}
          <ArrowRight className="size-4" aria-hidden="true" />
        </Link>
      )}
    </div>
  );
}
