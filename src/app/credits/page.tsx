import type { Metadata } from "next";
import Image from "next/image";
import { LogoEmblem } from "@/components/layout/Logo";
import { PageHeader } from "@/components/layout/PageHeader";
import { brandImages, motorcycleImages, photos, type ImageAsset } from "@/config/images";
import { shown } from "@/lib/images";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Image Credits",
  description: "Credits, sources and licences for the images used on the Nirob Autos website.",
  path: "/credits",
});

const rightsLabels: Record<ImageAsset["rightsStatus"], string> = {
  approved: "Used with the rights holder's permission",
  "dealer-supplied": "Supplied by the distributor for dealer use",
  temporary: "Placeholder until the shop supplies its own photo",
  "permission-required": "Not shown",
};

/**
 * Lists every image the site shows, with its source and licence. Unsplash doesn't require
 * attribution, but crediting photographers is good practice and documents where each image came from.
 * Official brand images appear here once they may be shown.
 */
export default function CreditsPage() {
  const stock = Object.entries(photos);
  const official = [...Object.values(brandImages).map((b) => b.logo), ...Object.values(motorcycleImages)]
    .map((a) => shown(a))
    .filter((a) => a !== undefined);

  return (
    <>
      <PageHeader
        eyebrow="Image sources"
        title="Image credits"
        description="Stock photography is used for atmosphere and as representative images of part types. It does not show Nirob Autos stock or premises. Motorcycle line drawings, part illustrations and graphics are original to this site."
        crumbs={[{ label: "Image credits", href: "/credits" }]}
      />
      <div className="container-page space-y-10 py-10">
        <section aria-labelledby="shop-logo-title" className="card max-w-3xl p-5">
          <h2 id="shop-logo-title" className="display text-2xl text-ink">
            Nirob Autos logo
          </h2>
          <div className="mt-3 flex flex-wrap items-center gap-5">
            <LogoEmblem tone="light" className="h-20" sizes="140px" />
            <p className="max-w-md text-sm text-ink">
              The shop&apos;s own logo, supplied by the owner. It is used across this site, including the browser icon and
              the image shown when a page is shared. The manufacturer logos printed on the shop&apos;s signboard are not
              reproduced here.
            </p>
          </div>
        </section>

        <section aria-labelledby="official-title" className="card max-w-3xl p-5">
          <h2 id="official-title" className="display text-2xl text-ink">
            Brand logos and motorcycle photos
          </h2>
          <p className="mt-2 text-sm text-ink">
            Manufacturer logos and official model photos belong to their brands. They are shown here only when the
            distributor has supplied them or confirmed in writing that the shop may use them, and are kept on this site
            rather than loaded from manufacturer websites. Until then, brands appear by name and motorcycles as original
            line drawings of their body style.
          </p>
          {official.length > 0 ? (
            <ul className="mt-4 space-y-2 text-sm">
              {official.map((a) => (
                <li key={a.src} className="flex items-center gap-3">
                  <span className="relative h-10 w-16 shrink-0 overflow-hidden rounded bg-steel-soft">
                    <Image src={a.src} alt="" fill sizes="64px" className="object-contain p-1" />
                  </span>
                  <span>
                    <span className="font-medium text-ink">{a.alt}</span>
                    <span className="block text-xs text-muted">
                      {rightsLabels[a.rightsStatus]}
                      {a.requestFrom && ` · ${a.requestFrom}`}
                    </span>
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-3 text-sm text-muted">No official brand images are shown yet.</p>
          )}
        </section>

        <section aria-labelledby="stock-title">
          <h2 id="stock-title" className="display mb-4 text-2xl text-ink">
            Stock photography
          </h2>
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {stock.map(([key, p]) => (
              <li key={key} className="card flex gap-3 overflow-hidden p-3">
                <span className="relative size-20 shrink-0 overflow-hidden rounded-md bg-graphite">
                  <Image src={p.src} alt="" fill sizes="80px" className="object-cover" />
                </span>
                <span className="min-w-0 text-sm">
                  <span className="block font-medium text-ink">{p.alt}</span>
                  <span className="mt-1 block text-muted">
                    Photo by{" "}
                    <a href={p.credit.profileUrl} target="_blank" rel="noopener noreferrer" className="text-brand underline">
                      {p.credit.author}
                    </a>{" "}
                    on{" "}
                    <a href={p.credit.pageUrl} target="_blank" rel="noopener noreferrer" className="text-brand underline">
                      {p.credit.source}
                    </a>
                  </span>
                  <span className="block text-xs text-muted">
                    <a href={p.credit.licenseUrl} target="_blank" rel="noopener noreferrer" className="underline">
                      {p.credit.license}
                    </a>
                    {" · "}
                    {rightsLabels[p.rightsStatus].toLowerCase()}
                  </span>
                </span>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </>
  );
}
