import type { Metadata } from "next";
import Link from "next/link";
import { ProductListing } from "@/components/catalog/ProductListing";
import { PhotoBanner } from "@/components/layout/Banners";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { loadCatalog, modelDisplayName } from "@/lib/catalog/catalog";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Motorcycle Engine Oil & Fluids",
  description:
    "Motorcycle engine oil, gear oil, brake fluid, coolant, chain lubricant and care products at Nirob Autos, Madhupur.",
  path: "/engine-oil",
});

export default async function EngineOilPage(props: PageProps<"/engine-oil">) {
  const [searchParams, catalog] = await Promise.all([props.searchParams, loadCatalog()]);
  const group = catalog.groups.find((g) => g.slug === "oils-fluids");
  const withOil = catalog.models.filter((m) => m.manual?.engineOil);
  return (
    <>
      <PhotoBanner
        photo="catOils"
        eyebrow="Maintenance"
        title="Engine oil & maintenance fluids"
        description="Oils, fluids and care products for routine maintenance. Tell us your bike model and we'll confirm the right grade."
        crumbs={[{ label: "Engine oil & fluids", href: "/engine-oil" }]}
      >
        {group && (
          <ul className="mt-5 flex flex-wrap gap-2">
            {group.subcategories.map((s) => (
              <li key={s.slug}>
                <Link href={`/categories/${s.slug}`} className="chip chip-dark">
                  {s.name}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </PhotoBanner>
      <div className="container-page space-y-10 py-8">
        {withOil.length > 0 && (
          <section aria-labelledby="oil-grades-title">
            <SectionHeader
              id="oil-grades-title"
              eyebrow="From the owner's manuals"
              title="Recommended engine oil by model"
              description="Grades and quantities as published in the manufacturer's owner's manuals. More models are added as we check their manuals."
            />
            <div className="relative overflow-x-auto rounded-[0.625rem] border border-line bg-surface">
              <table className="w-full min-w-[36rem] border-collapse text-sm">
                <thead>
                  <tr className="bg-canvas text-left text-muted">
                    <th scope="col" className="px-4 py-3 font-medium">Model</th>
                    <th scope="col" className="px-4 py-3 font-medium">Oil grade</th>
                    <th scope="col" className="px-4 py-3 font-medium">Oil change</th>
                    <th scope="col" className="px-4 py-3 font-medium">Change interval</th>
                  </tr>
                </thead>
                <tbody>
                  {withOil.map((m) => (
                    <tr key={m.id} className="border-t border-line">
                      <th scope="row" className="px-4 py-2.5 text-left">
                        <Link href={`/models/${m.slug}`} className="font-semibold text-ink underline decoration-line-strong underline-offset-2 hover:text-brand">
                          {modelDisplayName(m, catalog.brandBySlug)}
                        </Link>
                      </th>
                      <td className="px-4 py-2.5 text-ink">{m.manual!.engineOil!.grade}</td>
                      <td className="px-4 py-2.5 text-ink">
                        {m.manual!.engineOil!.serviceFillMl ? `${m.manual!.engineOil!.serviceFillMl.toLocaleString("en-US")} ml` : "—"}
                      </td>
                      <td className="px-4 py-2.5 text-ink">
                        {m.manual!.engineOil!.changeEvery ?? (
                          <Link href={`/models/${m.slug}#model-manual-title`} className="text-muted underline">
                            See note
                          </Link>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}
        <ProductListing
          basePath="/engine-oil"
          searchParams={searchParams}
          scope={{ category: "oils-fluids" }}
          emptyTitle="No oils or fluids listed yet"
        />
      </div>
    </>
  );
}
