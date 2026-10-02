import type { PhotoKey } from "@/config/photos";
import type { MotorcycleModel, Product } from "@/lib/types";
import { brands } from "./brands";
import { models } from "./models";

/**
 * DEMO CATALOGUE — development data only.
 *
 * None of these records is confirmed Nirob Autos inventory. Every record:
 *  - has isSample: true (labelled "Demo catalogue", noindex, left out of the sitemap)
 *  - has no price, SKU, part number, specification or verified product type
 *  - lists only the model its own name refers to, never invented cross-compatibility
 *  - only exists where the part makes sense for that bike according to the official spec page
 *    (e.g. brake pads only for models with a disc brake, CVT belts only for scooters).
 *    The `requires` rules below are enforced by src/lib/catalog/catalog.test.ts.
 *
 * Replace this file (or the repository behind it) with the shop's real stock.
 */

type Requirement = (m: MotorcycleModel) => boolean;

const has = (list: string[] | undefined, value: string) => Boolean(list?.includes(value));
const motorcycle: Requirement = (m) => m.type === "motorcycle";
const scooter: Requirement = (m) => m.type === "scooter";
const frontDisc: Requirement = (m) => has(m.spec?.frontBrake, "disc");
const rearDisc: Requirement = (m) => has(m.spec?.rearBrake, "disc");
const frontDrum: Requirement = (m) => has(m.spec?.frontBrake, "drum");
const rearDrum: Requirement = (m) => has(m.spec?.rearBrake, "drum");
const carburettor: Requirement = (m) => has(m.spec?.fuel, "carburettor");
const commuter: Requirement = (m) => m.class === "commuter";
const anyBike: Requirement = () => true;

/**
 * Models known to use a replaceable oil filter element. Kept as an explicit list rather than
 * assumed for every bike, because many small commuters use only a strainer.
 */
const OIL_FILTER_MODELS = new Set(["yamaha-fzs-v4", "yamaha-r15-v4", "suzuki-gixxer", "suzuki-gixxer-sf"]);
const oilFilter: Requirement = (m) => OIL_FILTER_MODELS.has(m.id);

const confirm = "Call or WhatsApp to confirm fit, price and availability before ordering.";

export interface PartKind {
  label: string;
  category: string;
  subcategory: string;
  requires: Requirement;
  photo?: PhotoKey;
  aliases?: string[];
  describe: (bike: string) => string;
}

