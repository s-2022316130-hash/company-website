import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/config/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/cart", "/order", "/search", "/api/"] }],
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}
