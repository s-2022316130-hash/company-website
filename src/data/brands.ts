import type { Brand } from "@/lib/types";

/**
 * Motorcycle brands the catalogue is organised around.
 * Which brands the shop is a dealer for lives in `business.dealerships` (src/config/business.ts).
 * `officialSource` records where the model list was checked.
 */
export const brands: Brand[] = [
  {
    slug: "bajaj",
    name: "Bajaj",
    nameBn: "বাজাজ",
    description: "Pulsar, Discover, Platina and CT families.",
    officialSource: { label: "bajajauto.com/en-bd", url: "https://www.bajajauto.com/en-bd", checked: "2026-10-02" },
  },
  {
    slug: "honda",
    name: "Honda",
    nameBn: "হোন্ডা",
    description: "Shine, Livo, SP, XBlade, Hornet and more.",
    officialSource: { label: "bdhonda.com", url: "https://www.bdhonda.com", checked: "2026-10-02" },
  },
  {
    slug: "yamaha",
    name: "Yamaha",
    nameBn: "ইয়ামাহা",
    description: "R15, MT15, FZ series, Saluto and Ray-ZR.",
    officialSource: { label: "yamahabd.com", url: "https://www.yamahabd.com/products", checked: "2026-10-02" },
  },
  {
    slug: "suzuki",
    name: "Suzuki",
    nameBn: "সুজুকি",
    description: "Gixxer family, GSX, Hayate and Access.",
    officialSource: { label: "suzuki.com.bd", url: "https://suzuki.com.bd/bikes", checked: "2026-10-02" },
  },
  {
    slug: "tvs",
    name: "TVS",
    nameBn: "টিভিএস",
    description: "Apache series, Raider and Ntorq.",
    officialSource: { label: "bangladesh.tvsmotor.com", url: "https://bangladesh.tvsmotor.com/en/", checked: "2026-10-02" },
  },
  {
    slug: "hero",
    name: "Hero",
    nameBn: "হিরো",
    description: "Splendor, HF Deluxe, Hunk, Thriller, Xoom and more.",
    officialSource: { label: "heromotocorp.com/en-bd", url: "https://www.heromotocorp.com/en-bd.html", checked: "2026-10-02" },
  },
  {
    slug: "runner",
    name: "Runner",
    nameBn: "রানার",
    description: "Bangladeshi-made Bullet, Royal+, Turbo, Knight Rider and more.",
    officialSource: { label: "motorcycles.runnerautomobiles.com", url: "https://motorcycles.runnerautomobiles.com/shop/category/products", checked: "2026-10-02" },
  },
];
