import Link from "next/link";
import { ChevronLeft, ChevronRight, Info, X } from "lucide-react";
import { CallButton } from "@/components/contact/ContactActions";
import { EmptyState } from "@/components/ui/EmptyState";
import { loadCatalog } from "@/lib/catalog/catalog";
import {
  hasFacets,
  listingHref,
  parseListingParams,
  runListing,
  sortLabels,
  type ListingParams,
  type ListingResult,
  type ListingScope,
} from "@/lib/catalog/listing";
import { pluralize } from "@/lib/format";
import { ProductGrid } from "./ProductCard";
import { FilterDrawer, FilterSidebar } from "./ProductFilters";
import { SortSelect } from "./SortSelect";

type RawParams = Record<string, string | string[] | undefined>;

/**
 * Full listing: filters, sort, active-filter chips, product grid, pagination and
 * empty states. Rendered on the server from URL params.
 */
export async function ProductListing({
  basePath,
  searchParams,
  scope = {},
  emptyTitle = "No products listed here yet",
  emptyDescription = "The online catalogue is still being filled in. Call or WhatsApp the store and ask; the part may be in stock.",
}: {
  basePath: string;
  searchParams: RawParams;
  scope?: ListingScope;
  emptyTitle?: string;
  emptyDescription?: string;
}) {
  const catalog = await loadCatalog();
  const params = parseListingParams(searchParams);
  const result = runListing(catalog, params, scope);
  const stateKey = listingHref("", params);
  const showFacets = hasFacets(result.facets);
  const filterProps = {
    facets: result.facets,
    basePath,
    carry: { q: params.q || undefined, sort: params.sort },
    price: { min: params.minPrice, max: params.maxPrice },
    stateKey,
  };

  return (
    <div className={showFacets ? "grid gap-6 lg:grid-cols-[15rem_minmax(0,1fr)]" : ""}>
      {showFacets && (
        <aside className="hidden lg:block" aria-labelledby="filters-heading">
          <div className="card sticky top-36 p-4">
            <h2 id="filters-heading" className="mb-4 font-display text-lg font-bold">
              Filters
            </h2>
            <FilterSidebar {...filterProps} />
          </div>
        </aside>
      )}

      <div className="min-w-0">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-muted" aria-live="polite">
            {pluralize(result.total, "product")}
            {params.q && (
              <>
                {" "}
                for <span className="font-semibold text-ink">“{params.q}”</span>
              </>
            )}
          </p>
          <div className="flex flex-wrap items-center gap-2">
            {showFacets && (
              <div className="lg:hidden">
                <FilterDrawer {...filterProps} activeCount={result.activeFilterCount} />
              </div>
            )}
            <SortSelect
              key={result.sort}
              basePath={basePath}
              value={result.sort}
              options={result.sortOptions.map((s) => ({ value: s, label: sortLabels[s] }))}
              hidden={hiddenFields(params)}
            />
          </div>
        </div>

        <ActiveFilters basePath={basePath} params={params} result={result} />

        {result.searchMode === "partial" && result.total > 0 && (
          <p className="mb-4 flex gap-2 rounded-lg border border-line bg-surface p-3 text-sm text-ink">
            <Info className="mt-0.5 size-4 shrink-0 text-steel" aria-hidden="true" />
            No product matched every word, so these are the closest matches. Try fewer words, or search by bike model or
            part name.
          </p>
        )}

        {result.total === 0 ? (
          <ListingEmpty
            basePath={basePath}
            params={params}
            filtered={result.activeFilterCount > 0}
            title={emptyTitle}
            description={emptyDescription}
          />
        ) : (
          <>
            <ProductGrid products={result.items} priorityCount={4} />
            <Pagination basePath={basePath} params={params} page={result.page} pageCount={result.pageCount} />
          </>
        )}
      </div>
    </div>
  );
}

function hiddenFields(params: ListingParams): [string, string][] {
  const fields: [string, string][] = [];
  if (params.q) fields.push(["q", params.q]);
  params.brands.forEach((v) => fields.push(["brand", v]));
  params.models.forEach((v) => fields.push(["model", v]));
  params.categories.forEach((v) => fields.push(["category", v]));
  params.types.forEach((v) => fields.push(["type", v]));
  params.availability.forEach((v) => fields.push(["availability", v]));
  params.fitment.forEach((v) => fields.push(["fit", v]));
  if (params.minPrice !== undefined) fields.push(["min", String(params.minPrice)]);
  if (params.maxPrice !== undefined) fields.push(["max", String(params.maxPrice)]);
  return fields;
}

