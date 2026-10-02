import type { Metadata } from "next";
import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";
import { TrackView } from "@/components/analytics/Track";
import { ProductListing } from "@/components/catalog/ProductListing";
import { PageHeader } from "@/components/layout/PageHeader";
import { CategoryIcon } from "@/components/ui/CategoryIcon";
import { categoryCounts, categoryPath, dedicatedCategoryPaths, loadCatalog, resolveCategory } from "@/lib/catalog/catalog";
import { pageMetadata, type Crumb } from "@/lib/seo";

export async function generateMetadata(props: PageProps<"/categories/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const { groups } = await loadCatalog();
  const cat = resolveCategory(groups, slug);
  if (!cat) return { title: "Category not found", robots: { index: false } };
  const description = cat.sub
    ? `Motorcycle ${cat.sub.name.toLowerCase()} for Bajaj, Honda, Yamaha, Suzuki, TVS, Hero and Runner bikes at Nirob Autos, Madhupur.`
    : `${cat.group.description} Motorcycle ${cat.group.name.toLowerCase()} at Nirob Autos, Madhupur.`;
  return pageMetadata({ title: `Motorcycle ${cat.name}`, description, path: `/categories/${slug}` });
}

export default async function CategoryPage(props: PageProps<"/categories/[slug]">) {
  const [{ slug }, searchParams] = await Promise.all([props.params, props.searchParams]);
  if (dedicatedCategoryPaths[slug]) permanentRedirect(dedicatedCategoryPaths[slug]);

  const catalog = await loadCatalog();
  const cat = resolveCategory(catalog.groups, slug);
  if (!cat) notFound();

  const counts = categoryCounts(catalog.products);
  const crumbs: Crumb[] = [
    { label: "Categories", href: "/categories" },
    ...(cat.sub ? [{ label: cat.group.name, href: categoryPath(cat.group.slug) }] : []),
    { label: cat.name, href: `/categories/${slug}` },
  ];

  return (
    <>
      <TrackView event="category_view" props={{ category: slug }} />
      <PageHeader
        title={`Motorcycle ${cat.name}`}
        crumbs={crumbs}
        description={
          cat.sub
            ? `${cat.sub.name} in our ${cat.group.name.toLowerCase()} range. Use the filters to narrow by bike brand or model.`
            : cat.group.description
        }
      >
        {!cat.sub && (
          <ul className="mt-5 flex flex-wrap gap-2" aria-label={`${cat.group.name} types`}>
            {cat.group.subcategories.map((s) => {
              const n = counts.get(s.slug) ?? 0;
              return (
                <li key={s.slug}>
                  <Link href={`/categories/${s.slug}`} className="chip">
                    {s.name}
                    {n > 0 && <span className="text-xs text-muted">{n}</span>}
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
        {cat.sub && (
          <p className="mt-3 inline-flex items-center gap-2 text-sm text-muted">
            <CategoryIcon name={cat.group.icon} className="size-4" />
            Part of{" "}
            <Link href={categoryPath(cat.group.slug)} className="font-semibold text-brand underline">
              {cat.group.name}
            </Link>
          </p>
        )}
      </PageHeader>
      <div className="container-page py-6">
        <ProductListing
          basePath={`/categories/${slug}`}
          searchParams={searchParams}
          scope={{ category: slug }}
          emptyTitle={`No ${cat.name.toLowerCase()} listed yet`}
        />
      </div>
    </>
  );
}