export const partKinds = {
  "front-brake-pad": {
    label: "Front Brake Pad",
    category: "brakes",
    subcategory: "brake-pads",
    requires: frontDisc,
    describe: (b) => `Front disc brake pad set for the ${b}. Replace pads when the friction material is worn thin or braking feels weak, and have the disc checked at the same time.`,
  },
  "rear-brake-pad": {
    label: "Rear Brake Pad",
    category: "brakes",
    subcategory: "brake-pads",
    requires: rearDisc,
    describe: (b) => `Rear disc brake pad set for the ${b} (disc-brake variants). Worn pads lengthen stopping distances and can damage the disc.`,
  },
  "rear-brake-shoe": {
    label: "Rear Brake Shoe",
    category: "brakes",
    subcategory: "brake-shoe",
    requires: rearDrum,
    describe: (b) => `Rear drum brake shoe pair for the ${b} (drum-brake variants). Worn shoes make the rear brake weak and can score the drum.`,
  },
  "front-brake-shoe": {
    label: "Front Brake Shoe",
    category: "brakes",
    subcategory: "brake-shoe",
    requires: frontDrum,
    describe: (b) => `Front drum brake shoe pair for the ${b} (drum-brake variants).`,
  },
  "front-brake-disc": {
    label: "Front Brake Disc",
    category: "brakes",
    subcategory: "brake-disc",
    requires: frontDisc,
    describe: (b) => `Front brake disc (rotor) for the ${b}. A scored, warped or worn-thin disc should be replaced, usually together with new pads.`,
  },
  "chain-sprocket-kit": {
    label: "Chain Sprocket Kit",
    category: "chain-drive",
    subcategory: "chain-sprocket-kit",
    requires: motorcycle,
    aliases: ["chain set"],
    describe: (b) => `Drive chain with front and rear sprockets for the ${b}. Chain and sprockets wear together, so they are usually replaced as a set.`,
  },
  "drive-chain": {
    label: "Drive Chain",
    category: "chain-drive",
    subcategory: "chain",
    requires: motorcycle,
    describe: (b) => `Drive chain for the ${b}. Replace a chain that has stretched past its adjustment limit or has stiff links.`,
  },
  "front-sprocket": {
    label: "Front Sprocket",
    category: "chain-drive",
    subcategory: "sprocket",
    requires: motorcycle,
    describe: (b) => `Front (engine) sprocket for the ${b}. Hooked or sharp teeth mean it is worn.`,
  },
  "rear-sprocket": {
    label: "Rear Sprocket",
    category: "chain-drive",
    subcategory: "sprocket",
    requires: motorcycle,
    describe: (b) => `Rear (wheel) sprocket for the ${b}. Usually changed together with the chain.`,
  },
  "piston-kit": {
    label: "Piston Kit",
    category: "engine",
    subcategory: "piston",
    requires: anyBike,
    describe: (b) => `Piston kit for the ${b} engine. Pistons come in standard and oversize; tell us which size your cylinder needs.`,
  },
  "piston-ring-set": {
    label: "Piston Ring Set",
    category: "engine",
    subcategory: "piston-ring",
    requires: anyBike,
    describe: (b) => `Piston ring set for the ${b}. Worn rings cause smoke, oil burning and low compression.`,
  },
  "cylinder-kit": {
    label: "Cylinder Kit",
    category: "engine",
    subcategory: "cylinder-block",
    requires: anyBike,
    aliases: ["block piston"],
    describe: (b) => `Cylinder block kit for the ${b}, used when the bore is worn or damaged.`,
  },
  "gasket-set": {
    label: "Engine Gasket Set",
    category: "engine",
    subcategory: "gasket",
    requires: anyBike,
    aliases: ["packing set"],
    describe: (b) => `Engine gasket set for the ${b}, needed whenever the engine or top end is opened.`,
  },
  "cam-chain": {
    label: "Cam Chain",
    category: "engine",
    subcategory: "timing-chain",
    requires: anyBike,
    aliases: ["timing chain"],
    describe: (b) => `Cam (timing) chain for the ${b}. A worn cam chain is often heard as a rattle from the top of the engine.`,
  },
  "valve-set": {
    label: "Engine Valve Set",
    category: "engine",
    subcategory: "valve",
    requires: anyBike,
    describe: (b) => `Inlet and exhaust valve set for the ${b} engine.`,
  },
  "clutch-plate-set": {
    label: "Clutch Plate Set",
    category: "clutch-transmission",
    subcategory: "clutch-plate",
    requires: motorcycle,
    describe: (b) => `Clutch friction plate set for the ${b}. Worn plates make the clutch slip under load.`,
  },
  "clutch-spring-set": {
    label: "Clutch Spring Set",
    category: "clutch-transmission",
    subcategory: "clutch-spring",
    requires: motorcycle,
    describe: (b) => `Clutch spring set for the ${b}, often replaced along with the clutch plates.`,
  },
  "gear-lever": {
    label: "Gear Shift Lever",
    category: "clutch-transmission",
    subcategory: "gear-lever",
    requires: motorcycle,
    describe: (b) => `Gear shift lever for the ${b}. Replace a bent lever before it makes gear changes vague.`,
  },
  "cvt-belt": {
    label: "CVT Drive Belt",
    category: "clutch-transmission",
    subcategory: "cvt-belt",
    requires: scooter,
    aliases: ["drive belt", "v belt"],
    describe: (b) => `CVT drive belt for the ${b}. A worn belt causes slipping and slow pick-up.`,
  },
  "air-filter": {
    label: "Air Filter",
    category: "filters",
    subcategory: "air-filter",
    requires: anyBike,
    describe: (b) => `Air filter element for the ${b}. A clogged filter costs power and fuel economy.`,
  },
  "oil-filter": {
    label: "Oil Filter",
    category: "filters",
    subcategory: "oil-filter",
    requires: oilFilter,
    describe: (b) => `Oil filter element for the ${b}, usually changed together with the engine oil.`,
  },
  "spark-plug": {
    label: "Spark Plug",
    category: "filters",
    subcategory: "spark-plug",
    requires: anyBike,
    describe: (b) => `Spark plug for the ${b}. Ask us for the correct plug type for your engine.`,
  },
  battery: {
    label: "Battery",
    category: "electrical",
    subcategory: "battery",
    requires: anyBike,
    describe: (b) => `Battery for the ${b}. Ask us to confirm the size and terminal layout before ordering.`,
  },
  "ignition-coil": {
    label: "Ignition Coil",
    category: "electrical",
    subcategory: "ignition-coil",
    requires: anyBike,
    describe: (b) => `Ignition coil for the ${b}. A failing coil can cause misfiring or hard starting.`,
  },
  "regulator-rectifier": {
    label: "Regulator Rectifier",
    category: "electrical",
    subcategory: "rectifier",
    requires: anyBike,
    aliases: ["rectifier", "regulator"],
    describe: (b) => `Regulator rectifier for the ${b}. It keeps the battery charging at the right voltage.`,
  },
  "indicator-set": {
    label: "Indicator Set",
    category: "electrical",
    subcategory: "indicator",
    requires: anyBike,
    describe: (b) => `Turn indicator set for the ${b}.`,
  },
  "tail-lamp": {
    label: "Tail Lamp Assembly",
    category: "electrical",
    subcategory: "tail-light",
    requires: anyBike,
    describe: (b) => `Tail lamp assembly for the ${b}.`,
  },
  "starter-relay": {
    label: "Starter Relay",
    category: "electrical",
    subcategory: "relay",
    requires: anyBike,
    describe: (b) => `Starter relay for the ${b}. A clicking sound without the starter turning can point to a faulty relay.`,
  },
  "clutch-cable": {
    label: "Clutch Cable",
    category: "cables-controls",
    subcategory: "clutch-cable",
    requires: motorcycle,
    describe: (b) => `Clutch cable for the ${b}. Replace a cable that is frayed, stiff or keeps going out of adjustment.`,
  },
  "throttle-cable": {
    label: "Throttle Cable",
    category: "cables-controls",
    subcategory: "throttle-cable",
    requires: anyBike,
    aliases: ["accelerator cable"],
    describe: (b) => `Throttle (accelerator) cable for the ${b}. The throttle should snap back closed on its own.`,
  },
  "front-brake-cable": {
    label: "Front Brake Cable",
    category: "cables-controls",
    subcategory: "brake-cable",
    requires: frontDrum,
    describe: (b) => `Front brake cable for the ${b} (drum-brake variants).`,
  },
  "fork-oil-seal": {
    label: "Front Fork Oil Seal",
    category: "suspension-steering",
    subcategory: "fork-seal",
    requires: anyBike,
    describe: (b) => `Front fork oil seal pair for the ${b}. Oil on the fork tubes is the usual sign of a leaking seal.`,
  },
  "rear-shock": {
    label: "Rear Shock Absorber",
    category: "suspension-steering",
    subcategory: "rear-shock",
    requires: anyBike,
    aliases: ["shocker"],
    describe: (b) => `Rear shock absorber for the ${b}. A bouncy or bottoming rear end usually means worn shocks.`,
  },
  "steering-bearing": {
    label: "Steering Bearing Set",
    category: "suspension-steering",
    subcategory: "steering-bearing",
    requires: anyBike,
    aliases: ["cone set"],
    describe: (b) => `Steering head bearing set for the ${b}. Notchy or loose steering points to worn bearings.`,
  },
  "wheel-bearing": {
    label: "Wheel Bearing",
    category: "wheels-tyres",
    subcategory: "wheel-bearing",
    requires: anyBike,
    describe: (b) => `Wheel bearing for the ${b}. Play or rumbling at the wheel means a bearing is worn.`,
  },
  "rear-tyre": {
    label: "Rear Tyre",
    category: "wheels-tyres",
    subcategory: "tyres",
    requires: anyBike,
    describe: (b) => `Rear tyre for the ${b}. Tell us your current tyre size, shown on the tyre sidewall.`,
  },
  "mirror-set": {
    label: "Rear View Mirror Set",
    category: "body",
    subcategory: "mirror",
    requires: anyBike,
    aliases: ["looking glass"],
    describe: (b) => `Left and right rear view mirrors for the ${b}.`,
  },
  "side-stand": {
    label: "Side Stand",
    category: "body",
    subcategory: "side-stand",
    requires: anyBike,
    describe: (b) => `Side stand for the ${b}.`,
  },
  "leg-guard": {
    label: "Leg Guard",
    category: "body",
    subcategory: "leg-guard",
    requires: commuter,
    aliases: ["crash guard"],
    describe: (b) => `Leg (crash) guard for the ${b}.`,
  },
  "headlight-assembly": {
    label: "Headlight Assembly",
    category: "body",
    subcategory: "headlight-assembly",
    requires: anyBike,
    describe: (b) => `Headlight assembly for the ${b}.`,
  },
  "front-fender": {
    label: "Front Mudguard",
    category: "body",
    subcategory: "fender",
    requires: anyBike,
    aliases: ["front fender"],
    describe: (b) => `Front mudguard (fender) for the ${b}. Colours vary; ask us which are available.`,
  },
  carburettor: {
    label: "Carburettor",
    category: "fuel-system",
    subcategory: "carburetor",
    requires: carburettor,
    aliases: ["carburetor", "carb"],
    describe: (b) => `Carburettor assembly for the ${b} (carburettor variants).`,
  },
  "oil-seal-kit": {
    label: "Engine Oil Seal Kit",
    category: "bearings-seals",
    subcategory: "oil-seal",
    requires: anyBike,
    describe: (b) => `Engine oil seal kit for the ${b}, for stopping leaks at the crank and gear shafts.`,
  },
} satisfies Record<string, PartKind>;

