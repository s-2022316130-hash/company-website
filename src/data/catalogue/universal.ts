import type { Product } from "@/lib/types";
import { brands } from "../brands";
import { models } from "../models";

/**
 * Items that are not tied to one model: oils and fluids, accessories and small hardware.
 * Generic catalogue entries only: no brands are invented, and pack sizes, grades and sizes are
 * confirmed with the customer. An oil grade or brake fluid lists a model only where the
 * manufacturer's owner's manual names it (see manuals.ts).
 */

const CONFIRM = "Call or WhatsApp to confirm price and availability before ordering.";

type Input = Pick<Product, "slug" | "name" | "category" | "subcategory" | "shortDescription"> &
  Partial<
    Pick<Product, "fitment" | "isFeatured" | "isPopular" | "isFastMoving" | "searchableAliases" | "photo" | "compatibleModels" | "notes" | "specifications">
  >;

function item(input: Input): Product {
  const recommended = (input.compatibleModels ?? []).length > 0;
  return {
    id: input.slug,
    images: [],
    currency: "BDT",
    inventoryStatus: "catalogue-only",
    productStatus: "live",
    authenticity: "unknown",
    fitment: "universal",
    compatibleModels: [],
    compatibilityConfidence: recommended ? "manufacturer-listed" : "needs-confirmation",
    source: recommended
      ? { type: "official-manufacturer", name: "Owner's manuals" }
      : { type: "retailer-reference", name: "Nirob Autos catalogue" },
    description: `${input.shortDescription} ${CONFIRM}`,
    ...input,
  };
}

const brandName = new Map(brands.map((b) => [b.slug, b.name]));

/** Models whose owner's manual names this viscosity (e.g. "20W50"), with one cited spec row each. */
function oilFor(grade: string) {
  const ms = models.filter((m) => m.manual?.engineOil?.grade.includes(grade));
  return {
    ids: ms.map((m) => m.id),
    specs: ms.map((m) => ({
      label: `${brandName.get(m.brand)} ${m.name}`,
      value: `${m.manual!.engineOil!.grade}${m.manual!.engineOil!.serviceFillMl ? `, ${m.manual!.engineOil!.serviceFillMl.toLocaleString("en-US")} ml at an oil change` : ""} (owner's manual)`,
      source: m.manual!.source,
    })),
  };
}

/** Models whose manual allows this brake fluid grade (e.g. "DOT 4"), with one cited spec row each. */
function fluidFor(dot: string) {
  const ms = models.filter((m) => m.manual?.brakeFluid?.replace(/\s/g, "").includes(dot.replace(/\s/g, "")));
  return {
    ids: ms.map((m) => m.id),
    specs: ms.map((m) => ({ label: `${brandName.get(m.brand)} ${m.name}`, value: `${m.manual!.brakeFluid} (owner's manual)`, source: m.manual!.source })),
  };
}

function engineOil(grade: string, extra: Partial<Input> = {}): Product {
  const { ids, specs } = oilFor(grade);
  return item({
    slug: `engine-oil-${grade.toLowerCase()}`,
    name: `${grade} Motorcycle Engine Oil`,
    category: "oils-fluids",
    subcategory: "engine-oil",
    compatibleModels: ids,
    specifications: specs.length > 0 ? specs : undefined,
    searchableAliases: ["mobil", grade.toLowerCase(), `${grade.slice(0, -2).toLowerCase()} ${grade.slice(-2)}`],
    shortDescription:
      ids.length > 0
        ? `SAE ${grade} four-stroke motorcycle engine oil, the grade the owner's manual gives for the models listed below. Brands and pack sizes vary.`
        : `SAE ${grade} four-stroke motorcycle engine oil. Use the grade in your owner's manual; ask us if you are unsure. Brands and pack sizes vary.`,
    isFastMoving: true,
    ...extra,
  });
}

