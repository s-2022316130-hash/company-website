import type { Brand } from "@/lib/types";

/**
 * Motorcycle brands the catalogue is organised around.
 * Brand names identify vehicle compatibility only; they do not imply any dealership.
 * `officialSource` records where the model list was checked.
 */
export const brands: Brand[] = [
  {
    slug: "bajaj",
    name: "Bajaj",
    nameBn: "বাজাজ",
    bikeClass: "street",
    description: "Pulsar, Discover, Platina and CT families.",
    officialSource: { label: "bajajauto.com/en-bd", url: "https://www.bajajauto.com/en-bd", checked: "2026-10-02" },
  },
  {
    slug: "honda",
    name: "Honda",
    nameBn: "হোন্ডা",
    bikeClass: "commuter",
    description: "Shine, Livo, SP, XBlade, Hornet and more.",
    officialSource: { label: "bdhonda.com", url: "https://www.bdhonda.com", checked: "2026-10-02" },
  },
  {
    slug: "yamaha",
    name: "Yamaha",
    nameBn: "ইয়ামাহা",
    bikeClass: "sport",
    description: "R15, MT15, FZ series, Saluto and Ray-ZR.",
    officialSource: { label: "yamahabd.com", url: "https://www.yamahabd.com/products", checked: "2026-10-02" },
  },
  {
    slug: "suzuki",
    name: "Suzuki",
    nameBn: "সুজুকি",
    bikeClass: "sport",
    description: "Gixxer family, GSX, Hayate and Access.",
    officialSource: { label: "suzuki.com.bd", url: "https://suzuki.com.bd/bikes", checked: "2026-10-02" },
  },
  {
    slug: "tvs",
    name: "TVS",
    nameBn: "টিভিএস",
    bikeClass: "street",
    description: "Apache series, Raider and Ntorq.",
    officialSource: { label: "bangladesh.tvsmotor.com", url: "https://bangladesh.tvsmotor.com/en/", checked: "2026-10-02" },
  },
  {
    slug: "hero",
    name: "Hero",
    nameBn: "হিরো",
    bikeClass: "commuter",
    description: "Splendor, HF Deluxe, Hunk, Thriller, Xoom and more.",
    officialSource: { label: "heromotocorp.com/en-bd", url: "https://www.heromotocorp.com/en-bd.html", checked: "2026-10-02" },
  },
  {
    slug: "runner",
    name: "Runner",
    nameBn: "রানার",
    bikeClass: "commuter",
    description: "Bangladeshi-made Bullet, Royal+, Turbo, Knight Rider and more.",
    officialSource: { label: "motorcycles.runnerautomobiles.com", url: "https://motorcycles.runnerautomobiles.com/shop/category/products", checked: "2026-10-02" },
  },
];
