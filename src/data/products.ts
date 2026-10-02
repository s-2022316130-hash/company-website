import type { Product } from "@/lib/types";

/**
 * SAMPLE CATALOGUE — development seed data only.
 *
 * None of these records is confirmed Nirob Autos inventory. Each one:
 *  - has isSample: true (shown as "Sample listing", noindex, left out of the sitemap)
 *  - has no price, part number, specification or product type, because none was supplied
 *  - lists only the model its own name refers to, never invented cross-compatibility
 *
 * Replace this file (or the repository behind it) with real stock data.
 */

type SampleInput = Pick<Product, "slug" | "name" | "category" | "subcategory" | "fitment"> &
  Partial<Pick<Product, "compatibleModels" | "shortDescription" | "isFeatured" | "isPopular" | "searchableAliases">>;

function sample(input: SampleInput): Product {
  return {
    id: input.slug,
    images: [],
    currency: "BDT",
    stockStatus: "call-for-availability",
    productType: "unknown",
    compatibleModels: [],
    isSample: true,
    ...input,
  };
}

const confirmLine = "Call or WhatsApp the store to confirm fit, price and availability before ordering.";

function forModel(part: string, modelName: string) {
  return `${part} listed for the ${modelName}. ${confirmLine}`;
}

export const products: Product[] = [
  sample({
    slug: "yamaha-fzs-v3-front-brake-pad",
    name: "Yamaha FZS V3 Front Brake Pad",
    category: "brakes",
    subcategory: "brake-pads",
    fitment: "model-specific",
    compatibleModels: ["yamaha-fzs-v3"],
    shortDescription: forModel("Front disc brake pad set", "Yamaha FZS V3"),
    isFeatured: true,
    isPopular: true,
  }),
  sample({
    slug: "yamaha-fzs-v3-chain-sprocket-kit",
    name: "Yamaha FZS V3 Chain Sprocket Kit",
    category: "chain-drive",
    subcategory: "chain-sprocket-kit",
    fitment: "model-specific",
    compatibleModels: ["yamaha-fzs-v3"],
    shortDescription: forModel("Chain and sprocket kit", "Yamaha FZS V3"),
    isFeatured: true,
    isPopular: true,
  }),
  sample({
    slug: "bajaj-pulsar-150-air-filter",
    name: "Bajaj Pulsar 150 Air Filter",
    category: "filters",
    subcategory: "air-filter",
    fitment: "model-specific",
    compatibleModels: ["bajaj-pulsar-150"],
    shortDescription: forModel("Air filter element", "Bajaj Pulsar 150"),
    isFeatured: true,
    isPopular: true,
  }),
  sample({
    slug: "honda-cb-shine-spark-plug",
    name: "Honda CB Shine Spark Plug",
    category: "filters",
    subcategory: "spark-plug",
    fitment: "model-specific",
    compatibleModels: ["honda-cb-shine"],
    shortDescription: forModel("Spark plug", "Honda CB Shine"),
    isFeatured: true,
  }),
  sample({
    slug: "tvs-apache-rtr-160-clutch-plate-set",
    name: "TVS Apache RTR 160 Clutch Plate Set",
    category: "clutch-transmission",
    subcategory: "clutch-plate",
    fitment: "model-specific",
    compatibleModels: ["tvs-apache-rtr-160"],
    shortDescription: forModel("Clutch friction plate set", "TVS Apache RTR 160"),
    isFeatured: true,
  }),
  sample({
    slug: "suzuki-gixxer-oil-filter",
    name: "Suzuki Gixxer Oil Filter",
    category: "filters",
    subcategory: "oil-filter",
    fitment: "model-specific",
    compatibleModels: ["suzuki-gixxer"],
    shortDescription: forModel("Oil filter", "Suzuki Gixxer"),
    isFeatured: true,
    isPopular: true,
  }),
  sample({
    slug: "hero-splendor-plus-brake-shoe",
    name: "Hero Splendor Plus Brake Shoe",
    category: "brakes",
    subcategory: "brake-shoe",
    fitment: "model-specific",
    compatibleModels: ["hero-splendor-plus"],
    shortDescription: forModel("Drum brake shoe pair", "Hero Splendor Plus"),
    isFeatured: true,
  }),
  sample({
    slug: "runner-bullet-100-clutch-cable",
    name: "Runner Bullet 100 Clutch Cable",
    category: "cables-controls",
    subcategory: "clutch-cable",
    fitment: "model-specific",
    compatibleModels: ["runner-bullet-100"],
    shortDescription: forModel("Clutch cable", "Runner Bullet 100"),
    isFeatured: true,
  }),
  sample({
    slug: "bajaj-pulsar-150-clutch-cable",
    name: "Bajaj Pulsar 150 Clutch Cable",
    category: "cables-controls",
    subcategory: "clutch-cable",
    fitment: "model-specific",
    compatibleModels: ["bajaj-pulsar-150"],
    shortDescription: forModel("Clutch cable", "Bajaj Pulsar 150"),
    isPopular: true,
  }),
  sample({
    slug: "bajaj-pulsar-150-front-brake-pad",
    name: "Bajaj Pulsar 150 Front Brake Pad",
    category: "brakes",
    subcategory: "brake-pads",
    fitment: "model-specific",
    compatibleModels: ["bajaj-pulsar-150"],
    shortDescription: forModel("Front disc brake pad set", "Bajaj Pulsar 150"),
    isPopular: true,
  }),
  sample({
    slug: "yamaha-r15-v3-air-filter",
    name: "Yamaha R15 V3 Air Filter",
    category: "filters",
    subcategory: "air-filter",
    fitment: "model-specific",
    compatibleModels: ["yamaha-r15-v3"],
    shortDescription: forModel("Air filter element", "Yamaha R15 V3"),
  }),
  sample({
    slug: "honda-livo-brake-shoe",
    name: "Honda Livo Brake Shoe",
    category: "brakes",
    subcategory: "brake-shoe",
    fitment: "model-specific",
    compatibleModels: ["honda-livo"],
    shortDescription: forModel("Drum brake shoe pair", "Honda Livo"),
  }),
  sample({
    slug: "tvs-apache-rtr-160-4v-chain-sprocket-kit",
    name: "TVS Apache RTR 160 4V Chain Sprocket Kit",
    category: "chain-drive",
    subcategory: "chain-sprocket-kit",
    fitment: "model-specific",
    compatibleModels: ["tvs-apache-rtr-160-4v"],
    shortDescription: forModel("Chain and sprocket kit", "TVS Apache RTR 160 4V"),
    isPopular: true,
  }),
  sample({
    slug: "hero-hf-deluxe-spark-plug",
    name: "Hero HF Deluxe Spark Plug",
    category: "filters",
    subcategory: "spark-plug",
    fitment: "model-specific",
    compatibleModels: ["hero-hf-deluxe"],
    shortDescription: forModel("Spark plug", "Hero HF Deluxe"),
  }),
  sample({
    slug: "suzuki-gixxer-sf-rear-brake-pad",
    name: "Suzuki Gixxer SF Rear Brake Pad",
    category: "brakes",
    subcategory: "brake-pads",
    fitment: "model-specific",
    compatibleModels: ["suzuki-gixxer-sf"],
    shortDescription: forModel("Rear disc brake pad set", "Suzuki Gixxer SF"),
  }),
  sample({
    slug: "bajaj-discover-125-battery",
    name: "Bajaj Discover 125 Battery",
    category: "electrical",
    subcategory: "battery",
    fitment: "model-specific",
    compatibleModels: ["bajaj-discover-125"],
    shortDescription: forModel("Battery", "Bajaj Discover 125"),
    isPopular: true,
  }),
  sample({
    slug: "honda-cb-hornet-160r-throttle-cable",
    name: "Honda CB Hornet 160R Throttle Cable",
    category: "cables-controls",
    subcategory: "throttle-cable",
    fitment: "model-specific",
    compatibleModels: ["honda-cb-hornet-160r"],
    shortDescription: forModel("Throttle (accelerator) cable", "Honda CB Hornet 160R"),
  }),
  sample({
    slug: "runner-turbo-125-air-filter",
    name: "Runner Turbo 125 Air Filter",
    category: "filters",
    subcategory: "air-filter",
    fitment: "model-specific",
    compatibleModels: ["runner-turbo-125"],
    shortDescription: forModel("Air filter element", "Runner Turbo 125"),
  }),
  sample({
    slug: "yamaha-fzs-v2-clutch-cable",
    name: "Yamaha FZS V2 Clutch Cable",
    category: "cables-controls",
    subcategory: "clutch-cable",
    fitment: "model-specific",
    compatibleModels: ["yamaha-fzs-v2"],
    shortDescription: forModel("Clutch cable", "Yamaha FZS V2"),
  }),
  sample({
    slug: "motorcycle-engine-oil",
    name: "Motorcycle Engine Oil",
    category: "oils-fluids",
    subcategory: "engine-oil",
    fitment: "universal",
    shortDescription:
      "Engine oil for motorcycles. Grades and pack sizes vary, so tell us your bike model when you order and we will confirm the right one.",
    isFeatured: true,
    isPopular: true,
    searchableAliases: ["mobil"],
  }),
  sample({
    slug: "chain-lubricant-spray",
    name: "Chain Lubricant Spray",
    category: "oils-fluids",
    subcategory: "chain-lubricant",
    fitment: "universal",
    shortDescription: `Spray lubricant for motorcycle drive chains. ${confirmLine}`,
  }),
  sample({
    slug: "motorcycle-brake-fluid",
    name: "Motorcycle Brake Fluid",
    category: "oils-fluids",
    subcategory: "brake-fluid",
    fitment: "universal",
    shortDescription:
      "Hydraulic brake fluid. Use the fluid grade marked on your bike's brake reservoir cap; ask us if you are unsure.",
  }),
  sample({
    slug: "chain-cleaner",
    name: "Chain Cleaner",
    category: "oils-fluids",
    subcategory: "cleaning-care",
    fitment: "universal",
    shortDescription: `Cleaner for motorcycle drive chains, used before lubricating. ${confirmLine}`,
  }),
  sample({
    slug: "motorcycle-mobile-holder",
    name: "Motorcycle Mobile Holder",
    category: "accessories",
    subcategory: "mobile-holder",
    fitment: "universal",
    shortDescription: `Handlebar-mounted phone holder. ${confirmLine}`,
    isFeatured: true,
  }),
  sample({
    slug: "handlebar-grips",
    name: "Handlebar Grips",
    category: "accessories",
    subcategory: "grips-covers",
    fitment: "unconfirmed",
    shortDescription: `Replacement handlebar grips. ${confirmLine}`,
  }),
  sample({
    slug: "motorcycle-body-cover",
    name: "Motorcycle Body Cover",
    category: "accessories",
    subcategory: "utility",
    fitment: "unconfirmed",
    shortDescription: `Dust and rain cover for a parked motorcycle. ${confirmLine}`,
  }),
  sample({
    slug: "rear-view-mirror-pair",
    name: "Rear View Mirror Pair",
    category: "body",
    subcategory: "mirror",
    fitment: "unconfirmed",
    shortDescription: `Left and right replacement mirrors. ${confirmLine}`,
  }),
];
