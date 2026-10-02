import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/layout/PageHeader";
import { CategoryIcon } from "@/components/ui/CategoryIcon";
import { categoryCounts, categoryPath, loadCatalog } from "@/lib/catalog/catalog";
import { pluralize } from "@/lib/format";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Motorcycle Parts Categories",
  description:
    "Motorcycle spare parts by category: engine, clutch, brakes, chain and sprocket, filters, electrical, suspension, body parts, oils and accessories.",
  path: "/categories",
});

export default async function CategoriesPage() {
  const catalog = await loadCatalog();
  const counts = categoryCounts(catalog.products);
  return (
    <>
      <PageHeader
        title="Part categories"
        description="Every part type we organise the catalogue by. Numbers show how many products are listed online."
        crumbs={[{ label: "Categories", href: "/categories" }]}
      />
      <div className="container-page grid gap-4 py-6 md:grid-cols-2 xl:grid-cols-3">
        {catalog.groups.map((g) => {
          const href = categoryPath(g.slug);
          return (
            <section key={g.slug} className="card p-5" aria-labelledby={`cat-${g.slug}`}>
              <div className="flex items-start gap-3">
                <span className="tech-grid grid size-12 shrink-0 place-items-center rounded-lg text-steel">
                  <CategoryIcon name={g.icon} className="size-6" />
                </span>
                <div className="min-w-0">
                  <h2 id={`cat-${g.slug}`} className="font-display text-lg font-bold leading-tight">
                    <Link href={href} className="text-ink hover:text-brand">
                      {g.name}
                    </Link>
                  </h2>
                  <p className="text-xs text-muted">{pluralize(counts.get(g.slug) ?? 0, "listing")}</p>
                </div>
              </div>
              <ul className="mt-4 flex flex-wrap gap-x-1 gap-y-0.5">
                {g.subcategories.map((s) => (
                  <li key={s.slug}>
                    <Link
                      href={`/categories/${s.slug}`}
                      className="inline-flex min-h-9 items-center rounded px-2 text-sm text-ink hover:bg-steel-soft hover:text-brand"
                    >
                      {s.name}
                      {(counts.get(s.slug) ?? 0) > 0 && (
                        <span className="ml-1 text-xs text-muted">({counts.get(s.slug)})</span>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
      </div>
    </>
  );
}
