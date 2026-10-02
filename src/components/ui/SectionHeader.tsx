import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function SectionHeader({
  title,
  description,
  eyebrow,
  action,
  id,
  as: Heading = "h2",
}: {
  title: string;
  description?: string;
  eyebrow?: string;
  action?: { label: string; href: string };
  id?: string;
  as?: "h1" | "h2";
}) {
  return (
    <div className="mb-5 flex flex-wrap items-end justify-between gap-x-6 gap-y-2">
      <div className="max-w-2xl">
        {eyebrow && <p className="eyebrow mb-1">{eyebrow}</p>}
        <Heading id={id} className="font-display text-2xl font-bold tracking-tight text-ink sm:text-[1.75rem]">
          {title}
        </Heading>
        {description && <p className="mt-1.5 text-[0.9375rem] text-muted">{description}</p>}
      </div>
      {action && (
        <Link
          href={action.href}
          className="inline-flex min-h-10 items-center gap-1 text-sm font-semibold text-brand hover:text-brand-strong"
        >
          {action.label}
          <ArrowRight className="size-4" aria-hidden="true" />
        </Link>
      )}
    </div>
  );
}
