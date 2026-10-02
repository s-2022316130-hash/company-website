import Link from "next/link";
import { ExternalLink, Info } from "lucide-react";
import type { BrakeSpec, Cooling, FuelSystem, MotorcycleModel, VariantSpec } from "@/lib/types";

/** Shown for a value the official page doesn't state. */
function NotStated() {
  return (
    <span className="text-muted" title="Not stated on the official page">
      —<span className="sr-only">not stated</span>
    </span>
  );
}

const fuelLabels: Record<FuelSystem, string> = { fi: "Fuel injection", carburettor: "Carburettor" };
const coolingLabels: Record<Cooling, string> = { air: "Air-cooled", oil: "Oil-cooled", liquid: "Liquid-cooled" };

const capitalise = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
const formatBrake = (b: BrakeSpec) => (b.sizeMm ? `${capitalise(b.type)}, ${b.sizeMm} mm` : capitalise(b.type));
const formatEngine = (v: VariantSpec) =>
  v.engineCc === undefined ? undefined : `${v.engineCc} cc${v.valves ? `, ${v.valves}-valve` : ""}`;

const rows: { label: string; value: (v: VariantSpec) => string | undefined }[] = [
  { label: "Engine", value: formatEngine },
  { label: "Fuel system", value: (v) => (v.fuel ? fuelLabels[v.fuel] : undefined) },
  { label: "Cooling", value: (v) => (v.cooling ? coolingLabels[v.cooling] : undefined) },
  { label: "Gearbox", value: (v) => (v.gears ? `${v.gears}-speed` : undefined) },
  { label: "ABS", value: (v) => (v.abs ? "Yes" : undefined) },
  { label: "Front brake", value: (v) => (v.frontBrake ? formatBrake(v.frontBrake) : undefined) },
  { label: "Rear brake", value: (v) => (v.rearBrake ? formatBrake(v.rearBrake) : undefined) },
  { label: "Front tyre", value: (v) => v.frontTyre },
  { label: "Rear tyre", value: (v) => v.rearTyre },
  { label: "Front suspension", value: (v) => v.frontSuspension },
  { label: "Rear suspension", value: (v) => v.rearSuspension },
  { label: "Battery", value: (v) => v.battery },
];

function checkedDate(variants: VariantSpec[]) {
  const latest = variants.map((v) => v.checked).sort().at(-1);
  return latest
    ? new Date(latest).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })
    : undefined;
}

/** Parts a customer should ask for, grouped by what differs between variants. */
function partsToMatch(variants: VariantSpec[]) {
  const brakeLine = (wheel: "Front" | "Rear", pick: (v: VariantSpec) => BrakeSpec | undefined) => {
    const types = new Set(variants.map((v) => pick(v)?.type).filter(Boolean));
    if (types.size === 0) return undefined;
    const links = [
      types.has("disc") && { label: `${wheel} brake pads`, href: "/categories/brake-pads" },
      types.has("drum") && { label: `${wheel} brake shoes`, href: "/categories/brake-shoe" },
    ].filter((l): l is { label: string; href: string } => Boolean(l));
    const sizes = new Set(variants.map((v) => pick(v)?.sizeMm).filter(Boolean));
    return {
      area: `${wheel} brake`,
      links,
      hint:
        types.size > 1
          ? "Disc on some variants, drum on others."
          : sizes.size > 1
            ? `Sizes differ by variant (${[...sizes].sort((a, b) => Number(a) - Number(b)).join(", ")} mm).`
            : undefined,
    };
  };
  const tyres = [...new Set(variants.flatMap((v) => [v.frontTyre, v.rearTyre]).filter(Boolean))];
  return [
    brakeLine("Front", (v) => v.frontBrake),
    brakeLine("Rear", (v) => v.rearBrake),
    tyres.length > 0 && {
      area: "Tyres",
      links: [{ label: "Tyres", href: "/categories/tyres" }],
      hint: `Published sizes: ${tyres.map((t) => t!.split(",")[0]).filter((t, i, a) => a.indexOf(t) === i).join(", ")}.`,
    },
  ].filter((x): x is { area: string; links: { label: string; href: string }[]; hint: string | undefined } => Boolean(x));
}

