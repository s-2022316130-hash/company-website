"use client";

import { useRouter } from "next/navigation";
import { useId, useState } from "react";
import { ArrowRight, Check } from "lucide-react";
import { BikeArt, bikeClassLabel } from "@/components/bikes/BikeArt";
import { GaugeArc } from "@/components/ui/Mechanical";
import { cx } from "@/lib/cx";
import type { BikeClass } from "@/lib/types";

/** Step number that turns into a check once the step is done. */
function StepMark({ n, done }: { n: string; done: boolean }) {
  return done ? (
    <Check className="inline size-4 animate-check-in align-[-2px] text-brand-bright" aria-hidden="true" />
  ) : (
    <span className="text-brand-bright">{n}</span>
  );
}

export interface FinderModel {
  id: string;
  brand: string;
  name: string;
  class: BikeClass;
}

/**
 * Brand → model → part type picker that leads into the part finder, with a live drawing
 * of the chosen bike's body style. Works as a plain GET form without JavaScript.
 */
export function BikeFinder({
  brands,
  models,
  categories,
}: {
  brands: { slug: string; name: string; bikeClass: BikeClass }[];
  models: FinderModel[];
  categories: { slug: string; name: string }[];
}) {
  const router = useRouter();
  const id = useId();
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [category, setCategory] = useState("all");
  const brandModels = models.filter((m) => m.brand === brand);
  const selectedModel = models.find((m) => m.id === model);
  const selectedBrand = brands.find((b) => b.slug === brand);
  const previewClass: BikeClass = selectedModel?.class ?? selectedBrand?.bikeClass ?? "street";
  const previewName = selectedModel
    ? `${selectedBrand?.name ?? ""} ${selectedModel.name}`
    : selectedBrand
      ? `${selectedBrand.name} motorcycle`
      : "Your motorcycle";

  return (
    <form
      action="/part-finder"
      method="get"
      onSubmit={(e) => {
        e.preventDefault();
        const qs = new URLSearchParams();
        if (brand) qs.set("brand", brand);
        if (model) qs.set("model", model);
        if (model && category) qs.set("category", category);
        router.push(`/part-finder${qs.size ? `?${qs}` : ""}`);
      }}
      className="blueprint relative grid overflow-hidden rounded-xl text-on-dark shadow-feature ring-1 ring-white/10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]"
      aria-labelledby={`${id}-title`}
    >
      <div className="space-y-5 p-5 sm:p-7">
        <div>
          <p className="eyebrow eyebrow-dark">Part finder</p>
          <h2 id={`${id}-title`} className="display mt-1 text-3xl text-white sm:text-4xl">
            Find parts by motorcycle
          </h2>
          <p className="mt-1.5 text-sm text-on-dark-muted">Choose your bike, then the part you need.</p>
        </div>

        <fieldset>
          <legend className="mb-2 font-display text-sm font-semibold uppercase tracking-[0.12em] text-on-dark-muted">
            <StepMark n="01" done={Boolean(brand)} /> Brand
          </legend>
          <div className="flex flex-wrap gap-2">
            {brands.map((b) => (
              <label
                key={b.slug}
                className={cx(
                  "chip chip-dark cursor-pointer select-none has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-focus",
                  brand === b.slug && "border-brand-bright bg-brand-bright/15 text-white hover:border-brand-bright",
                )}
              >
                <input
                  type="radio"
                  name="brand"
                  value={b.slug}
                  checked={brand === b.slug}
                  onChange={() => {
                    setBrand(b.slug);
                    setModel("");
                  }}
                  className="sr-only"
                />
                {brand === b.slug && <Check className="-ml-1 size-3.5 animate-check-in text-brand-bright" aria-hidden="true" />}
                {b.name}
              </label>
            ))}
          </div>
        </fieldset>

        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label htmlFor={`${id}-model`} className="mb-2 block font-display text-sm font-semibold uppercase tracking-[0.12em] text-on-dark-muted">
              <StepMark n="02" done={Boolean(model)} /> Model
            </label>
            <select
              id={`${id}-model`}
              name="model"
              className="input border-graphite-3 bg-graphite-2 text-white transition-[border-color,opacity] focus:border-brand-bright disabled:opacity-60"
              value={model}
              disabled={!brand}
              onChange={(e) => setModel(e.target.value)}
            >
              <option value="">{brand ? "Select model" : "Choose a brand first"}</option>
              {brandModels.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor={`${id}-cat`} className="mb-2 block font-display text-sm font-semibold uppercase tracking-[0.12em] text-on-dark-muted">
              <span className="text-brand-bright">03</span> Part type
            </label>
            <select
              id={`${id}-cat`}
              name="category"
              className="input border-graphite-3 bg-graphite-2 text-white transition-[border-color,opacity] focus:border-brand-bright disabled:opacity-60"
              value={category}
              disabled={!model}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="all">All parts</option>
              {categories.map((c) => (
                <option key={c.slug} value={c.slug}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <button type="submit" className="group btn btn-primary btn-lg w-full sm:w-auto" disabled={!brand}>
          {model ? "Show compatible parts" : brand ? "Choose model" : "Choose a brand"}
          <ArrowRight className="size-4 transition-transform duration-small ease-ui group-hover:translate-x-1" aria-hidden="true" />
        </button>
      </div>

      <div className="relative flex min-h-56 flex-col items-center justify-center border-t border-white/10 p-5 lg:border-l lg:border-t-0">
        <GaugeArc className="absolute right-5 top-5 w-24 text-on-dark-muted" needle={selectedModel ? 0.82 : selectedBrand ? 0.5 : 0.18} />
        <BikeArt
          key={previewClass}
          bikeClass={previewClass}
          annotate
          title={`Line drawing of a ${bikeClassLabel(previewClass)}`}
          className="w-full max-w-md animate-fade-up text-on-dark"
        />
        <p className="display mt-2 text-center text-2xl text-white" aria-live="polite">
          {previewName}
        </p>
        <p className="text-xs text-on-dark-muted">Drawing shows the bike type, not the exact model</p>
      </div>
    </form>
  );
}
