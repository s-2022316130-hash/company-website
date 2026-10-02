import type { Metadata } from "next";
import Image from "next/image";
import { PageHeader } from "@/components/layout/PageHeader";
import { photos } from "@/config/photos";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Photo Credits",
  description: "Credits and licences for the photography used on the Nirob Autos website.",
  path: "/credits",
});

/**
 * Lists every photo in the manifest with its photographer, source and licence.
 * Unsplash doesn't require attribution, but crediting photographers is good practice
 * and documents where each image came from.
 */
export default function CreditsPage() {
  const entries = Object.entries(photos);
  return (
    <>
      <PageHeader
        eyebrow="Image sources"
        title="Photo credits"
        description="Stock photography is used for atmosphere and as representative images of part types. It does not show Nirob Autos stock or premises. Motorcycle line drawings and graphics are original to this site."
        crumbs={[{ label: "Photo credits", href: "/credits" }]}
      />
      <div className="container-page py-10">
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {entries.map(([key, p]) => (
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
                  {p.temporary && " · placeholder until the shop supplies its own photos"}
                </span>
              </span>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