function brakeFluid(dot: string, shortDescription: string): Product {
  const { ids, specs } = fluidFor(dot);
  return item({
    slug: `brake-fluid-${dot.toLowerCase().replace(/\s+/g, "-")}`,
    name: `${dot} Brake Fluid`,
    category: "oils-fluids",
    subcategory: "brake-fluid",
    compatibleModels: ids,
    specifications: specs.length > 0 ? specs : undefined,
    shortDescription,
  });
}

const oilsAndFluids: Product[] = [
  engineOil("10W30"),
  engineOil("10W40", { isPopular: true }),
  engineOil("10W50"),
  engineOil("20W40", { isPopular: true }),
  engineOil("20W50", { isFeatured: true, isPopular: true }),
  item({ slug: "scooter-engine-oil", name: "Scooter Engine Oil", category: "oils-fluids", subcategory: "engine-oil", searchableAliases: ["mobil"], shortDescription: "Engine oil for four-stroke automatic scooters. Ask us which grade suits your scooter." }),
  item({ slug: "scooter-gear-oil", name: "Scooter Gear Oil", category: "oils-fluids", subcategory: "gear-oil", shortDescription: "Final-drive gear oil for automatic scooters." }),
  brakeFluid("DOT 4", "DOT 4 hydraulic brake fluid. Use the grade marked on your brake reservoir cap; never mix with DOT 5."),
  brakeFluid("DOT 3", "DOT 3 hydraulic brake fluid. Use the grade marked on your brake reservoir cap."),
  item({ slug: "radiator-coolant", name: "Radiator Coolant", category: "oils-fluids", subcategory: "coolant", shortDescription: "Coolant for liquid-cooled motorcycles and scooters." }),
  item({ slug: "fork-oil", name: "Front Fork Oil", category: "oils-fluids", subcategory: "fork-oil", shortDescription: "Front fork (suspension) oil. Fork oil grade and quantity differ by model; ask us for yours." }),
  item({ slug: "chain-lubricant-spray", name: "Chain Lubricant Spray", category: "oils-fluids", subcategory: "chain-lubricant", searchableAliases: ["chain lube"], shortDescription: "Spray lubricant for motorcycle drive chains. Apply after cleaning, with the chain warm.", isFeatured: true, isPopular: true, isFastMoving: true }),
  item({ slug: "chain-cleaner", name: "Chain Cleaner", category: "oils-fluids", subcategory: "cleaners", shortDescription: "Cleaner for motorcycle drive chains, used before lubricating." }),
  item({ slug: "engine-degreaser", name: "Engine Cleaner / Degreaser", category: "oils-fluids", subcategory: "cleaners", searchableAliases: ["engine cleaner"], shortDescription: "Degreaser for cleaning oil and road dirt off the engine and swingarm." }),
  item({ slug: "carburettor-cleaner", name: "Carburettor Cleaner Spray", category: "oils-fluids", subcategory: "cleaners", searchableAliases: ["carb cleaner", "carburetor cleaner"], shortDescription: "Spray cleaner for carburettor jets and passages and throttle bodies." }),
  item({ slug: "contact-cleaner", name: "Electrical Contact Cleaner", category: "oils-fluids", subcategory: "cleaners", shortDescription: "Spray cleaner for switches, connectors and electrical contacts." }),
  item({ slug: "brake-cleaner", name: "Brake Cleaner Spray", category: "oils-fluids", subcategory: "cleaners", shortDescription: "Fast-drying cleaner for brake discs, calipers and drums. Keep it off paint and plastic." }),
  item({ slug: "multi-purpose-grease", name: "Multi-Purpose Grease", category: "oils-fluids", subcategory: "grease", searchableAliases: ["grease", "bearing grease"], shortDescription: "General grease for bearings, pivots and stand pins." }),
  item({ slug: "multi-purpose-lubricant", name: "Multi-Purpose Lubricant Spray", category: "oils-fluids", subcategory: "cleaners", shortDescription: "Light lubricant spray for cables, pivots and locks." }),
  item({ slug: "bike-wash-shampoo", name: "Bike Wash Shampoo", category: "oils-fluids", subcategory: "cleaning-care", shortDescription: "Shampoo for washing painted and plastic motorcycle parts." }),
  item({ slug: "polish-and-wax", name: "Polish & Wax", category: "oils-fluids", subcategory: "cleaning-care", shortDescription: "Polish for paintwork and chrome." }),
];