/** Per-variant official specification table for one model, with the parts that depend on it. */
export function VariantSpecTable({ variants, makerName }: { variants: VariantSpec[]; makerName: string }) {
  const shown = rows.filter((r) => variants.some((v) => r.value(v) !== undefined));
  const notes = variants.filter((v) => v.note);
  const checked = checkedDate(variants);
  const match = partsToMatch(variants);

  return (
    <div className="space-y-4">
      <div className="relative overflow-x-auto rounded-[0.625rem] border border-line bg-surface">
        <table className="w-full border-collapse text-sm" style={variants.length > 1 ? { minWidth: `${9 + variants.length * 10}rem` } : undefined}>
          <caption className="sr-only">Official specifications by variant</caption>
          <thead>
            <tr className="bg-canvas">
              <th scope="col" className="sticky left-0 bg-canvas px-4 py-3 text-left font-medium text-muted">
                Variant
              </th>
              {variants.map((v) => (
                <th key={v.name} scope="col" className="px-4 py-3 text-left align-top">
                  <span className="block font-semibold text-ink">{v.name}</span>
                  <a
                    href={v.source}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-0.5 inline-flex items-center gap-1 text-xs font-normal text-muted underline hover:text-brand"
                  >
                    Official page <ExternalLink className="size-3" aria-hidden="true" />
                  </a>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {shown.map((r) => (
              <tr key={r.label} className="border-t border-line">
                <th scope="row" className="sticky left-0 bg-surface px-4 py-2.5 text-left font-medium text-muted">
                  {r.label}
                </th>
                {variants.map((v) => {
                  const value = r.value(v);
                  return (
                    <td key={v.name} className="px-4 py-2.5 text-ink">
                      {value ?? <NotStated />}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {notes.length > 0 && (
        <ul className="space-y-1.5 text-sm text-muted">
          {notes.map((v) => (
            <li key={v.name} className="flex items-start gap-2">
              <Info className="mt-0.5 size-4 shrink-0 text-warning" aria-hidden="true" />
              <span>
                <strong className="font-semibold text-ink">{v.name}:</strong> {v.note}
              </span>
            </li>
          ))}
        </ul>
      )}

      {match.length > 0 && (
        <div className="card p-4">
          <h3 className="font-semibold text-ink">Parts that depend on your variant</h3>
          <ul className="mt-2 space-y-2 text-sm">
            {match.map((m) => (
              <li key={m.area} className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                <span className="font-medium text-ink">{m.area}:</span>
                {m.links.map((l) => (
                  <Link key={l.href} href={l.href} className="text-brand underline">
                    {l.label}
                  </Link>
                ))}
                {m.hint && <span className="text-muted">{m.hint}</span>}
              </li>
            ))}
          </ul>
        </div>
      )}

      <p className="text-xs text-muted">
        Specifications as published on {makerName}&apos;s official Bangladesh website
        {checked ? `, checked ${checked}` : ""}. A dash means the page doesn&apos;t state it. Specs can change between
        production years, so check your bike or tell us your variant when you order.
      </p>
    </div>
  );
}

/** Summarise one field across variants: "Disc, 240/260 mm", "Disc or drum". */
function brakeSummary(variants: VariantSpec[], pick: (v: VariantSpec) => BrakeSpec | undefined) {
  const specs = variants.map(pick).filter((b): b is BrakeSpec => Boolean(b));
  if (specs.length === 0) return undefined;
  const types = [...new Set(specs.map((b) => b.type))];
  return types
    .map((t) => {
      const sizes = [...new Set(specs.filter((b) => b.type === t && b.sizeMm).map((b) => b.sizeMm!))].sort((a, b) => a - b);
      return sizes.length > 0 ? `${capitalise(t)}, ${sizes.join("/")} mm` : capitalise(t);
    })
    .join(" or ");
}

/** One row per model: the brand's line-up compared on the facts that decide which parts fit. */
export function LineupSpecTable({ models, brandName }: { models: MotorcycleModel[]; brandName: string }) {
  return (
    <div className="space-y-3">
      <div className="relative overflow-x-auto rounded-[0.625rem] border border-line bg-surface">
        <table className="w-full min-w-[44rem] border-collapse text-sm">
          <caption className="sr-only">{brandName} line-up: engine, brakes and ABS by model</caption>
          <thead>
            <tr className="bg-canvas text-left text-muted">
              <th scope="col" className="sticky left-0 bg-canvas px-4 py-3 font-medium">Model</th>
              <th scope="col" className="px-4 py-3 font-medium">Engine</th>
              <th scope="col" className="px-4 py-3 font-medium">Front brake</th>
              <th scope="col" className="px-4 py-3 font-medium">Rear brake</th>
              <th scope="col" className="px-4 py-3 font-medium">ABS</th>
              <th scope="col" className="px-4 py-3 font-medium">Variants</th>
            </tr>
          </thead>
          <tbody>
            {models.map((m) => {
              const vs = m.variants ?? [];
              const cc = [...new Set(vs.map((v) => v.engineCc).filter((c): c is number => c !== undefined))];
              const absCount = vs.filter((v) => v.abs).length;
              const front = brakeSummary(vs, (v) => v.frontBrake);
              const rear = brakeSummary(vs, (v) => v.rearBrake);
              return (
                <tr key={m.id} className="border-t border-line">
                  <th scope="row" className="sticky left-0 bg-surface px-4 py-2.5 text-left">
                    <Link href={`/models/${m.slug}`} className="font-semibold text-ink underline decoration-line-strong underline-offset-2 hover:text-brand">
                      {m.name}
                    </Link>
                  </th>
                  <td className="px-4 py-2.5 text-ink">{cc.length > 0 ? `${cc.join("/")} cc` : <NotStated />}</td>
                  <td className="px-4 py-2.5 text-ink">{front ?? <NotStated />}</td>
                  <td className="px-4 py-2.5 text-ink">{rear ?? <NotStated />}</td>
                  <td className="px-4 py-2.5 text-ink">
                    {absCount === 0 ? <NotStated /> : absCount === vs.length ? "Yes" : `${absCount} of ${vs.length} variants`}
                  </td>
                  <td className="px-4 py-2.5 text-ink">{vs.length}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-muted">
        From {brandName}&apos;s official Bangladesh spec pages. A dash means the page doesn&apos;t state it.
      </p>
    </div>
  );
}
