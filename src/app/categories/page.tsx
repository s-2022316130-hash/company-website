import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/layout/PageHeader";
import { PhotoFill } from "@/components/media/Photo";
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
        eyebrow="Shop by category"
        title="Part categories"
        description="Every part type the catalogue is organised by. Numbers show how many products are listed online."
        crumbs={[{ label: "Categories", href: "/categories" }]}
      />
      <div className="container-page grid gap-4 py-10 md:grid-cols-2 xl:grid-cols-3">
        {catalog.groups.map((g) => {
          const href = categoryPath(g.slug);
          return (
            <section key={g.slug} className="card group overflow-hidden" aria-labelledby={`cat-${g.slug}`}>
              <Link href={href} className="relative isolate flex aspect-[16/7] items-end overflow-hidden bg-graphite p-4 text-white">
                <PhotoFill
                  photo={g.image}
                  sizes="(min-width: 1280px) 33vw, (min-width: 768px) 50vw, 100vw"
                  decorative
                  className="-z-20 transition-transform duration-700 ease-out group-hover:scale-[1.05]"
                />
                <span className="absolute inset-0 -z-10 bg-gradient-to-t from-graphite via-graphite/50 to-graphite/0" />
                <span className="flex w-full items-end justify-between gap-3">
                  <span>
                    <span className="flex items-center gap-2 text-brand-bright">
                      <CategoryIcon name={g.icon} className="size-5" />
                      <span className="text-xs font-medium text-on-dark-muted">{pluralize(counts.get(g.slug) ?? 0, "listing")}</span>
                    </span>
                    <h2 id={`cat-${g.slug}`} className="display mt-1 text-2xl text-white">
                      {g.name}
                    </h2>
                  </span>
                </span>
              </Link>
              <div className="p-4">
                <p className="text-sm text-muted">{g.description}</p>
                <ul className="mt-3 flex flex-wrap gap-x-1 gap-y-0.5">
                  {g.subcategories.map((s) => (
                    <li key={s.slug}>
                      <Link
                        href={categoryPath(s.slug)}
                        className="inline-flex min-h-9 items-center rounded px-2 text-sm text-ink hover:bg-steel-soft hover:text-brand"
                      >
                        {s.name}
                        {(counts.get(s.slug) ?? 0) > 0 && <span className="ml-1 text-xs text-muted">({counts.get(s.slug)})</span>}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </section>
          );
        })}
      </div>
    </>
  );
}