const accessories: Product[] = [
  item({ slug: "motorcycle-mobile-holder", name: "Motorcycle Mobile Holder", category: "accessories", subcategory: "mobile-holder", shortDescription: "Handlebar-mounted phone holder.", isFeatured: true, isPopular: true }),
  item({ slug: "metal-mobile-holder", name: "Metal Mobile Holder", category: "accessories", subcategory: "mobile-holder", shortDescription: "Metal-frame handlebar phone holder with a clamp mount." }),
  item({ slug: "usb-mobile-charger", name: "Motorcycle USB Mobile Charger", category: "accessories", subcategory: "usb-charger", fitment: "unconfirmed", shortDescription: "USB charging socket that runs from the bike's battery. Ask us about fitting it to your wiring." }),
  item({ slug: "handlebar-grips", name: "Handlebar Grips", category: "accessories", subcategory: "grips-covers", fitment: "unconfirmed", shortDescription: "Replacement handlebar grips." }),
  item({ slug: "seat-cover", name: "Seat Cover", category: "accessories", subcategory: "grips-covers", fitment: "unconfirmed", shortDescription: "Seat cover. Sizes differ between bikes; ask us for yours." }),
  item({ slug: "tank-pad", name: "Tank Pad", category: "accessories", subcategory: "grips-covers", shortDescription: "Stick-on pad that protects the fuel tank paint." }),
  item({ slug: "helmet-visor", name: "Helmet Visor", category: "accessories", subcategory: "safety", fitment: "unconfirmed", shortDescription: "Replacement helmet visor. Visors are specific to the helmet model; bring your helmet." }),
  item({ slug: "riding-gloves", name: "Riding Gloves", category: "accessories", subcategory: "safety", photo: "ridingGloves", shortDescription: "Riding gloves. Sizes vary; ask us what is available." }),
  item({ slug: "reflective-safety-vest", name: "Reflective Safety Vest", category: "accessories", subcategory: "reflective", searchableAliases: ["reflective jacket"], shortDescription: "High-visibility reflective vest for riding at night." }),
  item({ slug: "reflective-sticker-set", name: "Reflective Sticker Set", category: "accessories", subcategory: "reflective", shortDescription: "Reflective stickers for the bike body, helmet or rims." }),
  item({ slug: "disc-brake-lock", name: "Disc Brake Lock", category: "accessories", subcategory: "utility", fitment: "unconfirmed", shortDescription: "Lock that clamps onto the brake disc. Check that it fits your disc before buying." }),
  item({ slug: "motorcycle-body-cover", name: "Motorcycle Body Cover", category: "accessories", subcategory: "utility", fitment: "unconfirmed", searchableAliases: ["rain cover"], shortDescription: "Dust and rain cover for a parked motorcycle. Sizes vary by bike." }),
  item({ slug: "saddle-bag", name: "Saddle Bag", category: "accessories", subcategory: "utility", fitment: "unconfirmed", shortDescription: "Side bag for carrying small items. Ask us how it mounts on your bike." }),
  item({ slug: "number-plate-frame", name: "Number Plate Frame", category: "accessories", subcategory: "utility", fitment: "unconfirmed", shortDescription: "Frame for the registration number plate." }),
  item({ slug: "motorcycle-key-ring", name: "Motorcycle Key Ring", category: "accessories", subcategory: "utility", shortDescription: "Key ring for bike keys." }),
  item({ slug: "auxiliary-led-lights", name: "Auxiliary LED Lights", category: "accessories", subcategory: "auxiliary-lights", fitment: "unconfirmed", shortDescription: "Add-on LED lights. Fitting and wiring differ by bike; ask us before buying." }),
  item({ slug: "led-headlight-bulb", name: "LED Headlight Bulb", category: "accessories", subcategory: "auxiliary-lights", fitment: "unconfirmed", shortDescription: "LED replacement headlight bulb. The bulb base must match your headlight; bring the old bulb." }),
  item({ slug: "led-indicator-set", name: "LED Indicator Set", category: "accessories", subcategory: "auxiliary-lights", fitment: "unconfirmed", shortDescription: "LED turn indicators. LED indicators may need a matching flasher relay; ask us." }),
  item({ slug: "microfiber-cleaning-cloth", name: "Microfiber Cleaning Cloth", category: "accessories", subcategory: "cleaning-tools", shortDescription: "Soft cloth for drying and polishing without scratching paint." }),
  item({ slug: "chain-cleaning-brush", name: "Chain Cleaning Brush", category: "accessories", subcategory: "cleaning-tools", shortDescription: "Three-sided brush for scrubbing a drive chain with chain cleaner." }),
];