function ActiveFilters({ basePath, params, result }: { basePath: string; params: ListingParams; result: ListingResult }) {
  const { facets } = result;
  const chips: { label: string; href: string }[] = [];
  const add = (key: "brand" | "model" | "category" | "type" | "availability" | "fit", current: string[], options: typeof facets.brands) => {
    for (const o of options) {
      if (!o.selected) continue;
      chips.push({
        label: o.label,
        href: listingHref(basePath, params, { [key]: current.filter((v) => v !== o.value), page: undefined }),
      });
    }
  };
  add("brand", params.brands, facets.brands);
  add("model", params.models, facets.models);
  add("category", params.categories, facets.categories);
  add("type", params.types, facets.types);
  add("availability", params.availability, facets.availability);
  add("fit", params.fitment, facets.fitment);
  if (facets.price && (params.minPrice !== undefined || params.maxPrice !== undefined)) {
    chips.push({
      label: `৳${params.minPrice ?? facets.price.min} – ৳${params.maxPrice ?? facets.price.max}`,
      href: listingHref(basePath, params, { min: undefined, max: undefined, page: undefined }),
    });
  }
  if (chips.length === 0) return null;

  const clearAll = listingHref(basePath, params, {
    brand: undefined,
    model: undefined,
    category: undefined,
    type: undefined,
    availability: undefined,
    fit: undefined,
    min: undefined,
    max: undefined,
    page: undefined,
  });

  return (
    <ul className="mb-4 flex flex-wrap items-center gap-2" aria-label="Active filters">
      {chips.map((c) => (
        <li key={c.href}>
          <Link href={c.href} scroll={false} className="chip border-ink bg-steel-soft" aria-label={`Remove filter: ${c.label}`}>
            {c.label}
            <X className="size-3.5" aria-hidden="true" />
          </Link>
        </li>
      ))}
      <li>
        <Link href={clearAll} scroll={false} className="inline-flex min-h-10 items-center px-2 text-sm font-semibold text-brand underline">
          Clear all
        </Link>
      </li>
    </ul>
  );
}

function ListingEmpty({
  basePath,
  params,
  filtered,
  title,
  description,
}: {
  basePath: string;
  params: ListingParams;
  filtered: boolean;
  title: string;
  description: string;
}) {
  if (filtered) {
    return (
      <EmptyState
        title="No parts match these filters"
        description="Remove a filter to see more products."
        actions={[
          {
            label: "Clear filters",
            href: listingHref(basePath, { ...params, brands: [], models: [], categories: [], types: [], availability: [], minPrice: undefined, maxPrice: undefined, page: 1 }),
          },
        ]}
      />
    );
  }
  if (params.q) {
    return (
      <EmptyState
        title="No matching parts found"
        description="Try another part name, motorcycle model, or category. You can also ask the store directly."
        actions={[
          { label: "Find parts by bike", href: "/part-finder" },
          { label: "Browse categories", href: "/categories", variant: "outline" },
        ]}
      >
        <div className="mt-4">
          <CallButton variant="outline" />
        </div>
      </EmptyState>
    );
  }
  return (
    <EmptyState
      title={title}
      description={description}
      actions={[{ label: "Browse all products", href: "/shop", variant: "outline" }]}
    >
      <div className="mt-4">
        <CallButton />
      </div>
    </EmptyState>
  );
}

function Pagination({
  basePath,
  params,
  page,
  pageCount,
}: {
  basePath: string;
  params: ListingParams;
  page: number;
  pageCount: number;
}) {
  if (pageCount <= 1) return null;
  const href = (p: number) => listingHref(basePath, params, { page: p > 1 ? String(p) : undefined });
  return (
    <nav aria-label="Pagination" className="mt-8 flex items-center justify-center gap-3">
      {page > 1 ? (
        <Link href={href(page - 1)} className="btn btn-outline btn-sm" rel="prev">
          <ChevronLeft className="size-4" aria-hidden="true" /> Previous
        </Link>
      ) : (
        <span className="btn btn-outline btn-sm opacity-40" aria-disabled="true">
          <ChevronLeft className="size-4" aria-hidden="true" /> Previous
        </span>
      )}
      <span className="text-sm text-muted">
        Page {page} of {pageCount}
      </span>
      {page < pageCount ? (
        <Link href={href(page + 1)} className="btn btn-outline btn-sm" rel="next">
          Next <ChevronRight className="size-4" aria-hidden="true" />
        </Link>
      ) : (
        <span className="btn btn-outline btn-sm opacity-40" aria-disabled="true">
          Next <ChevronRight className="size-4" aria-hidden="true" />
        </span>
      )}
    </nav>
  );
}
