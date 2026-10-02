import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { cx } from "@/lib/cx";
import { breadcrumbJsonLd, type Crumb } from "@/lib/seo";
import { JsonLd } from "./JsonLd";

/** Visible breadcrumb trail plus BreadcrumbList structured data. The last crumb is the current page. */
export function Breadcrumbs({ items, tone = "light" }: { items: Crumb[]; tone?: "light" | "dark" }) {
  const all: Crumb[] = [{ label: "Home", href: "/" }, ...items];
  const dark = tone === "dark";
  return (
    <>
      <nav aria-label="Breadcrumb" className={cx("text-sm", dark ? "text-on-dark-muted" : "text-muted")}>
        <ol className="flex flex-wrap items-center gap-1">
          {all.map((c, i) => {
            const last = i === all.length - 1;
            return (
              <li key={c.href} className="flex min-w-0 items-center gap-1">
                {i > 0 && <ChevronRight className="size-3.5 shrink-0" aria-hidden="true" />}
                {last ? (
                  <span aria-current="page" className={cx("truncate font-medium", dark ? "text-white" : "text-ink")}>
                    {c.label}
                  </span>
                ) : (
                  <Link href={c.href} className={cx("hover:underline", dark ? "hover:text-white" : "hover:text-ink")}>
                    {c.label}
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
      <JsonLd data={breadcrumbJsonLd(all)} />
    </>
  );
}