export type PartKindKey = keyof typeof partKinds;

/** F = featured, P = popular. */
type Flags = "" | "F" | "P" | "FP";

/**
 * Model-specific demo listings: [model id, part kind, flags].
 * Spread across brands and categories; every pairing satisfies its kind's `requires` rule.
 */
export const demoAssignments: [string, PartKindKey, Flags?][] = [
  // Brakes
  ["yamaha-fzs-v4", "front-brake-pad", "F"],
  ["yamaha-r15-v4", "front-brake-pad", "P"],
  ["bajaj-pulsar-150", "front-brake-pad", "P"],
  ["bajaj-pulsar-n160", "front-brake-pad"],
  ["suzuki-gixxer", "front-brake-pad", "P"],
  ["honda-sp-160", "front-brake-pad"],
  ["yamaha-mt15-v2", "rear-brake-pad"],
  ["suzuki-gixxer-sf", "rear-brake-pad"],
  ["honda-shine-100", "rear-brake-shoe", "P"],
  ["bajaj-platina-100-es", "rear-brake-shoe", "F"],
  ["honda-dio", "rear-brake-shoe"],
  ["bajaj-pulsar-n160", "front-brake-disc", "F"],

  // Chain & sprocket
  ["yamaha-fzs-v4", "chain-sprocket-kit", "P"],
  ["yamaha-r15-v4", "chain-sprocket-kit", "FP"],
  ["bajaj-pulsar-150", "chain-sprocket-kit", "P"],
  ["bajaj-pulsar-n160", "chain-sprocket-kit"],
  ["suzuki-gixxer", "chain-sprocket-kit", "P"],
  ["honda-sp-125", "chain-sprocket-kit"],
  ["honda-livo", "drive-chain"],
  ["bajaj-discover-125", "rear-sprocket"],
  ["yamaha-saluto-125", "front-sprocket"],

  // Engine
  ["bajaj-pulsar-150", "piston-kit"],
  ["honda-shine-100", "piston-kit"],
  ["yamaha-saluto-125", "piston-kit"],
  ["yamaha-fzs-v4", "piston-ring-set"],
  ["suzuki-gixxer", "piston-ring-set"],
  ["bajaj-platina-100-es", "cylinder-kit"],
  ["honda-livo", "gasket-set"],
  ["yamaha-r15-v4", "gasket-set"],
  ["suzuki-gsx-125", "gasket-set"],
  ["suzuki-hayate-ep", "cam-chain"],
  ["bajaj-discover-125", "cam-chain"],
  ["honda-sp-125", "valve-set"],

  // Clutch & transmission
  ["bajaj-pulsar-150", "clutch-plate-set", "F"],
  ["yamaha-fzs-v4", "clutch-plate-set"],
  ["suzuki-gixxer", "clutch-plate-set"],
  ["honda-sp-125", "clutch-plate-set"],
  ["bajaj-pulsar-ns125", "clutch-spring-set"],
  ["yamaha-r15-v3", "clutch-spring-set"],
  ["honda-shine-100", "gear-lever"],
  ["honda-dio", "cvt-belt", "P"],
  ["suzuki-access-125", "cvt-belt"],
  ["yamaha-ray-zr-125-fi", "cvt-belt"],

  // Filters & spark plugs
  ["yamaha-fzs-v4", "air-filter", "P"],
  ["bajaj-pulsar-150", "air-filter"],
  ["honda-shine-100", "air-filter"],
  ["suzuki-access-125", "air-filter"],
  ["yamaha-fzs-v4", "oil-filter", "F"],
  ["yamaha-r15-v4", "oil-filter"],
  ["suzuki-gixxer", "oil-filter", "P"],
  ["honda-shine-100", "spark-plug", "F"],
  ["bajaj-pulsar-150", "spark-plug"],
  ["yamaha-r15-v4", "spark-plug"],

  // Electrical
  ["yamaha-fzs-v4", "battery"],
  ["honda-shine-100", "battery", "P"],
  ["bajaj-pulsar-150", "ignition-coil"],
  ["yamaha-r15-v4", "regulator-rectifier"],
  ["bajaj-pulsar-n160", "regulator-rectifier"],
  ["suzuki-gixxer-sf", "tail-lamp"],
  ["honda-hornet-2-0", "indicator-set"],
  ["bajaj-discover-125", "starter-relay"],

  // Cables & controls
  ["bajaj-pulsar-150", "clutch-cable", "P"],
  ["yamaha-fzs-v2", "clutch-cable"],
  ["honda-livo", "clutch-cable"],
  ["yamaha-fzs-v4", "throttle-cable"],
  ["suzuki-gixxer", "throttle-cable"],
  ["honda-shine-100", "front-brake-cable"],
  ["bajaj-platina-100-es", "front-brake-cable"],

  // Suspension & steering
  ["yamaha-fzs-v4", "fork-oil-seal"],
  ["bajaj-pulsar-150", "fork-oil-seal"],
  ["suzuki-gixxer", "fork-oil-seal"],
  ["honda-shine-100", "rear-shock"],
  ["yamaha-fzs-v2", "rear-shock"],
  ["bajaj-pulsar-n160", "steering-bearing"],
  ["honda-sp-160", "steering-bearing"],

  // Wheels & tyres
  ["yamaha-fzs-v4", "rear-tyre"],
  ["suzuki-gixxer-sf", "rear-tyre"],
  ["bajaj-pulsar-150", "wheel-bearing"],
  ["honda-livo", "wheel-bearing"],

  // Body
  ["yamaha-fzs-v4", "mirror-set", "F"],
  ["bajaj-pulsar-150", "mirror-set"],
  ["honda-shine-100", "leg-guard"],
  ["bajaj-platina-100-es", "leg-guard"],
  ["honda-livo", "side-stand"],
  ["suzuki-gsx-125", "side-stand"],
  ["yamaha-mt15-v2", "headlight-assembly"],
  ["honda-hornet-2-0", "front-fender"],

  // Fuel system
  ["yamaha-saluto-125", "carburettor"],
  ["suzuki-hayate-ep", "carburettor"],

  // Bearings & seals
  ["bajaj-pulsar-150", "oil-seal-kit"],
  ["honda-shine-100", "oil-seal-kit"],

  // TVS
  ["tvs-apache-rtr-160-4v", "front-brake-pad", "P"],
  ["tvs-apache-rtr-160-4v", "chain-sprocket-kit", "FP"],
  ["tvs-apache-rtr-160-4v", "clutch-plate-set"],
  ["tvs-apache-rtr-160-4v", "battery"],
  ["tvs-apache-rtr-160-2v", "piston-kit"],
  ["tvs-apache-rtr-160-2v", "rear-shock"],
  ["tvs-raider-125", "rear-brake-shoe"],
  ["tvs-raider-125", "air-filter"],
  ["tvs-raider-125", "carburettor"],
  ["tvs-ntorq-125-re", "cvt-belt"],

  // Hero
  ["hero-splendor-plus-se", "rear-brake-shoe", "P"],
  ["hero-splendor-plus-se", "front-brake-shoe"],
  ["hero-splendor-plus-se", "chain-sprocket-kit", "P"],
  ["hero-splendor-plus-se", "piston-kit"],
  ["hero-splendor-plus-se", "rear-shock"],
  ["hero-splendor-plus-se", "leg-guard"],
  ["hero-hf-deluxe", "spark-plug", "P"],
  ["hero-hf-deluxe", "carburettor"],
  ["hero-hf-deluxe", "gasket-set"],
  ["hero-hunk-150r", "front-brake-pad"],
  ["hero-hunk-150r", "front-sprocket"],
  ["hero-hunk-150r", "clutch-plate-set"],
  ["hero-glamour", "battery"],
  ["hero-xoom-110", "cvt-belt"],
  ["hero-pleasure", "wheel-bearing"],
  // Runner
  ["runner-bullet-100", "front-brake-pad", "P"],
  ["runner-bullet-100", "rear-brake-shoe"],
  ["runner-bullet-100", "chain-sprocket-kit", "F"],
  ["runner-bullet-100", "clutch-cable"],
  ["runner-royal-plus-110", "front-brake-pad"],
  ["runner-royal-plus-110", "air-filter"],
  ["runner-turbo-125", "piston-kit"],
  ["runner-turbo-125", "clutch-plate-set"],
  ["runner-cheeta-100", "front-brake-shoe"],
  ["runner-cheeta-100", "front-brake-cable"],
  ["runner-ad80s-deluxe", "spark-plug"],
  ["runner-ad80s-deluxe", "leg-guard"],
  ["runner-knight-rider-v2-150", "rear-brake-pad"],
  ["runner-knight-rider-v2-150", "drive-chain"],
  ["runner-skooty-110", "cvt-belt"],
];

