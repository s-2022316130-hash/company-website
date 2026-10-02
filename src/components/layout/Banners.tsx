import type { ReactNode } from "react";
import { BikeArt } from "@/components/bikes/BikeArt";
import { PhotoFill } from "@/components/media/Photo";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { GearRing } from "@/components/ui/Mechanical";
import type { PhotoKey } from "@/config/photos";
import type { Crumb } from "@/lib/seo";
import type { BikeClass } from "@/lib/types";

/**
 * Full-width photo banner for category-style pages. The photo is decorative (the heading
 * carries the meaning); a left-to-right dark gradient keeps white text at AA contrast.
 */
export function PhotoBanner({
  photo,
  eyebrow,
  title,
  description,
  crumbs,
  children,
}: {
  photo?: PhotoKey;
  eyebrow?: string;
  title: string;
  description?: ReactNode;
  crumbs: Crumb[];
  children?: ReactNode;
}) {
  return (
    <section className="relative isolate overflow-hidden bg-graphite text-white">
      <PhotoFill photo={photo} sizes="100vw" priority decorative className="-z-20 animate-hero-in" />
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgb(14_17_21/0.96)_0%,rgb(14_17_21/0.86)_45%,rgb(14_17_21/0.45)_100%)]" />
      <div className="absolute inset-0 -z-10 fins opacity-60" />
      <div className="container-page py-8 sm:py-12 lg:py-14">
        <Breadcrumbs items={crumbs} tone="dark" />
        {eyebrow && <p className="eyebrow eyebrow-dark mt-5">{eyebrow}</p>}
        <h1 className={`display max-w-3xl text-[2.5rem] text-white sm:text-6xl ${eyebrow ? "mt-2" : "mt-5"}`}>{title}</h1>
        {description && <div className="mt-3 max-w-2xl text-[0.9375rem] text-on-dark sm:text-base">{description}</div>}
        {children}
      </div>
      <div className="chain-rule opacity-70" aria-hidden="true" />
    </section>
  );
}

/** Dark blueprint banner with a bike drawing, for brand and model pages. */
export function BlueprintBanner({
  bikeClass,
  eyebrow,
  title,
  description,
  crumbs,
  aside,
  children,
}: {
  bikeClass: BikeClass;
  eyebrow?: string;
  title: string;
  description?: ReactNode;
  crumbs: Crumb[];
  /** Small content under the drawing, e.g. a label. */
  aside?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <section className="blueprint relative isolate overflow-hidden text-white">
      <GearRing teeth={32} className="pointer-events-none absolute -right-24 -top-24 -z-10 size-[26rem] text-white/[0.05]" />
      <div className="container-page grid items-center gap-6 py-8 sm:py-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:py-12">
        <div className="min-w-0">
          <Breadcrumbs items={crumbs} tone="dark" />
          {eyebrow && <p className="eyebrow eyebrow-dark mt-5">{eyebrow}</p>}
          <h1 className={`display text-[2.5rem] text-white sm:text-6xl ${eyebrow ? "mt-2" : "mt-5"}`}>{title}</h1>
          {description && <div className="mt-3 max-w-xl text-[0.9375rem] text-on-dark sm:text-base">{description}</div>}
          {children}
        </div>
        <div className="relative hidden sm:block">
          <BikeArt bikeClass={bikeClass} annotate className="mx-auto w-full max-w-xl text-on-dark" />
          {aside && <div className="mt-1 text-center text-xs text-on-dark-muted">{aside}</div>}
        </div>
      </div>
      <div className="chain-rule opacity-70" aria-hidden="true" />
    </section>
  );
}
