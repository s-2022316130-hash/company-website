"use client";

import { useId, useMemo, useState } from "react";
import { Search, X } from "lucide-react";
import { normalize } from "@/lib/catalog/search";
import { cx } from "@/lib/cx";
import type { MotorcycleModel } from "@/lib/types";
import { ModelCard } from "./DirectoryCards";

export interface DirectoryEntry {
  model: MotorcycleModel;
  brandName: string;
  productCount: number;
  categories: string[];
}

/**
 * Motorcycle directory with instant search and brand tabs. Server-renders every model so it
 * works without JavaScript; the brand tab is mirrored to ?brand= so filtered views can be shared.
 */
export function ModelDirectory({
  entries,
  brands,
  initialBrand,
}: {
  entries: DirectoryEntry[];
  brands: { slug: string; name: string }[];
  initialBrand?: string;
}) {
  const id = useId();
  const [brand, setBrand] = useState(initialBrand && brands.some((b) => b.slug === initialBrand) ? initialBrand : "");
  const [query, setQuery] = useState("");
  const [showOther, setShowOther] = useState(false);

  const pickBrand = (slug: string) => {
    setBrand(slug);
    const url = new URL(window.location.href);
    if (slug) url.searchParams.set("brand", slug);
    else url.searchParams.delete("brand");
    window.history.replaceState(null, "", url);
  };

  const normalizedQuery = normalize(query);
  const tokens = useMemo(() => normalizedQuery.split(" ").filter(Boolean), [normalizedQuery]);
  const matches = useMemo(
    () =>
      entries.filter(({ model, brandName }) => {
        if (brand && model.brand !== brand) return false;
        if (tokens.length === 0) return true;
        const hay = normalize([brandName, model.name, ...(model.aliases ?? [])].join(" ")).split(" ");
        return tokens.every((t) => hay.some((h) => h.startsWith(t)));
      }),
    [entries, brand, tokens],
  );
  const main = matches.filter((e) => e.model.status !== "official-other");
  const other = matches.filter((e) => e.model.status === "official-other");
  const shown = showOther || tokens.length > 0 ? [...main, ...other] : main;

  return (
    <div>
      <div className="card sticky-below-header z-(--z-raised) flex flex-col gap-3 p-3 shadow-float">
        <div className="relative">
          <label htmlFor={`${id}-q`} className="sr-only">
            Search your motorcycle
          </label>
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted" aria-hidden="true" />
          <input
            id={`${id}-q`}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search your motorcycle, e.g. FZS V4, Pulsar 150, Gixxer SF"
            className="input pl-9 pr-10"
            autoComplete="off"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="absolute right-2 top-1/2 grid size-8 -translate-y-1/2 place-items-center rounded-full text-muted hover:bg-steel-soft"
              aria-label="Clear search"
            >
              <X className="size-4" aria-hidden="true" />
            </button>
          )}
        </div>
        <div role="tablist" aria-label="Filter by brand" className="scrollbar-none -mx-1 flex gap-1.5 overflow-x-auto px-1">
          {[{ slug: "", name: "All brands" }, ...brands].map((b) => (
            <button
              key={b.slug || "all"}
              type="button"
              role="tab"
              aria-selected={brand === b.slug}
              onClick={() => pickBrand(b.slug)}
              className={cx(
                "chip shrink-0 font-display text-[0.9375rem] font-semibold uppercase tracking-[0.06em]",
                brand === b.slug && "border-graphite bg-graphite text-white hover:border-graphite",
              )}
            >
              {b.name}
            </button>
          ))}
        </div>
      </div>

      <p className="mt-4 text-sm text-muted" aria-live="polite">
        {shown.length === 1 ? "1 motorcycle" : `${shown.length} motorcycles`}
        {tokens.length === 0 && !showOther && other.length > 0 && ` (plus ${other.length} outside the Bangladesh line-up)`}
      </p>

      {shown.length > 0 ? (
        <ul className="mt-3 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
          {shown.map((e) => (
            <li key={e.model.id}>
              <ModelCard model={e.model} brandName={e.brandName} productCount={e.productCount} categories={e.categories} />
            </li>
          ))}
        </ul>
      ) : (
        <div className="card mt-3 p-8 text-center">
          <p className="display text-2xl text-ink">No motorcycle matches “{query}”</p>
          <p className="mt-1 text-sm text-muted">Check the spelling or try just the model number, like “150” or “V4”. Not listed? Call us.</p>
        </div>
      )}

      {tokens.length === 0 && other.length > 0 && (
        <div className="mt-6 text-center">
          <button type="button" className="btn btn-outline max-w-full whitespace-normal py-2" onClick={() => setShowOther((v) => !v)} aria-expanded={showOther}>
            {showOther ? "Hide models outside the Bangladesh line-up" : `Show ${other.length} models outside the Bangladesh line-up`}
          </button>
        </div>
      )}
    </div>
  );
}
