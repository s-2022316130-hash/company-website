import type { ReactNode } from "react";
import Link from "next/link";
import { Battery, BookOpen, CalendarClock, Droplets, ExternalLink, Gauge, Info, Lightbulb, Link2, Zap } from "lucide-react";
import type { OwnerManualFacts } from "@/lib/types";

const fuelLabels = { fi: "Fuel injection", carburettor: "Carburettor" } as const;
const ml = (n: number) => `${n.toLocaleString("en-US")} ml`;

function FactCard({
  icon: Icon,
  title,
  link,
  children,
}: {
  icon: typeof Battery;
  title: string;
  link?: { label: string; href: string };
  children: ReactNode;
}) {
  return (
    <li className="card flex flex-col gap-2 p-4">
      <h3 className="flex items-center gap-2 font-semibold text-ink">
        <Icon className="size-4 text-brand" aria-hidden="true" />
        {title}
      </h3>
      <div className="flex-1 space-y-1 text-sm text-ink">{children}</div>
      {link && (
        <Link href={link.href} className="text-sm font-semibold text-brand underline">
          {link.label}
        </Link>
      )}
    </li>
  );
}

/** Parts-relevant facts from the official owner's manual: oil, plugs, battery, pressures, intervals. */
export function ManualFacts({ manual }: { manual: OwnerManualFacts }) {
  const checked = new Date(manual.checked).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
  const oil = manual.engineOil;

  return (
    <div className="space-y-4">
      <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {oil && (
          <FactCard icon={Droplets} title="Engine oil" link={{ label: "Engine oils", href: "/engine-oil" }}>
            <p className="font-display text-xl font-bold">{oil.grade}</p>
            {oil.serviceFillMl && (
              <p>
                {ml(oil.serviceFillMl)} at an oil change
                {oil.overhaulFillMl ? ` (${ml(oil.overhaulFillMl)} after an engine overhaul)` : ""}
              </p>
            )}
            {oil.changeEvery && <p className="text-muted">Change: {oil.changeEvery.toLowerCase()}</p>}
            {oil.topUpEvery && <p className="text-muted">Top up: {oil.topUpEvery.toLowerCase()}</p>}
          </FactCard>
        )}
        {manual.sparkPlug && (
          <FactCard icon={Zap} title={manual.sparkPlug.count === 2 ? "Spark plugs (twin spark)" : "Spark plug"} link={{ label: "Spark plugs", href: "/categories/spark-plug" }}>
            <p className="font-semibold">{manual.sparkPlug.types}</p>
            {manual.sparkPlug.count && manual.sparkPlug.count > 1 && <p>{manual.sparkPlug.count} plugs per bike</p>}
            {manual.sparkPlug.gap && <p className="text-muted">Gap: {manual.sparkPlug.gap}</p>}
          </FactCard>
        )}
        {manual.battery && (
          <FactCard icon={Battery} title="Battery" link={{ label: "Batteries", href: "/categories/battery" }}>
            <p className="font-semibold">{manual.battery}</p>
          </FactCard>
        )}
        {manual.tyrePressurePsi && (
          <FactCard icon={Gauge} title="Tyre pressure (cold)" link={{ label: "Tyres", href: "/categories/tyres" }}>
            <p>Front: <strong>{manual.tyrePressurePsi.front} psi</strong></p>
            <p>Rear, rider only: <strong>{manual.tyrePressurePsi.rearSolo} psi</strong></p>
            <p>Rear, with pillion: <strong>{manual.tyrePressurePsi.rearPillion} psi</strong></p>
          </FactCard>
        )}
        {manual.chain && (
          <FactCard icon={Link2} title="Drive chain" link={{ label: "Chain lubricant", href: "/categories/chain-lubricant" }}>
            <p>Slack: <strong>{manual.chain.slackMm}</strong></p>
            {manual.chain.lubrication && <p className="text-muted">{manual.chain.lubrication}</p>}
          </FactCard>
        )}
        {(manual.brakeFluid || manual.replaceIntervals) && (
          <FactCard icon={Info} title="Brakes" link={{ label: "Brake fluid", href: "/categories/brake-fluid" }}>
            {manual.brakeFluid && <p>Fluid: {manual.brakeFluid}</p>}
            {manual.replaceIntervals?.map((r) => (
              <p key={r} className="text-muted">{r}</p>
            ))}
          </FactCard>
        )}
        {manual.bulbs && manual.bulbs.length > 0 && (
          <FactCard icon={Lightbulb} title="Bulbs" link={{ label: "Headlight bulbs", href: "/categories/headlight-bulb" }}>
            <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-0.5">
              {manual.bulbs.map((b) => (
                <div key={b.label} className="contents">
                  <dt className="text-muted">{b.label}</dt>
                  <dd>{b.value}</dd>
                </div>
              ))}
            </dl>
          </FactCard>
        )}
        {(manual.serviceSchedule || manual.fuelSystem) && (
          <FactCard icon={CalendarClock} title="Servicing">
            {manual.serviceSchedule && <p>Service at {manual.serviceSchedule}.</p>}
            {manual.fuelSystem && <p className="text-muted">Fuel system: {fuelLabels[manual.fuelSystem].toLowerCase()}</p>}
          </FactCard>
        )}
      </ul>

      {manual.notes && manual.notes.length > 0 && (
        <ul className="space-y-1.5 text-sm text-muted">
          {manual.notes.map((n) => (
            <li key={n} className="flex items-start gap-2">
              <Info className="mt-0.5 size-4 shrink-0 text-warning" aria-hidden="true" />
              <span>{n}</span>
            </li>
          ))}
        </ul>
      )}

      <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted">
        <BookOpen className="size-3.5" aria-hidden="true" />
        From the official {manual.covers}, read {checked}. Manuals can be older than your bike, so check your own
        manual or ask us.
        <a href={manual.source} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 underline hover:text-brand">
          Manual (PDF) <ExternalLink className="size-3" aria-hidden="true" />
        </a>
      </p>
    </div>
  );
}