const modelById = new Map(models.map((m) => [m.id, m]));
const brandName = new Map(brands.map((b) => [b.slug, b.name]));

function modelProduct([modelId, kindKey, flags = ""]: [string, PartKindKey, Flags?]): Product {
  const m = modelById.get(modelId);
  if (!m) throw new Error(`Demo product refers to unknown model "${modelId}"`);
  const kind: PartKind = partKinds[kindKey];
  const bike = `${brandName.get(m.brand) ?? m.brand} ${m.name}`;
  const slug = `${m.slug}-${kindKey}`;
  return {
    id: slug,
    slug,
    name: `${bike} ${kind.label}`,
    category: kind.category,
    subcategory: kind.subcategory,
    images: [],
    photo: kind.photo,
    currency: "BDT",
    stockStatus: "call-for-availability",
    productType: "unknown",
    fitment: "model-specific",
    compatibleModels: [m.id],
    shortDescription: kind.describe(bike),
    description: `${kind.describe(bike)} ${confirm}`,
    searchableAliases: kind.aliases,
    isFeatured: flags.includes("F"),
    isPopular: flags.includes("P"),
    isSample: true,
  };
}

type UniversalInput = Pick<Product, "slug" | "name" | "category" | "subcategory" | "fitment" | "shortDescription"> &
  Partial<Pick<Product, "isFeatured" | "isPopular" | "searchableAliases" | "photo">>;

