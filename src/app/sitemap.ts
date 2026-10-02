import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/config/site";
import { categoryPath, loadCatalog } from "@/lib/catalog/catalog";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const catalog = await loadCatalog();

  const staticPaths = [
    "/",
    "/shop",
    "/part-finder",
    "/brands",
    "/models",
    "/categories",
    "/accessories",
    "/engine-oil",
    "/about",
    "/contact",
    "/faq",
    "/privacy",
    "/terms",
    "/credits",
  ];
  const groupPaths = catalog.groups.map((g) => categoryPath(g.slug));
  const subPaths = catalog.groups.flatMap((g) => g.subcategories.map((s) => `/categories/${s.slug}`));

  const pages = [
    ...new Set([
      ...staticPaths,
      ...catalog.brands.map((b) => `/brands/${b.slug}`),
      ...catalog.models.map((m) => `/models/${m.slug}`),
      ...groupPaths,
      ...subPaths,
    ]),
  ].map((path) => ({ url: absoluteUrl(path) }));

  // Sample records are placeholders and are left out until real products replace them.
  const products = catalog.products
    .filter((p) => !p.isSample)
    .map((p) => ({ url: absoluteUrl(`/products/${p.slug}`), lastModified: p.updatedAt }));

  return [...pages, ...products];
}
