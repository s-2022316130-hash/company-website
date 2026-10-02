import type { Metadata } from "next";
import Link from "next/link";
import { TrackView } from "@/components/analytics/Track";
import { ProductListing } from "@/components/catalog/ProductListing";
import { PageHeader } from "@/components/layout/PageHeader";
import { SearchBar } from "@/components/search/SearchBar";
import { loadCatalog } from "@/lib/catalog/catalog";
import { suggestDirectory } from "@/lib/catalog/search";

export async function generateMetadata(props: PageProps<"/search">): Promise<Metadata> {
  const { q } = await props.searchParams;
  const query = (Array.isArray(q) ? q[0] : q)?.trim();
  return {
    title: query ? `Search: ${query.slice(0, 60)}` : "Search parts",
    // Search result pages are not indexed; product, model and category pages are.
    robots: { index: false, follow: true },
    alternates: { canonical: "/search" },
  };
}

export default async function SearchPage(props: PageProps<"/search">) {
  const [searchParams, catalog] = await Promise.all([props.searchParams, loadCatalog()]);
  const raw = searchParams.q;
  const q = ((Array.isArray(raw) ? raw[0] : raw) ?? "").trim().slice(0, 120);
  const shortcuts = q ? suggestDirectory(q, catalog.models, catalog.brandBySlug, catalog.groups, 4) : [];

  return (
    <>
      <PageHeader
        title={q ? `Results for “${q}”` : "Search parts"}
        crumbs={[{ label: "Search", href: "/search" }]}
      >
        <SearchBar key={q} defaultValue={q} size="lg" className="mt-4 max-w-2xl" autoFocus={!q} />
        {shortcuts.length > 0 && (
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className="text-sm text-on-dark-muted">Go straight to:</span>
            {shortcuts.map((s) => (
              <Link key={s.href} href={s.href} className="chip chip-dark">
                {s.label}
              </Link>
            ))}
          </div>
        )}
      </PageHeader>
      <div className="container-page py-6">
        {q ? (
          <>
            <TrackView event="product_search" props={{ query: q, source: "results_page" }} />
            <ProductListing basePath="/search" searchParams={searchParams} />
          </>
        ) : (
          <p className="text-muted">
            Type a part name, motorcycle model or part number above. For example “Pulsar 150 brake pad” or “FZS chain
            sprocket”.
          </p>
        )}
      </div>
    </>
  );
}