function universal(input: UniversalInput): Product {
  return {
    id: input.slug,
    images: [],
    currency: "BDT",
    stockStatus: "call-for-availability",
    productType: "unknown",
    compatibleModels: [],
    description: `${input.shortDescription} ${confirm}`,
    isSample: true,
    ...input,
  };
}

const universalProducts: Product[] = [
  // Engine oil & fluids — grades and pack sizes are confirmed with the customer, never assumed.
  universal({ slug: "mineral-engine-oil", name: "Mineral Motorcycle Engine Oil", category: "oils-fluids", subcategory: "engine-oil", fitment: "universal", searchableAliases: ["mobil"], shortDescription: "Mineral engine oil for four-stroke motorcycles. Tell us your bike model and we will confirm the right grade.", isPopular: true }),
  universal({ slug: "semi-synthetic-engine-oil", name: "Semi-Synthetic Motorcycle Engine Oil", category: "oils-fluids", subcategory: "engine-oil", fitment: "universal", searchableAliases: ["mobil"], shortDescription: "Semi-synthetic engine oil for four-stroke motorcycles. Tell us your bike model and we will confirm the right grade.", isFeatured: true, isPopular: true }),
  universal({ slug: "fully-synthetic-engine-oil", name: "Fully Synthetic Motorcycle Engine Oil", category: "oils-fluids", subcategory: "engine-oil", fitment: "universal", searchableAliases: ["mobil"], shortDescription: "Fully synthetic engine oil for four-stroke motorcycles. Tell us your bike model and we will confirm the right grade." }),
  universal({ slug: "scooter-engine-oil", name: "Scooter Engine Oil", category: "oils-fluids", subcategory: "engine-oil", fitment: "universal", searchableAliases: ["mobil"], shortDescription: "Engine oil for four-stroke automatic scooters. Ask us which grade suits your scooter." }),
  universal({ slug: "scooter-gear-oil", name: "Scooter Gear Oil", category: "oils-fluids", subcategory: "gear-oil", fitment: "universal", shortDescription: "Final-drive gear oil for automatic scooters." }),
  universal({ slug: "motorcycle-brake-fluid", name: "Brake Fluid", category: "oils-fluids", subcategory: "brake-fluid", fitment: "universal", shortDescription: "Hydraulic brake fluid. Use the fluid grade marked on your bike's brake reservoir cap; ask us if you are unsure." }),
  universal({ slug: "radiator-coolant", name: "Radiator Coolant", category: "oils-fluids", subcategory: "coolant", fitment: "universal", shortDescription: "Coolant for liquid-cooled motorcycles and scooters." }),
  universal({ slug: "chain-lubricant-spray", name: "Chain Lubricant Spray", category: "oils-fluids", subcategory: "chain-lubricant", fitment: "universal", searchableAliases: ["chain lube"], shortDescription: "Spray lubricant for motorcycle drive chains. Apply after cleaning, with the chain warm.", isFeatured: true, isPopular: true }),
  universal({ slug: "chain-cleaner", name: "Chain Cleaner", category: "oils-fluids", subcategory: "cleaning-care", fitment: "universal", shortDescription: "Cleaner for motorcycle drive chains, used before lubricating." }),
  universal({ slug: "multi-purpose-lubricant", name: "Multi-Purpose Lubricant Spray", category: "oils-fluids", subcategory: "cleaning-care", fitment: "universal", shortDescription: "Light lubricant spray for cables, pivots and locks." }),
  universal({ slug: "bike-wash-shampoo", name: "Bike Wash Shampoo", category: "oils-fluids", subcategory: "cleaning-care", fitment: "universal", shortDescription: "Shampoo for washing painted and plastic motorcycle parts." }),
  universal({ slug: "polish-and-wax", name: "Polish & Wax", category: "oils-fluids", subcategory: "cleaning-care", fitment: "universal", shortDescription: "Polish for paintwork and chrome." }),

  // Accessories
  universal({ slug: "motorcycle-mobile-holder", name: "Motorcycle Mobile Holder", category: "accessories", subcategory: "mobile-holder", fitment: "universal", shortDescription: "Handlebar-mounted phone holder.", isFeatured: true, isPopular: true }),
  universal({ slug: "usb-mobile-charger", name: "Motorcycle USB Mobile Charger", category: "accessories", subcategory: "usb-charger", fitment: "unconfirmed", shortDescription: "USB charging socket that runs from the bike's battery. Ask us about fitting it to your wiring." }),
  universal({ slug: "handlebar-grips", name: "Handlebar Grips", category: "accessories", subcategory: "grips-covers", fitment: "unconfirmed", shortDescription: "Replacement handlebar grips." }),
  universal({ slug: "seat-cover", name: "Seat Cover", category: "accessories", subcategory: "grips-covers", fitment: "unconfirmed", shortDescription: "Seat cover. Sizes differ between bikes; ask us for yours." }),
  universal({ slug: "tank-pad", name: "Tank Pad", category: "accessories", subcategory: "grips-covers", fitment: "universal", shortDescription: "Stick-on pad that protects the fuel tank paint." }),
  universal({ slug: "full-face-helmet", name: "Full-Face Helmet", category: "accessories", subcategory: "safety", fitment: "universal", shortDescription: "Full-face riding helmet. Sizes vary; try one in store or ask us for the size chart." }),
  universal({ slug: "open-face-helmet", name: "Open-Face Helmet", category: "accessories", subcategory: "safety", fitment: "universal", shortDescription: "Open-face riding helmet. Sizes vary; try one in store." }),
  universal({ slug: "riding-gloves", name: "Riding Gloves", category: "accessories", subcategory: "safety", fitment: "universal", photo: "ridingGloves", shortDescription: "Riding gloves. Sizes vary; ask us what is available." }),
  universal({ slug: "disc-brake-lock", name: "Disc Brake Lock", category: "accessories", subcategory: "utility", fitment: "unconfirmed", shortDescription: "Lock that clamps onto the brake disc. Check that it fits your disc before buying." }),
  universal({ slug: "motorcycle-body-cover", name: "Motorcycle Body Cover", category: "accessories", subcategory: "utility", fitment: "unconfirmed", shortDescription: "Dust and rain cover for a parked motorcycle. Sizes vary by bike." }),
  universal({ slug: "saddle-bag", name: "Saddle Bag", category: "accessories", subcategory: "utility", fitment: "unconfirmed", shortDescription: "Side bag for carrying small items. Ask us how it mounts on your bike." }),
  universal({ slug: "auxiliary-led-lights", name: "Auxiliary LED Lights", category: "accessories", subcategory: "auxiliary-lights", fitment: "unconfirmed", shortDescription: "Add-on LED lights. Fitting and wiring differ by bike; ask us before buying." }),

  // Universal service items
  universal({ slug: "motorcycle-horn", name: "12 V Motorcycle Horn", category: "electrical", subcategory: "horn", fitment: "unconfirmed", shortDescription: "12-volt horn. Mounting and connectors differ between bikes." }),
  universal({ slug: "speedometer-cable", name: "Speedometer Cable", category: "cables-controls", subcategory: "speedometer-cable", fitment: "unconfirmed", shortDescription: "Speedometer cable for bikes with a cable-driven meter. Bring the old cable or tell us your model to match it." }),
  universal({ slug: "inline-fuel-filter", name: "Inline Fuel Filter", category: "filters", subcategory: "fuel-filter", fitment: "unconfirmed", shortDescription: "Inline fuel filter for carburettor bikes with an external fuel line." }),
  universal({ slug: "nuts-and-bolts-kit", name: "Assorted Nuts & Bolts Kit", category: "bearings-seals", subcategory: "fasteners", fitment: "universal", shortDescription: "Assorted nuts, bolts and washers for general repairs." }),
];

export const products: Product[] = [...demoAssignments.map(modelProduct), ...universalProducts];
