"use client";

import Form from "next/form";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { Bike, History, LayoutGrid, Package, Search, X } from "lucide-react";
import { BikeArt } from "@/components/bikes/BikeArt";
import { PartArt } from "@/components/parts/PartArt";
import { CategoryIcon } from "@/components/ui/CategoryIcon";
import { track } from "@/lib/analytics";
import { cx } from "@/lib/cx";
import type { Suggestion } from "@/lib/catalog/search";

const RECENT_KEY = "nirob-autos:recent-searches";
const MAX_RECENT = 5;

function readRecent(): string[] {
  try {
    const raw = JSON.parse(window.localStorage.getItem(RECENT_KEY) ?? "[]");
    return Array.isArray(raw) ? raw.filter((s): s is string => typeof s === "string").slice(0, MAX_RECENT) : [];
  } catch {
    return [];
  }
}

function saveRecent(query: string) {
  try {
    const next = [query, ...readRecent().filter((q) => q.toLowerCase() !== query.toLowerCase())].slice(0, MAX_RECENT);
    window.localStorage.setItem(RECENT_KEY, JSON.stringify(next));
  } catch {
    // Storage unavailable; recent searches are a convenience only.
  }
}

const kindIcon = { product: Package, model: Bike, category: LayoutGrid, search: Search } as const;

/** Thumbnail for a suggestion row: product/category photo, part illustration, bike drawing (models only) or icon. */
function SuggestionThumbnail({ s, recent }: { s: Suggestion; recent: boolean }) {
  const Icon = recent ? History : kindIcon[s.kind];
  const box = "suggest-thumb grid size-10 shrink-0 place-items-center overflow-hidden rounded-md";
  if (!recent && s.thumb?.kind === "photo") {
    return (
      <span className={cx(box, "relative bg-graphite")}>
        <Image src={s.thumb.src} alt="" fill sizes="40px" className="object-cover" />
      </span>
    );
  }
  if (!recent && s.thumb?.kind === "art") {
    return (
      <span className={cx(box, "blueprint text-on-dark")}>
        <PartArt kind={s.thumb.art} className="w-9" />
      </span>
    );
  }
  if (!recent && s.thumb?.kind === "bike") {
    return (
      <span className={cx(box, "blueprint text-on-dark")}>
        <BikeArt bikeClass={s.thumb.bikeClass} className="w-9" />
      </span>
    );
  }
  if (!recent && s.thumb?.kind === "icon") {
    return (
      <span className={cx(box, "bg-graphite text-brand-bright")}>
        <CategoryIcon name={s.thumb.icon} className="size-5" />
      </span>
    );
  }
  return (
    <span className={cx(box, "bg-canvas text-muted")}>
      <Icon className="size-4" aria-hidden="true" />
    </span>
  );
}

/**
 * Search box with instant suggestions (models, categories, products) and recent searches.
 * Implements the ARIA combobox pattern; works as a plain GET form without JavaScript.
 */
