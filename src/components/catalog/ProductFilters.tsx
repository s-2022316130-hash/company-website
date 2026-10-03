"use client";

import Form from "next/form";
import { useId, useRef, useState } from "react";
import { SlidersHorizontal, X } from "lucide-react";
import { track } from "@/lib/analytics";
import type { Facets, FacetOption } from "@/lib/catalog/listing";

interface FilterFormProps {
  facets: Facets;
  basePath: string;
  /** Params carried through unchanged (search query, sort). */
  carry: { q?: string; sort?: string };
  price: { min?: number; max?: number };
  /** Sidebar applies on every change; the drawer applies when "Show results" is pressed. */
  mode: "sidebar" | "drawer";
  onApplied?: () => void;
}

function FilterForm({ facets, basePath, carry, price, mode, onApplied }: FilterFormProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const id = useId();

  const onChange = (e: React.FormEvent<HTMLFormElement>) => {
    const target = e.target as HTMLInputElement;
    track("filter_used", { filter: target.name, value: target.value, checked: target.checked });
    if (mode === "sidebar" && target.type === "checkbox") formRef.current?.requestSubmit();
  };

  return (
    <Form
      ref={formRef}
      action={basePath}
      scroll={false}
      onChange={onChange}
      onSubmit={() => onApplied?.()}
      className="space-y-5"
      aria-label="Filter products"
    >
      {carry.q && <input type="hidden" name="q" value={carry.q} />}
      {carry.sort && <input type="hidden" name="sort" value={carry.sort} />}

      <FacetGroup legend="Motorcycle brand" name="brand" options={facets.brands} idPrefix={`${id}-brand`} />
      <FacetGroup legend="Motorcycle model" name="model" options={facets.models} idPrefix={`${id}-model`} scroll />
      <FacetGroup legend="Category" name="category" options={facets.categories} idPrefix={`${id}-cat`} scroll />
      <FacetGroup legend="Product type" name="type" options={facets.types} idPrefix={`${id}-type`} />
      <FacetGroup legend="Availability" name="availability" options={facets.availability} idPrefix={`${id}-avail`} />
      <FacetGroup legend="Fitment" name="fit" options={facets.fitment} idPrefix={`${id}-fit`} />

      {facets.price && (
        <fieldset>
          <legend className="mb-2 text-sm font-semibold text-ink">Price (৳)</legend>
          <div className="grid grid-cols-2 gap-2">
            <label className="text-xs text-muted">
              Min
              <input
                className="input mt-1"
                type="number"
                inputMode="numeric"
                name="min"
                min={0}
                placeholder={String(facets.price.min)}
                defaultValue={price.min}
              />
            </label>
            <label className="text-xs text-muted">
              Max
              <input
                className="input mt-1"
                type="number"
                inputMode="numeric"
                name="max"
                min={0}
                placeholder={String(facets.price.max)}
                defaultValue={price.max}
              />
            </label>
          </div>
        </fieldset>
      )}

      {/* Sidebar: needed for the price inputs and when JavaScript is off. Drawer: the main apply button, pinned in view. */}
      {mode === "drawer" ? (
        <div className="sticky bottom-0 -mx-4 border-t border-line bg-surface px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3">
          <button type="submit" className="btn btn-primary btn-lg w-full">
            Show results
          </button>
        </div>
      ) : (
        <button type="submit" className="btn btn-outline btn-sm w-full">
          Apply filters
        </button>
      )}
    </Form>
  );
}

function FacetGroup({
  legend,
  name,
  options,
  idPrefix,
  scroll = false,
}: {
  legend: string;
  name: string;
  options: FacetOption[];
  idPrefix: string;
  scroll?: boolean;
}) {
  if (options.length === 0) return null;
  return (
    <fieldset>
      <legend className="mb-2 text-sm font-semibold text-ink">{legend}</legend>
      <ul className={scroll ? "max-h-64 space-y-0.5 overflow-y-auto pr-1" : "space-y-0.5"}>
        {options.map((o) => {
          const inputId = `${idPrefix}-${o.value}`;
          return (
            <li key={o.value}>
              <label
                htmlFor={inputId}
                className="flex min-h-10 cursor-pointer items-center gap-2.5 rounded-md px-1 text-sm hover:bg-steel-soft"
              >
                <input
                  id={inputId}
                  type="checkbox"
                  name={name}
                  value={o.value}
                  defaultChecked={o.selected}
                  className="size-4 shrink-0 accent-brand"
                />
                <span className="min-w-0 flex-1 truncate text-ink">{o.label}</span>
                <span className="text-xs tabular-nums text-muted">{o.count}</span>
              </label>
            </li>
          );
        })}
      </ul>
    </fieldset>
  );
}

/** Desktop sidebar. Remounts when the URL changes so checkboxes always reflect the current filters. */
export function FilterSidebar(props: Omit<FilterFormProps, "mode" | "onApplied"> & { stateKey: string }) {
  const { stateKey, ...rest } = props;
  return (
    <div key={stateKey}>
      <FilterForm {...rest} mode="sidebar" />
    </div>
  );
}

/** Mobile: a button that opens the same filters in a modal drawer. */
export function FilterDrawer(props: Omit<FilterFormProps, "mode" | "onApplied"> & { activeCount: number; stateKey: string }) {
  const { activeCount, stateKey, ...rest } = props;
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState(false);
  const titleId = useId();

  const close = () => dialogRef.current?.close();

  return (
    <>
      <button
        type="button"
        className="btn btn-outline btn-sm"
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => {
          dialogRef.current?.showModal();
          setOpen(true);
        }}
      >
        <SlidersHorizontal className="size-4" aria-hidden="true" />
        Filters
        {activeCount > 0 && (
          <span className="grid min-w-5 place-items-center rounded-full bg-brand px-1 text-xs text-white">{activeCount}</span>
        )}
      </button>
      <dialog
        ref={dialogRef}
        aria-labelledby={titleId}
        onClose={() => setOpen(false)}
        onClick={(e) => {
          if (e.target === dialogRef.current) close();
        }}
        className="dialog-motion sheet m-0 mt-auto max-h-[85dvh] w-full max-w-none rounded-t-xl bg-surface p-0 text-ink shadow-modal sm:m-auto sm:max-w-md sm:rounded-xl"
      >
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-line bg-surface px-4 py-3">
          <h2 id={titleId} className="font-display text-lg font-bold">
            Filter products
          </h2>
          <button type="button" className="btn btn-ghost btn-sm -mr-2" onClick={close} aria-label="Close filters">
            <X className="size-5" aria-hidden="true" />
          </button>
        </div>
        <div className="px-4 pt-4" key={stateKey}>
          <FilterForm {...rest} mode="drawer" onApplied={close} />
        </div>
      </dialog>
    </>
  );
}
