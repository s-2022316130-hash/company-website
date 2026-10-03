import { describe, expect, it } from "vitest";
import nextConfig from "../../../next.config";
import { categoryPath, dedicatedCategoryPaths } from "./paths";

describe("category paths", () => {
  it("sends categories with their own page there, and the rest to /categories", () => {
    expect(categoryPath("helmets")).toBe("/helmets");
    expect(categoryPath("oils-fluids")).toBe("/engine-oil");
    expect(categoryPath("brake-pads")).toBe("/categories/brake-pads");
  });

  it("redirects each old /categories URL to its dedicated page", async () => {
    const redirects = (await nextConfig.redirects?.()) ?? [];
    for (const [slug, path] of Object.entries(dedicatedCategoryPaths)) {
      expect(redirects).toContainEqual({ source: `/categories/${slug}`, destination: path, permanent: true });
    }
  });
});
