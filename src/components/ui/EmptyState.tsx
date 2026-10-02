import Link from "next/link";
import type { ReactNode } from "react";
import { SearchX, type LucideIcon } from "lucide-react";

export interface EmptyAction {
  label: string;
  href: string;
  variant?: "primary" | "outline";
}

export function EmptyState({
  title,
  description,
  actions = [],
  icon: Icon = SearchX,
  children,
}: {
  title: string;
  description?: string;
  actions?: EmptyAction[];
  icon?: LucideIcon;
  children?: ReactNode;
}) {
  return (
    <div className="card flex flex-col items-center px-6 py-12 text-center">
      <span className="tech-grid mb-4 grid size-14 place-items-center rounded-full">
        <Icon className="size-6 text-steel" aria-hidden="true" />
      </span>
      <h2 className="font-display text-xl font-bold text-ink">{title}</h2>
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
