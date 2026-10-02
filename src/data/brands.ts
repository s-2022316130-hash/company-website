import type { Brand } from "@/lib/types";

/**
 * Motorcycle brands the catalogue is organised around.
 * Brand names identify vehicle compatibility only; they do not imply any dealership.
 */
export const brands: Brand[] = [
  { slug: "bajaj", name: "Bajaj", nameBn: "বাজাজ" },
  { slug: "honda", name: "Honda", nameBn: "হোন্ডা" },
  { slug: "yamaha", name: "Yamaha", nameBn: "ইয়ামাহা" },
  { slug: "suzuki", name: "Suzuki", nameBn: "সুজুকি" },
  { slug: "tvs", name: "TVS", nameBn: "টিভিএস" },
  { slug: "hero", name: "Hero", nameBn: "হিরো" },
  { slug: "runner", name: "Runner", nameBn: "রানার" },
];
