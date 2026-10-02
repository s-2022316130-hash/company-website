"use client";

import { useRouter } from "next/navigation";
import { useId, useState } from "react";
import { Bike } from "lucide-react";
import type { Brand, MotorcycleModel } from "@/lib/types";

/** Compact brand → model picker that leads into the part finder. */
export function BikeFinder({ brands, models }: { brands: Brand[]; models: MotorcycleModel[] }) {
  const router = useRouter();
  const id = useId();
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const brandModels = models.filter((m) => m.brand === brand);

  return (
    <form
      action="/part-finder"
      method="get"
      onSubmit={(e) => {
        e.preventDefault();
        const qs = new URLSearchParams();
        if (brand) qs.set("brand", brand);
        if (model) qs.set("model", model);
        router.push(`/part-finder${qs.size ? `?${qs}` : ""}`);
      }}
      className="card p-5 shadow-sm"
      aria-labelledby={`${id}-title`}
    >
      <h2 id={`${id}-title`} className="flex items-center gap-2 font-display text-xl font-bold text-ink">
        <Bike className="size-6 text-brand" aria-hidden="true" />
        Find parts for your bike
      </h2>
      <p className="mt-1 text-sm text-muted">Choose your motorcycle to see parts listed for it.</p>

      <div className="mt-4 space-y-3">
        <div>
          <label htmlFor={`${id}-brand`} className="mb-1 block text-sm font-semibold text-ink">
            1. Brand
          </label>
          <select
            id={`${id}-brand`}
            name="brand"
            className="input"
            value={brand}
            onChange={(e) => {
              setBrand(e.target.value);
              setModel("");
            }}
          >
            <option value="">Select brand</option>
            {brands.map((b) => (
              <option key={b.slug} value={b.slug}>
                {b.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor={`${id}-model`} className="mb-1 block text-sm font-semibold text-ink">
            2. Model
          </label>
          <select
            id={`${id}-model`}
            name="model"
            className="input"
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
        <button type="submit" className="btn btn-primary btn-lg w-full" disabled={!brand}>
          {model ? "Show parts for this bike" : "Continue"}
        </button>
      </div>
    </form>
  );
}
