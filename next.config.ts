import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
    // Add the image host here if product photos are served from a CDN or storage bucket.
    remotePatterns: [],
  },
  async redirects() {
    // /shop is the canonical product listing; /products/[slug] holds individual products.
    return [
      { source: "/products", destination: "/shop", permanent: true },
      // Categories with their own page (dedicatedCategoryPaths in src/lib/catalog/paths.ts; paths.test.ts keeps the two in step).
      { source: "/categories/accessories", destination: "/accessories", permanent: true },
      { source: "/categories/oils-fluids", destination: "/engine-oil", permanent: true },
      { source: "/categories/helmets", destination: "/helmets", permanent: true },
      // The two generic helmet records gave way to the shop's own helmet list (src/data/catalogue/helmets.ts).
      { source: "/products/:slug(full-face-helmet|open-face-helmet)", destination: "/helmets", permanent: true },
    ];
  },
};

export default nextConfig;
