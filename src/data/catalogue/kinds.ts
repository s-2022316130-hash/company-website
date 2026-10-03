import type { PhotoKey } from "@/config/images";
import type { MotorcycleModel, ProductSpec, VariantSpec } from "@/lib/types";

/**
 * Part-kind taxonomy for model-specific catalogue records.
 *
 * Source: Nirob Auto's parts taxonomy, built from the part families named by the manufacturers'
 * Bangladesh after-sales material (Yamaha BD, TVS, Hero genuine parts) and common workshop usage.
 * A kind is a type of part, not a specific item: records made from it carry
 * compatibilityConfidence "needs-confirmation" unless an official source lists the exact fitment.
 *
 * `requires` blocks pairings the official spec contradicts (no disc pads for a drum wheel, no CVT belt
 * on a geared bike). `variant` narrows a record to the official variants that have the part.
 */

export type Requirement = (m: MotorcycleModel) => boolean;

const has = (list: string[] | undefined, value: string) => Boolean(list?.includes(value));
export const motorcycle: Requirement = (m) => m.type === "motorcycle";
export const scooter: Requirement = (m) => m.type === "scooter";
export const frontDisc: Requirement = (m) => has(m.spec?.frontBrake, "disc");
export const rearDisc: Requirement = (m) => has(m.spec?.rearBrake, "disc");
export const frontDrum: Requirement = (m) => has(m.spec?.frontBrake, "drum");
export const rearDrum: Requirement = (m) => has(m.spec?.rearBrake, "drum");
export const anyDisc: Requirement = (m) => frontDisc(m) || rearDisc(m);
export const anyDrum: Requirement = (m) => frontDrum(m) || rearDrum(m);
export const carburettor: Requirement = (m) => has(m.spec?.fuel, "carburettor");
export const injection: Requirement = (m) => has(m.spec?.fuel, "fi");
export const anyBike: Requirement = () => true;

/**
 * Oil filter elements. LISTED: the owner's manual lists an engine oil filter change (Pulsar 150,
 * Discover). LIKELY: listed for the shop to confirm; small commuters are left out because many use
 * only a strainer.
 */
export const OIL_FILTER_LISTED = new Set(["bajaj-pulsar-150", "bajaj-discover-110", "bajaj-discover-125"]);
const OIL_FILTER_LIKELY = new Set([
  "bajaj-pulsar-n160",
  "bajaj-pulsar-n250",
  "bajaj-pulsar-f250",
  "bajaj-pulsar-ns125",
  "yamaha-fzs-v4",
  "yamaha-r15-v4",
  "suzuki-gixxer",
  "suzuki-gixxer-sf",
  "suzuki-gixxer-250",
  "suzuki-gixxer-sf-250",
]);
export const oilFilter: Requirement = (m) => OIL_FILTER_LISTED.has(m.id) || OIL_FILTER_LIKELY.has(m.id);

const frontDiscV = (v: VariantSpec) => (v.frontBrake ? v.frontBrake.type === "disc" : undefined);
const rearDiscV = (v: VariantSpec) => (v.rearBrake ? v.rearBrake.type === "disc" : undefined);
const frontDrumV = (v: VariantSpec) => (v.frontBrake ? v.frontBrake.type === "drum" : undefined);
const rearDrumV = (v: VariantSpec) => (v.rearBrake ? v.rearBrake.type === "drum" : undefined);
const carbV = (v: VariantSpec) => (v.fuel ? v.fuel === "carburettor" : undefined);
const fiV = (v: VariantSpec) => (v.fuel ? v.fuel === "fi" : undefined);

export interface SplitValue {
  /** Slug suffix, e.g. "300mm". */
  key: string;
  /** Name suffix, e.g. "300 mm". */
  suffix: string;
  spec: ProductSpec;
}

export interface PartKind {
  label: string;
  category: string;
  subcategory: string;
  requires: Requirement;
  /** For models with official variant specs: true if the variant has this part, undefined if not stated. */
  variant?: (v: VariantSpec) => boolean | undefined;
  /** One record per distinct value (e.g. disc diameter) when the official variants differ. */
  splitBy?: (v: VariantSpec) => SplitValue | undefined;
  /** A label that depends on the model's official spec, e.g. monoshock vs twin shocks. */
  labelFor?: (m: MotorcycleModel) => string | undefined;
  fastMoving?: boolean;
  photo?: PhotoKey;
  aliases?: string[];
  describe: (bike: string) => string;
}