export function SearchBar({
  defaultValue = "",
  size = "md",
  autoFocus = false,
  className,
  inputId,
}: {
  defaultValue?: string;
  size?: "md" | "lg";
  autoFocus?: boolean;
  className?: string;
  /** Fixed id for the input, so another control can focus it (the phone header's search button). */
  inputId?: string;
}) {
  const router = useRouter();
  const id = useId();
  const fieldId = inputId ?? `${id}-input`;
  const listId = `${id}-list`;
  const [query, setQuery] = useState(defaultValue);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [recent, setRecent] = useState<string[]>([]);
  const rootRef = useRef<HTMLDivElement>(null);

  // Fetch suggestions, debounced; stale responses are ignored.
  useEffect(() => {
    const q = query.trim();
    if (q.length < 2) return;
    const controller = new AbortController();
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/suggest?q=${encodeURIComponent(q)}`, { signal: controller.signal });
        if (!res.ok) return;
        const data = (await res.json()) as { suggestions: Suggestion[] };
        setSuggestions(data.suggestions);
        setActive(-1);
      } catch {
        // Aborted or offline: keep the previous suggestions.
      }
    }, 150);
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [query]);

  useEffect(() => {
    const onDown = (e: PointerEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", onDown);
    return () => document.removeEventListener("pointerdown", onDown);
  }, []);

  const showingRecent = query.trim().length < 2;
  const items: Suggestion[] = showingRecent
    ? recent.map((r) => ({ kind: "search" as const, label: r, href: `/search?q=${encodeURIComponent(r)}` }))
    : suggestions;
  const expanded = open && items.length > 0;

  const go = (s: Suggestion) => {
    setOpen(false);
    const q = showingRecent ? s.label : query.trim();
    if (q) saveRecent(q);
    // The results page records its own search event; record jumps straight to a product, model or category here.
    if (q && !s.href.startsWith("/search")) track("product_search", { query: q, source: "suggestion" });
    router.push(s.href);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setOpen(true);
      setActive((a) => (items.length ? (a + 1) % items.length : -1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => (items.length ? (a - 1 + items.length) % items.length : -1));
    } else if (e.key === "Escape") {
      setOpen(false);
      setActive(-1);
    } else if (e.key === "Enter" && expanded && active >= 0) {
      e.preventDefault();
      go(items[active]);
    }
  };

  const tall = size === "lg";

  return (
    <div ref={rootRef} className={cx("relative", className)}>
      <Form
        action="/search"
        role="search"
        onSubmit={() => {
          const q = query.trim();
          if (q) saveRecent(q);
          setOpen(false);
        }}
      >
        <label htmlFor={fieldId} className="sr-only">
          Search for parts, products, bike models or part numbers
        </label>
        <div className="relative">
          <Search
            className={cx("pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted", tall ? "size-5" : "size-4")}
            aria-hidden="true"
          />
          <input
            id={fieldId}
            name="q"
            type="search"
            role="combobox"
            aria-expanded={expanded}
            aria-controls={listId}
            aria-autocomplete="list"
            aria-activedescendant={expanded && active >= 0 ? `${id}-opt-${active}` : undefined}
            autoComplete="off"
            enterKeyHint="search"
            autoFocus={autoFocus}
            maxLength={120}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setOpen(true);
              if (e.target.value.trim().length < 2) setSuggestions([]);
            }}
            onFocus={() => {
              setRecent(readRecent());
              setOpen(true);
            }}
            onKeyDown={onKeyDown}
            placeholder="Search parts, bike models, brands or part numbers…"
            className={cx(
              "w-full rounded-lg border border-line-strong bg-surface pl-10 pr-24 text-ink transition-[border-color,box-shadow] duration-fast ease-ui placeholder:text-muted focus:border-ink focus:shadow-[0_0_0_4px_rgb(242_107_33/0.2)]",
              tall ? "h-14 text-base" : "h-11 text-base",
            )}
          />
          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery("");
                setSuggestions([]);
              }}
              className="absolute right-[4.75rem] top-1/2 grid size-8 -translate-y-1/2 place-items-center rounded-full text-muted hover:bg-steel-soft hover:text-ink"
              aria-label="Clear search"
            >
              <X className="size-4" aria-hidden="true" />
            </button>
          )}
          <button
            type="submit"
            className={cx(
              "btn btn-primary absolute right-1 top-1/2 -translate-y-1/2",
              tall ? "min-h-12 px-4" : "min-h-9 px-3 text-sm",
            )}
          >
            Search
          </button>
        </div>
      </Form>

      <ul
        id={listId}
        role="listbox"
        aria-label={showingRecent ? "Recent searches" : "Suggestions"}
        data-open={expanded ? "" : undefined}
        className="suggest-panel absolute inset-x-0 top-full z-(--z-dropdown) mt-1.5 max-h-[70vh] overflow-y-auto rounded-lg border border-line bg-surface py-1 text-ink shadow-float"
      >
        {showingRecent && (
          <li role="presentation" className="px-3 pb-1 pt-2 text-xs font-semibold uppercase tracking-wide text-muted">
            Recent searches
          </li>
        )}
        {items.map((s, i) => {
          return (
            <li
              key={`${s.href}-${i}`}
              id={`${id}-opt-${i}`}
              role="option"
              aria-selected={i === active}
              onPointerDown={(e) => e.preventDefault()}
              onClick={() => go(s)}
              onPointerMove={() => setActive(i)}
              className={cx("flex min-h-12 cursor-pointer items-center gap-3 px-3 py-1.5 transition-colors duration-fast", i === active && "bg-steel-soft")}
            >
              <SuggestionThumbnail s={s} recent={showingRecent} />
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm text-ink">{s.label}</span>
                {s.sublabel && <span className="block truncate text-xs text-muted">{s.sublabel}</span>}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
