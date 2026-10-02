"use client";

import Form from "next/form";
import { useRouter } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { Bike, History, LayoutGrid, Package, Search, X } from "lucide-react";
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

const kindIcon = { product: Package, model: Bike, category: LayoutGrid } as const;

/**
 * Search box with instant suggestions (models, categories, products) and recent searches.
 * Implements the ARIA combobox pattern; works as a plain GET form without JavaScript.
 */
export function SearchBar({
  defaultValue = "",
  size = "md",
  autoFocus = false,
  className,
}: {
  defaultValue?: string;
  size?: "md" | "lg";
  autoFocus?: boolean;
  className?: string;
}) {
  const router = useRouter();
  const id = useId();
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
    ? recent.map((r) => ({ kind: "product" as const, label: r, href: `/search?q=${encodeURIComponent(r)}` }))
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
        <label htmlFor={`${id}-input`} className="sr-only">
          Search for parts, products, bike models or part numbers
        </label>
        <div className="relative">
          <Search
            className={cx("pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted", tall ? "size-5" : "size-4")}
            aria-hidden="true"
          />
          <input
            id={`${id}-input`}
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
            placeholder="Search parts, bike models or part numbers"
            className={cx(
              "w-full rounded-lg border border-line-strong bg-surface pl-10 pr-24 text-ink placeholder:text-muted focus:border-ink",
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
        hidden={!expanded}
        className="absolute inset-x-0 top-full z-50 mt-1 max-h-[70vh] overflow-y-auto rounded-lg border border-line bg-surface py-1 shadow-lg"
      >
        {showingRecent && (
          <li role="presentation" className="px-3 pb-1 pt-2 text-xs font-semibold uppercase tracking-wide text-muted">
            Recent searches
          </li>
        )}
        {items.map((s, i) => {
          const Icon = showingRecent ? History : kindIcon[s.kind];
          return (
            <li
              key={`${s.href}-${i}`}
              id={`${id}-opt-${i}`}
              role="option"
              aria-selected={i === active}
              onPointerDown={(e) => e.preventDefault()}
              onClick={() => go(s)}
              onPointerMove={() => setActive(i)}
              className={cx("flex min-h-11 cursor-pointer items-center gap-3 px-3 py-2", i === active && "bg-steel-soft")}
            >
              <Icon className="size-4 shrink-0 text-muted" aria-hidden="true" />
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
