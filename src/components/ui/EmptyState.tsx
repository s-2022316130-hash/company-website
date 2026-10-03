import Link from "next/link";
import type { ReactNode } from "react";
import { SearchX, type LucideIcon } from "lucide-react";
import { BikeArt } from "@/components/bikes/BikeArt";
import { PartArt } from "@/components/parts/PartArt";
import { cx } from "@/lib/cx";
import type { BikeClass, PartArtKind } from "@/lib/types";

export interface EmptyAction {
  label: string;
  href: string;
  variant?: "primary" | "outline";
}

/** Drawing shown above the message: a motorcycle (e.g. a bike with no listed parts) or a part. */
export type EmptyArt = { kind: "bike"; bikeClass: BikeClass } | { kind: "part"; part: PartArtKind };

/**
 * Empty result, presented on purpose: a line drawing or icon on engineering paper, a plain message,
 * and the next useful actions. Never a blank page.
 */
export function EmptyState({
  title,
  description,
  actions = [],
  icon: Icon = SearchX,
  art,
  children,
  className,
}: {
  title: string;
  description?: string;
  actions?: EmptyAction[];
  icon?: LucideIcon;
  art?: EmptyArt;
  children?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cx("card relative isolate flex flex-col items-center overflow-hidden px-6 pb-12 pt-10 text-center", className)}>
      <div
        aria-hidden="true"
        className="tech-grid absolute inset-x-0 top-0 -z-10 h-44 [mask-image:linear-gradient(to_bottom,#000_30%,transparent)]"
      />
      {art?.kind === "bike" ? (
        <BikeArt bikeClass={art.bikeClass} className="mb-2 w-56 max-w-full animate-fade-up text-steel sm:w-64" />
      ) : art?.kind === "part" ? (
        <PartArt kind={art.part} className="mb-3 w-32 animate-fade-up text-steel" />
      ) : (
        <span className="mb-4 grid size-14 place-items-center rounded-full bg-surface ring-1 ring-line">
          <Icon className="size-6 text-steel" aria-hidden="true" />
        </span>
      )}
      <h2 className="display text-2xl text-ink sm:text-3xl">{title}</h2>
      {description && <p className="mt-2 max-w-md text-[0.9375rem] text-muted">{description}</p>}
      {children}
      {actions.length > 0 && (
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          {actions.map((a) => (
            <Link key={a.href} href={a.href} className={`btn ${a.variant === "outline" ? "btn-outline" : "btn-primary"}`}>
              {a.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
