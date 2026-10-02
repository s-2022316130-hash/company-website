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
    return [{ source: "/products", destination: "/shop", permanent: true }];
  },
};

export default nextConfig;
