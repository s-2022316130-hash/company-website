import type { ReactNode } from "react";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import type { Crumb } from "@/lib/seo";

/** Title band used at the top of every inner page. */
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
    <div className="border-b border-line bg-surface">
      <div className="container-page py-5 sm:py-7">
        <Breadcrumbs items={crumbs} />
        {eyebrow && <p className="eyebrow mt-4">{eyebrow}</p>}
        <h1 className={`font-display text-[1.75rem] font-bold leading-tight tracking-tight text-ink sm:text-4xl ${eyebrow ? "mt-1" : "mt-4"}`}>
          {title}
        </h1>
        {description && <div className="mt-2 max-w-3xl text-[0.9375rem] text-muted sm:text-base">{description}</div>}
        {children}
      </div>
    </div>
  );
}
