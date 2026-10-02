import type { ReactNode } from "react";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { GearRing } from "@/components/ui/Mechanical";
import type { Crumb } from "@/lib/seo";

/** Compact dark title band used at the top of inner pages without a photo banner. */
export function PageHeader({
  title,
  description,
  crumbs,
  eyebrow,
  children,
}: {
  title: string;
  description?: ReactNode;
  crumbs: Crumb[];
  eyebrow?: string;
  children?: ReactNode;
}) {
  return (
    <div className="relative isolate overflow-hidden bg-graphite text-white">
      <div className="fins absolute inset-0 -z-10 opacity-70" />
      <GearRing teeth={30} className="pointer-events-none absolute -right-20 -top-28 -z-10 size-80 text-white/[0.05]" />
      <div className="container-page py-6 sm:py-9">
        <Breadcrumbs items={crumbs} tone="dark" />
        {eyebrow && <p className="eyebrow eyebrow-dark mt-4">{eyebrow}</p>}
        <h1 className={`display text-[2.25rem] text-white sm:text-5xl ${eyebrow ? "mt-1" : "mt-4"}`}>{title}</h1>
        {description && <div className="mt-2 max-w-3xl text-[0.9375rem] text-on-dark sm:text-base">{description}</div>}
        {children}
      </div>
      <div className="chain-rule opacity-60" aria-hidden="true" />
    </div>
  );
}