const hardware: Product[] = [
  item({ slug: "motorcycle-horn", name: "12 V Motorcycle Horn", category: "electrical", subcategory: "horn", fitment: "unconfirmed", shortDescription: "12-volt horn. Mounting and connectors differ between bikes." }),
  item({ slug: "blade-fuse-set", name: "Blade Fuse Set", category: "electrical", subcategory: "fuse", shortDescription: "Assorted blade fuses. Always replace a fuse with the same rating." }),
  item({ slug: "speedometer-cable", name: "Speedometer Cable", category: "cables-controls", subcategory: "speedometer-cable", fitment: "unconfirmed", shortDescription: "Speedometer cable for bikes with a cable-driven meter. Bring the old cable or tell us your model to match it." }),
  item({ slug: "inline-fuel-filter", name: "Inline Fuel Filter", category: "filters", subcategory: "fuel-filter", fitment: "unconfirmed", shortDescription: "Inline fuel filter for carburettor bikes with an external fuel line." }),
  item({ slug: "tubeless-tyre-valve", name: "Tubeless Tyre Valve", category: "wheels-tyres", subcategory: "tubes", shortDescription: "Snap-in valve for tubeless rims." }),
  item({ slug: "nuts-and-bolts-kit", name: "Assorted Nuts & Bolts Kit", category: "bearings-seals", subcategory: "fasteners", shortDescription: "Assorted nuts, bolts and flange bolts for general repairs." }),
  item({ slug: "o-ring-assortment", name: "O-Ring Assortment", category: "bearings-seals", subcategory: "o-rings", shortDescription: "Assorted rubber O-rings. Bring the old one so we can match the size." }),
  item({ slug: "grommet-damper-set", name: "Grommet & Rubber Damper Set", category: "bearings-seals", subcategory: "o-rings", shortDescription: "Rubber grommets and dampers for panel and lamp mountings." }),
  item({ slug: "washer-assortment", name: "Washer & Spring Washer Assortment", category: "bearings-seals", subcategory: "circlips", shortDescription: "Plain, spring and lock washers in common sizes." }),
  item({ slug: "circlip-set", name: "Circlip & Snap Ring Set", category: "bearings-seals", subcategory: "circlips", shortDescription: "Internal and external circlips in common sizes." }),
  item({ slug: "bush-collar-set", name: "Bush, Collar & Spacer Set", category: "bearings-seals", subcategory: "bushes", shortDescription: "Assorted bushes, collars and spacers. Bring the old part to match it." }),
  item({ slug: "ball-bearing-assortment", name: "Ball Bearing (by size)", category: "bearings-seals", subcategory: "bearings", shortDescription: "Sealed ball bearings by size number. Read the number on your old bearing, or bring it in." }),
];

export const universalProducts: Product[] = [...oilsAndFluids, ...accessories, ...hardware];