const discSize = (pick: (v: VariantSpec) => VariantSpec["frontBrake"], position: string) => (v: VariantSpec): SplitValue | undefined => {
  const b = pick(v);
  if (b?.type !== "disc" || !b.sizeMm) return undefined;
  return {
    key: `${b.sizeMm}mm`,
    suffix: `${b.sizeMm} mm`,
    spec: { label: `${position} disc diameter`, value: `${b.sizeMm} mm`, source: v.source },
  };
};

const shockLabel = (m: MotorcycleModel) => {
  const types = new Set((m.variants ?? []).map((v) => v.rearSuspension?.toLowerCase() ?? ""));
  if (types.size === 0) return undefined;
  if ([...types].every((t) => t.includes("mono"))) return "Rear Monoshock";
  if ([...types].every((t) => t.includes("twin"))) return "Rear Shock Absorber Pair";
  return undefined;
};

export const partKinds = {
  // ── Brakes ───────────────────────────────────────────────────────────────
  "front-brake-pad": {
    label: "Front Brake Pad",
    category: "brakes",
    subcategory: "brake-pads",
    requires: frontDisc,
    variant: frontDiscV,
    fastMoving: true,
    aliases: ["front pad", "disc pad"],
    describe: (b) => `Front disc brake pad set for the ${b}. Replace pads when the friction material is worn thin or braking feels weak, and have the disc checked at the same time.`,
  },
  "rear-brake-pad": {
    label: "Rear Brake Pad",
    category: "brakes",
    subcategory: "brake-pads",
    requires: rearDisc,
    variant: rearDiscV,
    fastMoving: true,
    aliases: ["rear pad", "disc pad"],
    describe: (b) => `Rear disc brake pad set for the ${b} (rear-disc variants). Worn pads lengthen stopping distances and can damage the disc.`,
  },
  "front-brake-shoe": {
    label: "Front Brake Shoe",
    category: "brakes",
    subcategory: "brake-shoe",
    requires: frontDrum,
    variant: frontDrumV,
    fastMoving: true,
    describe: (b) => `Front drum brake shoe pair for the ${b} (front-drum variants).`,
  },
  "rear-brake-shoe": {
    label: "Rear Brake Shoe",
    category: "brakes",
    subcategory: "brake-shoe",
    requires: rearDrum,
    variant: rearDrumV,
    fastMoving: true,
    describe: (b) => `Rear drum brake shoe pair for the ${b} (rear-drum variants). Worn shoes make the rear brake weak and can score the drum.`,
  },
  "front-brake-disc": {
    label: "Front Brake Disc",
    category: "brakes",
    subcategory: "brake-disc",
    requires: frontDisc,
    variant: frontDiscV,
    splitBy: discSize((v) => v.frontBrake, "Front"),
    describe: (b) => `Front brake disc (rotor) for the ${b}. A scored, warped or worn-thin disc should be replaced, usually together with new pads.`,
  },
  "rear-brake-disc": {
    label: "Rear Brake Disc",
    category: "brakes",
    subcategory: "brake-disc",
    requires: rearDisc,
    variant: rearDiscV,
    splitBy: discSize((v) => v.rearBrake, "Rear"),
    describe: (b) => `Rear brake disc (rotor) for the ${b} (rear-disc variants).`,
  },
  "front-caliper": {
    label: "Front Brake Caliper",
    category: "brakes",
    subcategory: "brake-caliper",
    requires: frontDisc,
    variant: frontDiscV,
    describe: (b) => `Front brake caliper assembly for the ${b}. A sticking caliper drags the brake and wears pads unevenly.`,
  },
  "caliper-seal-kit": {
    label: "Caliper Seal Kit",
    category: "brakes",
    subcategory: "brake-caliper",
    requires: frontDisc,
    variant: frontDiscV,
    aliases: ["caliper rubber kit"],
    describe: (b) => `Caliper piston seal and rubber kit for the ${b} front brake, for rebuilding a leaking or sticking caliper.`,
  },
  "master-cylinder-kit": {
    label: "Master Cylinder Repair Kit",
    category: "brakes",
    subcategory: "master-cylinder",
    requires: frontDisc,
    variant: frontDiscV,
    describe: (b) => `Front brake master cylinder repair kit for the ${b}. A spongy lever or fluid seeping at the lever points to worn master cylinder seals.`,
  },
  "front-brake-hose": {
    label: "Front Brake Hose",
    category: "brakes",
    subcategory: "brake-hose",
    requires: frontDisc,
    variant: frontDiscV,
    describe: (b) => `Front hydraulic brake hose for the ${b}. Replace a cracked, bulging or leaking hose straight away.`,
  },
  "brake-lever": {
    label: "Front Brake Lever",
    category: "brakes",
    subcategory: "brake-lever",
    requires: anyBike,
    describe: (b) => `Front brake lever for the ${b}. Replace a bent or cracked lever.`,
  },
  "brake-switch": {
    label: "Brake Light Switch",
    category: "brakes",
    subcategory: "brake-switch",
    requires: anyBike,
    aliases: ["stop lamp switch"],
    describe: (b) => `Brake (stop lamp) switch for the ${b}. If the brake light stays off or on, the switch is the usual cause.`,
  },
  "rear-brake-rod": {
    label: "Rear Brake Rod",
    category: "brakes",
    subcategory: "brake-hardware",
    requires: (m) => motorcycle(m) && rearDrum(m),
    variant: rearDrumV,
    describe: (b) => `Rear brake rod for the ${b} (rear-drum variants).`,
  },
  "brake-shoe-spring": {
    label: "Brake Shoe Spring Set",
    category: "brakes",
    subcategory: "brake-hardware",
    requires: anyDrum,
    describe: (b) => `Brake shoe return springs for the ${b} drum brakes, usually changed with the shoes.`,
  },

  // ── Chain & sprocket ─────────────────────────────────────────────────────
  "chain-sprocket-kit": {
    label: "Chain Sprocket Kit",
    category: "chain-drive",
    subcategory: "chain-sprocket-kit",
    requires: motorcycle,
    fastMoving: true,
    aliases: ["chain set", "chain kit"],
    describe: (b) => `Drive chain with front and rear sprockets for the ${b}. Chain and sprockets wear together, so they are usually replaced as a set.`,
  },
  "drive-chain": {
    label: "Drive Chain",
    category: "chain-drive",
    subcategory: "chain",
    requires: motorcycle,
    fastMoving: true,
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
  "chain-lock": {
    label: "Chain Lock (Master Link)",
    category: "chain-drive",
    subcategory: "chain",
    requires: motorcycle,
    aliases: ["chain clip"],
    describe: (b) => `Chain joining link for the ${b}'s drive chain. Match the chain size before ordering.`,
  },
  "chain-slider": {
    label: "Chain Slider",
    category: "chain-drive",
    subcategory: "chain-guide",
    requires: motorcycle,
    describe: (b) => `Swingarm chain slider for the ${b}. A worn-through slider lets the chain cut into the swingarm.`,
  },
  "chain-cover": {
    label: "Chain Cover",
    category: "chain-drive",
    subcategory: "chain-cover",
    requires: motorcycle,
    aliases: ["chain guard"],
    describe: (b) => `Chain cover (guard) for the ${b}.`,
  },
  "chain-adjuster": {
    label: "Chain Adjuster Set",
    category: "chain-drive",
    subcategory: "chain-adjuster",
    requires: motorcycle,
    describe: (b) => `Rear axle chain adjusters for the ${b}.`,
  },
  "cush-drive-rubber": {
    label: "Rear Hub Cush Drive Rubber",
    category: "chain-drive",
    subcategory: "cush-drive",
    requires: motorcycle,
    aliases: ["coupling rubber", "hub damper"],
    describe: (b) => `Rear hub cush drive (coupling) rubbers for the ${b}. Worn rubbers cause a clunk when you open and close the throttle.`,
  },

  // ── Engine ───────────────────────────────────────────────────────────────
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
  "cylinder-head": {
    label: "Cylinder Head Assembly",
    category: "engine",
    subcategory: "cylinder-head",
    requires: anyBike,
    describe: (b) => `Cylinder head assembly for the ${b}, for heads with damaged threads, warped faces or worn valve seats.`,
  },
  "gasket-set": {
    label: "Engine Gasket Set",
    category: "engine",
    subcategory: "gasket",
    requires: anyBike,
    aliases: ["packing set", "full gasket kit"],
    describe: (b) => `Engine gasket set for the ${b}, needed whenever the engine or top end is opened.`,
  },
  "head-gasket": {
    label: "Cylinder Head Gasket",
    category: "engine",
    subcategory: "gasket",
    requires: anyBike,
    describe: (b) => `Cylinder head gasket for the ${b}.`,
  },
  "crankcase-cover-gasket": {
    label: "Crankcase Cover Gasket",
    category: "engine",
    subcategory: "gasket",
    requires: anyBike,
    describe: (b) => `Crankcase cover gasket for the ${b}. Replace it whenever the cover comes off.`,
  },
  "cam-chain": {
    label: "Cam Chain",
    category: "engine",
    subcategory: "timing-chain",
    requires: anyBike,
    aliases: ["timing chain"],
    describe: (b) => `Cam (timing) chain for the ${b}. A worn cam chain is often heard as a rattle from the top of the engine.`,
  },
  "cam-chain-tensioner": {
    label: "Cam Chain Tensioner",
    category: "engine",
    subcategory: "timing-chain",
    requires: anyBike,
    describe: (b) => `Cam chain tensioner for the ${b}, often replaced together with the cam chain.`,
  },
  "valve-set": {
    label: "Engine Valve Set",
    category: "engine",
    subcategory: "valve",
    requires: anyBike,
    describe: (b) => `Inlet and exhaust valve set for the ${b} engine.`,
  },
  "valve-seal-set": {
    label: "Valve Stem Seal Set",
    category: "engine",
    subcategory: "valve",
    requires: anyBike,
    aliases: ["valve seal"],
    describe: (b) => `Valve stem seal set for the ${b}. Worn seals let oil into the combustion chamber, often seen as smoke at start-up.`,
  },
  camshaft: {
    label: "Camshaft",
    category: "engine",
    subcategory: "camshaft",
    requires: anyBike,
    describe: (b) => `Camshaft for the ${b} engine.`,
  },
  "rocker-arm": {
    label: "Rocker Arm Set",
    category: "engine",
    subcategory: "rocker-arm",
    requires: anyBike,
    describe: (b) => `Valve rocker arm set for the ${b}.`,
  },
  "oil-pump": {
    label: "Oil Pump Assembly",
    category: "engine",
    subcategory: "oil-pump",
    requires: anyBike,
    describe: (b) => `Engine oil pump assembly for the ${b}.`,
  },
  "oil-strainer": {
    label: "Oil Strainer",
    category: "engine",
    subcategory: "oil-pump",
    requires: anyBike,
    aliases: ["oil screen"],
    describe: (b) => `Engine oil strainer (screen) for the ${b}, cleaned at oil changes.`,
  },
  crankshaft: {
    label: "Crankshaft Assembly",
    category: "engine",
    subcategory: "crankshaft",
    requires: anyBike,
    aliases: ["connecting rod"],
    describe: (b) => `Crankshaft and connecting rod assembly for the ${b}, for a worn big end or a damaged crank.`,
  },
  "crank-bearing": {
    label: "Crankshaft Bearing",
    category: "engine",
    subcategory: "engine-bearing",
    requires: anyBike,
    describe: (b) => `Crankshaft main bearing for the ${b}.`,
  },
  "oil-seal-kit": {
    label: "Engine Oil Seal Kit",
    category: "bearings-seals",
    subcategory: "oil-seal",
    requires: anyBike,
    describe: (b) => `Engine oil seal kit for the ${b}, for stopping leaks at the crank and gear shafts.`,
  },

  // ── Clutch & transmission ────────────────────────────────────────────────
  "clutch-plate-set": {
    label: "Clutch Plate Set",
    category: "clutch-transmission",
    subcategory: "clutch-plate",
    requires: motorcycle,
    fastMoving: true,
    aliases: ["friction plate"],
    describe: (b) => `Clutch friction plate set for the ${b}. Worn plates make the clutch slip under load.`,
  },
  "clutch-steel-plate-set": {
    label: "Clutch Steel Plate Set",
    category: "clutch-transmission",
    subcategory: "clutch-plate",
    requires: motorcycle,
    describe: (b) => `Clutch steel (plain) plate set for the ${b}, replaced when plates are blued or warped.`,
  },
  "clutch-spring-set": {
    label: "Clutch Spring Set",
    category: "clutch-transmission",
    subcategory: "clutch-spring",
    requires: motorcycle,
    describe: (b) => `Clutch spring set for the ${b}, often replaced along with the clutch plates.`,
  },
  "clutch-hub": {
    label: "Clutch Hub (Boss)",
    category: "clutch-transmission",
    subcategory: "clutch-hub",
    requires: motorcycle,
    aliases: ["clutch boss", "clutch centre"],
    describe: (b) => `Clutch hub (boss / centre) for the ${b}. Notched grooves make the clutch grab and drag.`,
  },
  "clutch-housing": {
    label: "Clutch Housing (Outer)",
    category: "clutch-transmission",
    subcategory: "clutch-hub",
    requires: motorcycle,
    aliases: ["clutch outer"],
    describe: (b) => `Clutch housing (outer basket) for the ${b}.`,
  },
  "clutch-lever": {
    label: "Clutch Lever",
    category: "clutch-transmission",
    subcategory: "clutch-lever",
    requires: motorcycle,
    describe: (b) => `Clutch lever for the ${b}. Replace a bent or cracked lever.`,
  },
  "gear-lever": {
    label: "Gear Shift Lever",
    category: "clutch-transmission",
    subcategory: "gear-lever",
    requires: motorcycle,
    describe: (b) => `Gear shift lever for the ${b}. Replace a bent lever before it makes gear changes vague.`,
  },
  "main-shaft": {
    label: "Gearbox Main Shaft",
    category: "clutch-transmission",
    subcategory: "gear-components",
    requires: motorcycle,
    aliases: ["input shaft"],
    describe: (b) => `Gearbox main (input) shaft for the ${b}.`,
  },
  "counter-shaft": {
    label: "Gearbox Counter Shaft",
    category: "clutch-transmission",
    subcategory: "gear-components",
    requires: motorcycle,
    aliases: ["output shaft"],
    describe: (b) => `Gearbox counter (output) shaft for the ${b}.`,
  },
  "shift-fork-set": {
    label: "Gear Shift Fork Set",
    category: "clutch-transmission",
    subcategory: "gear-components",
    requires: motorcycle,
    describe: (b) => `Gear shift fork set for the ${b}. Worn forks cause jumping out of gear.`,
  },
  "shift-drum": {
    label: "Gear Shift Drum",
    category: "clutch-transmission",
    subcategory: "gear-components",
    requires: motorcycle,
    aliases: ["gear selector drum"],
    describe: (b) => `Gear shift (selector) drum for the ${b}.`,
  },
  "selector-shaft": {
    label: "Gear Selector Shaft",
    category: "clutch-transmission",
    subcategory: "gear-components",
    requires: motorcycle,
    aliases: ["gear shifter spindle"],
    describe: (b) => `Gear selector shaft (shifter spindle) for the ${b}, with its return spring.`,
  },
  "cvt-belt": {
    label: "CVT Drive Belt",
    category: "clutch-transmission",
    subcategory: "cvt-belt",
    requires: scooter,
    fastMoving: true,
    aliases: ["drive belt", "v belt"],
    describe: (b) => `CVT drive belt for the ${b}. A worn belt causes slipping and slow pick-up.`,
  },

  // ── Filters & spark plugs ────────────────────────────────────────────────
  "air-filter": {
    label: "Air Filter",
    category: "filters",
    subcategory: "air-filter",
    requires: anyBike,
    fastMoving: true,
    aliases: ["air cleaner"],
    describe: (b) => `Air filter element for the ${b}. A clogged filter costs power and fuel economy.`,
  },
  "oil-filter": {
    label: "Oil Filter",
    category: "filters",
    subcategory: "oil-filter",
    requires: oilFilter,
    fastMoving: true,
    describe: (b) => `Oil filter element for the ${b}, usually changed together with the engine oil.`,
  },
  "spark-plug": {
    label: "Spark Plug",
    category: "filters",
    subcategory: "spark-plug",
    requires: anyBike,
    fastMoving: true,
    describe: (b) => `Spark plug for the ${b}. Ask us for the correct plug type for your engine.`,
  },

  // ── Electrical ───────────────────────────────────────────────────────────
  battery: {
    label: "Battery",
    category: "electrical",
    subcategory: "battery",
    requires: anyBike,
    fastMoving: true,
    describe: (b) => `Battery for the ${b}. Ask us to confirm the size and terminal layout before ordering.`,
  },
  "ignition-coil": {
    label: "Ignition Coil",
    category: "electrical",
    subcategory: "ignition-coil",
    requires: anyBike,
    describe: (b) => `Ignition coil for the ${b}. A failing coil can cause misfiring or hard starting.`,
  },
  "plug-cap": {
    label: "Spark Plug Cap",
    category: "electrical",
    subcategory: "plug-cap",
    requires: anyBike,
    describe: (b) => `Spark plug cap for the ${b}. A cracked cap can cause misfires in wet weather.`,
  },
  "regulator-rectifier": {
    label: "Regulator Rectifier",
    category: "electrical",
    subcategory: "rectifier",
    requires: anyBike,
    aliases: ["rectifier", "regulator"],
    describe: (b) => `Regulator rectifier for the ${b}. It keeps the battery charging at the right voltage.`,
  },
  stator: {
    label: "Stator Coil Assembly",
    category: "electrical",
    subcategory: "stator",
    requires: anyBike,
    aliases: ["magneto coil"],
    describe: (b) => `Stator (magneto) coil assembly for the ${b}. A burnt stator stops the battery charging.`,
  },
  "magneto-rotor": {
    label: "Magneto Rotor",
    category: "electrical",
    subcategory: "stator",
    requires: anyBike,
    describe: (b) => `Magneto rotor (flywheel) for the ${b}.`,
  },
  "cdi-unit": {
    label: "CDI Unit",
    category: "electrical",
    subcategory: "cdi-ecu",
    requires: carburettor,
    variant: carbV,
    aliases: ["cdi"],
    describe: (b) => `CDI ignition unit for the ${b} (carburettor variants).`,
  },
  "starter-motor": {
    label: "Starter Motor",
    category: "electrical",
    subcategory: "starter-motor",
    requires: anyBike,
    aliases: ["self motor"],
    describe: (b) => `Electric starter (self) motor for the ${b}.`,
  },
  "starter-clutch": {
    label: "Starter Clutch",
    category: "electrical",
    subcategory: "starter-motor",
    requires: anyBike,
    describe: (b) => `Starter clutch (one-way clutch) for the ${b}. If the starter spins but the engine doesn't turn, the starter clutch is a likely cause.`,
  },
  "starter-relay": {
    label: "Starter Relay",
    category: "electrical",
    subcategory: "relay",
    requires: anyBike,
    describe: (b) => `Starter relay for the ${b}. A clicking sound without the starter turning can point to a faulty relay.`,
  },
  "indicator-relay": {
    label: "Indicator Relay (Flasher)",
    category: "electrical",
    subcategory: "relay",
    requires: anyBike,
    aliases: ["flasher"],
    describe: (b) => `Indicator flasher relay for the ${b}. Indicators that stay on or flash too fast often need a new relay.`,
  },
  "headlight-bulb": {
    label: "Headlight Bulb",
    category: "electrical",
    subcategory: "headlight-bulb",
    requires: anyBike,
    describe: (b) => `Headlight bulb for the ${b}. Bring the old bulb or tell us your variant so we match the base and wattage.`,
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
  "handle-switch": {
    label: "Left Handlebar Switch",
    category: "electrical",
    subcategory: "switches",
    requires: anyBike,
    aliases: ["handle switch", "pass switch", "dipper switch"],
    describe: (b) => `Left handlebar switch assembly (dipper, indicator, horn) for the ${b}.`,
  },
  "ignition-switch": {
    label: "Ignition Switch & Lock Set",
    category: "electrical",
    subcategory: "switches",
    requires: anyBike,
    aliases: ["lock set", "key set"],
    describe: (b) => `Ignition switch with steering and tank locks and keys for the ${b}.`,
  },
  "wiring-harness": {
    label: "Main Wiring Harness",
    category: "electrical",
    subcategory: "wiring",
    requires: anyBike,
    describe: (b) => `Main wiring harness for the ${b}. Tell us your variant: harnesses differ between FI, carburettor and ABS versions.`,
  },
  speedometer: {
    label: "Speedometer Assembly",
    category: "electrical",
    subcategory: "meter",
    requires: anyBike,
    aliases: ["meter", "digital meter"],
    describe: (b) => `Speedometer / instrument cluster for the ${b}.`,
  },

  // ── Fuel system ──────────────────────────────────────────────────────────
  carburettor: {
    label: "Carburettor",
    category: "fuel-system",
    subcategory: "carburetor",
    requires: carburettor,
    variant: carbV,
    aliases: ["carburetor", "carb"],
    describe: (b) => `Carburettor assembly for the ${b} (carburettor variants).`,
  },
  "carb-repair-kit": {
    label: "Carburettor Repair Kit",
    category: "fuel-system",
    subcategory: "carb-kit",
    requires: carburettor,
    variant: carbV,
    describe: (b) => `Carburettor repair kit (gaskets, float needle, jets) for the ${b} (carburettor variants).`,
  },
  "intake-rubber": {
    label: "Carburettor Intake Rubber",
    category: "fuel-system",
    subcategory: "intake",
    requires: carburettor,
    variant: carbV,
    aliases: ["manifold rubber", "rubber duct"],
    describe: (b) => `Carburettor intake rubber (manifold) for the ${b}. A cracked rubber lets in air and makes idling uneven.`,
  },
  "fuel-tap": {
    label: "Fuel Tap (Fuel Cock)",
    category: "fuel-system",
    subcategory: "fuel-tap",
    requires: carburettor,
    variant: carbV,
    aliases: ["fuel cock", "petrol tap"],
    describe: (b) => `Fuel tap (fuel cock) for the ${b}.`,
  },
  "fuel-injector": {
    label: "Fuel Injector",
    category: "fuel-system",
    subcategory: "fuel-injector",
    requires: injection,
    variant: fiV,
    describe: (b) => `Fuel injector for the ${b} (fuel-injected variants).`,
  },
  "throttle-body": {
    label: "Throttle Body",
    category: "fuel-system",
    subcategory: "throttle-body",
    requires: injection,
    variant: fiV,
    describe: (b) => `Throttle body for the ${b} (fuel-injected variants).`,
  },
  "fuel-pump": {
    label: "Fuel Pump Assembly",
    category: "fuel-system",
    subcategory: "fuel-pump",
    requires: injection,
    variant: fiV,
    describe: (b) => `In-tank fuel pump assembly for the ${b} (fuel-injected variants).`,
  },
  "fuel-pipe": {
    label: "Fuel Pipe",
    category: "fuel-system",
    subcategory: "fuel-hose",
    requires: anyBike,
    aliases: ["fuel hose", "fuel line"],
    describe: (b) => `Fuel pipe for the ${b}. Replace a hardened or cracked pipe; petrol leaks are a fire risk.`,
  },
  "fuel-tank-cap": {
    label: "Fuel Tank Cap",
    category: "fuel-system",
    subcategory: "fuel-tap",
    requires: anyBike,
    aliases: ["tank cap", "tank lock"],
    describe: (b) => `Fuel tank cap with lock for the ${b}.`,
  },

  // ── Cables & controls ────────────────────────────────────────────────────
  "clutch-cable": {
    label: "Clutch Cable",
    category: "cables-controls",
    subcategory: "clutch-cable",
    requires: motorcycle,
    fastMoving: true,
    describe: (b) => `Clutch cable for the ${b}. Replace a cable that is frayed, stiff or keeps going out of adjustment.`,
  },
  "throttle-cable": {
    label: "Throttle Cable",
    category: "cables-controls",
    subcategory: "throttle-cable",
    requires: anyBike,
    fastMoving: true,
    aliases: ["accelerator cable"],
    describe: (b) => `Throttle (accelerator) cable for the ${b}. The throttle should snap back closed on its own.`,
  },
  "front-brake-cable": {
    label: "Front Brake Cable",
    category: "cables-controls",
    subcategory: "brake-cable",
    requires: frontDrum,
    variant: frontDrumV,
    fastMoving: true,
    describe: (b) => `Front brake cable for the ${b} (front-drum variants).`,
  },
  "rear-brake-cable": {
    label: "Rear Brake Cable",
    category: "cables-controls",
    subcategory: "brake-cable",
    requires: (m) => scooter(m) && rearDrum(m),
    describe: (b) => `Rear brake cable for the ${b}.`,
  },
  "speedometer-cable": {
    label: "Speedometer Cable",
    category: "cables-controls",
    subcategory: "speedometer-cable",
    requires: anyBike,
    describe: (b) => `Speedometer cable for the ${b} (cable-driven meters). Bring the old cable if you are unsure.`,
  },
  "speedometer-drive": {
    label: "Speedometer Drive Kit",
    category: "cables-controls",
    subcategory: "speedometer-drive",
    requires: anyBike,
    aliases: ["speedo drive"],
    describe: (b) => `Speedometer drive gear kit at the front wheel of the ${b} (cable-driven meters).`,
  },
  "rear-brake-pedal": {
    label: "Rear Brake Pedal",
    category: "cables-controls",
    subcategory: "foot-controls",
    requires: motorcycle,
    describe: (b) => `Rear brake pedal for the ${b}.`,
  },

  // ── Suspension & steering ────────────────────────────────────────────────
  "fork-oil-seal": {
    label: "Front Fork Oil Seal",
    category: "suspension-steering",
    subcategory: "fork-seal",
    requires: anyBike,
    fastMoving: true,
    aliases: ["fork seal"],
    describe: (b) => `Front fork oil seal pair for the ${b}. Oil on the fork tubes is the usual sign of a leaking seal.`,
  },
  "fork-dust-seal": {
    label: "Front Fork Dust Seal",
    category: "suspension-steering",
    subcategory: "fork-seal",
    requires: anyBike,
    describe: (b) => `Front fork dust seal pair for the ${b}, fitted above the oil seals to keep grit out.`,
  },
  "fork-pipe": {
    label: "Front Fork Pipe",
    category: "suspension-steering",
    subcategory: "front-fork",
    requires: anyBike,
    aliases: ["fork tube", "inner tube"],
    describe: (b) => `Front fork inner pipe (tube) for the ${b}. A bent or pitted pipe keeps destroying new seals.`,
  },
  "fork-bush-set": {
    label: "Fork Bush Set",
    category: "suspension-steering",
    subcategory: "fork-bush",
    requires: anyBike,
    describe: (b) => `Front fork guide bush set for the ${b}, replaced when the forks feel loose or knock.`,
  },
  "rear-shock": {
    label: "Rear Shock Absorber",
    category: "suspension-steering",
    subcategory: "rear-shock",
    requires: anyBike,
    labelFor: shockLabel,
    aliases: ["shocker", "monoshock"],
    describe: (b) => `Rear shock absorber for the ${b}. A bouncy or bottoming rear end usually means worn shocks.`,
  },
  "steering-bearing": {
    label: "Steering Bearing Set",
    category: "suspension-steering",
    subcategory: "steering-bearing",
    requires: anyBike,
    fastMoving: true,
    aliases: ["cone set", "ball racer"],
    describe: (b) => `Steering head bearing set (ball racer) for the ${b}. Notchy or loose steering points to worn bearings.`,
  },
  handlebar: {
    label: "Handlebar",
    category: "suspension-steering",
    subcategory: "handlebar",
    requires: anyBike,
    describe: (b) => `Handlebar for the ${b}. Replace a bar that is bent after a fall.`,
  },

  // ── Wheels ───────────────────────────────────────────────────────────────
  "wheel-bearing": {
    label: "Wheel Bearing",
    category: "wheels-tyres",
    subcategory: "wheel-bearing",
    requires: anyBike,
    fastMoving: true,
    describe: (b) => `Wheel bearing for the ${b}. Play or rumbling at the wheel means a bearing is worn.`,
  },
  "front-axle": {
    label: "Front Axle",
    category: "wheels-tyres",
    subcategory: "axle-hub",
    requires: anyBike,
    describe: (b) => `Front wheel axle for the ${b}.`,
  },
  "rear-axle": {
    label: "Rear Axle",
    category: "wheels-tyres",
    subcategory: "axle-hub",
    requires: anyBike,
    describe: (b) => `Rear wheel axle for the ${b}.`,
  },
  "wheel-spacer": {
    label: "Wheel Spacer Set",
    category: "wheels-tyres",
    subcategory: "axle-hub",
    requires: anyBike,
    describe: (b) => `Wheel spacer / collar set for the ${b}.`,
  },
  "rear-tyre": {
    label: "Rear Tyre",
    category: "wheels-tyres",
    subcategory: "tyres",
    requires: anyBike,
    describe: (b) => `Rear tyre for the ${b}. Tell us your current tyre size, shown on the tyre sidewall.`,
  },

  // ── Body ─────────────────────────────────────────────────────────────────
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
  "center-stand": {
    label: "Center Stand",
    category: "body",
    subcategory: "center-stand",
    requires: anyBike,
    aliases: ["main stand"],
    describe: (b) => `Center (main) stand for the ${b}.`,
  },
  "leg-guard": {
    label: "Leg Guard",
    category: "body",
    subcategory: "leg-guard",
    requires: motorcycle,
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
  "rear-fender": {
    label: "Rear Mudguard",
    category: "body",
    subcategory: "fender",
    requires: anyBike,
    aliases: ["rear fender"],
    describe: (b) => `Rear mudguard for the ${b}.`,
  },
  "side-panel": {
    label: "Side Panel Set",
    category: "body",
    subcategory: "side-panel",
    requires: anyBike,
    aliases: ["side cover"],
    describe: (b) => `Side panel (side cover) set for the ${b}. Colours vary; ask us which are available.`,
  },
  footrest: {
    label: "Rider Footrest Set",
    category: "body",
    subcategory: "footrest",
    requires: anyBike,
    describe: (b) => `Rider footrest set for the ${b}.`,
  },
  "pillion-footrest": {
    label: "Pillion Footrest Set",
    category: "body",
    subcategory: "footrest",
    requires: anyBike,
    describe: (b) => `Pillion (passenger) footrest set for the ${b}.`,
  },
  "grab-rail": {
    label: "Grab Rail",
    category: "body",
    subcategory: "grab-rail",
    requires: anyBike,
    aliases: ["grab handle"],
    describe: (b) => `Pillion grab rail for the ${b}.`,
  },
  "grip-set": {
    label: "Handle Grip Set",
    category: "accessories",
    subcategory: "grips-covers",
    requires: anyBike,
    aliases: ["handle grip"],
    describe: (b) => `Left and right handlebar grips for the ${b}.`,
  },
} satisfies Record<string, PartKind>;

export type PartKindKey = keyof typeof partKinds;
