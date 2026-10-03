/** Category groups (and the helmets subcategory) with their own top-level page instead of /categories/[slug]. */
export const dedicatedCategoryPaths: Record<string, string> = {
  accessories: "/accessories",
  "oils-fluids": "/engine-oil",
  helmets: "/helmets",
};

export function categoryPath(slug: string): string {
  return dedicatedCategoryPaths[slug] ?? `/categories/${slug}`;
}
