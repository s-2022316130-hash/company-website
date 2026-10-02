import { NextResponse, type NextRequest } from "next/server";
import { loadCatalog, modelDisplayName } from "@/lib/catalog/catalog";
import { buildSearchIndex, searchProducts, suggestDirectory, type Suggestion } from "@/lib/catalog/search";

/** Instant suggestions for the search box: matching models and categories first, then products. */
export async function GET(request: NextRequest) {
  const q = (request.nextUrl.searchParams.get("q") ?? "").slice(0, 120).trim();
  if (q.length < 2) return NextResponse.json({ suggestions: [] });

  const catalog = await loadCatalog();
  const directory = suggestDirectory(q, catalog.models, catalog.brandBySlug, catalog.groups);

  const result = searchProducts(buildSearchIndex(catalog.products, { groups: catalog.groups }), q);
  const products: Suggestion[] =
    result.mode === "all"
      ? result.hits.slice(0, 5).map(({ product }) => ({
          kind: "product",
          label: product.name,
          sublabel: [
            product.brands.length === 1 ? product.brands[0].name : undefined,
            product.models.length > 0 ? `fits ${modelDisplayName(product.models[0], catalog.brandBySlug)}` : product.subcategoryName,
          ]
            .filter(Boolean)
            .join(" · "),
          href: `/products/${product.slug}`,
          thumb: product.displayImage
            ? { kind: "photo", src: product.displayImage.src }
            : product.models[0]
              ? { kind: "bike", bikeClass: product.models[0].class }
              : { kind: "icon", icon: product.categoryIcon },
        }))
      : [];

  const suggestions: Suggestion[] = [
    ...directory,
    ...products,
    { kind: "search", label: `Search all results for “${q}”`, href: `/search?q=${encodeURIComponent(q)}` },
  ];

  return NextResponse.json({ suggestions }, { headers: { "Cache-Control": "public, max-age=60" } });
}
