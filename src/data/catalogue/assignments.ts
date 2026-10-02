import type { PartKindKey } from "./kinds";

/**
 * Which part kinds are catalogued for which model. Entries are "kind" or "kind:FLAGS" where
 * F = featured and P = popular. Every pairing must pass the kind's `requires` rule; this is checked by
 * src/lib/catalog/catalog.test.ts.
 *
 * These are catalogue entries, not stock: each becomes a "catalogue-only" record whose exact fitment
 * needs confirmation, unless officialFitment (below) cites a manufacturer source.
 */

type Entry = PartKindKey | `${PartKindKey}:${"F" | "P" | "FP"}`;

export const modelAssignments: Record<string, Entry[]> = {
  // ── Bajaj (Uttara Motors) ─────────────────────────────────────────────────
  "bajaj-pulsar-150": [
    "front-brake-pad:P", "rear-brake-pad", "rear-brake-shoe", "front-brake-disc", "master-cylinder-kit", "brake-lever",
    "chain-sprocket-kit:P", "chain-lock", "cush-drive-rubber",
    "clutch-plate-set:F", "clutch-lever", "clutch-cable:P", "throttle-cable", "main-shaft", "counter-shaft",
    "air-filter:P", "oil-filter",
    "piston-kit", "cylinder-kit", "gasket-set", "head-gasket", "cam-chain", "cam-chain-tensioner", "crank-bearing", "oil-seal-kit",
    "carburettor", "ignition-coil", "regulator-rectifier", "starter-relay", "wiring-harness",
    "fork-oil-seal", "fork-pipe", "steering-bearing", "wheel-bearing",
    "mirror-set", "leg-guard", "grab-rail", "grip-set",
  ],
  "bajaj-pulsar-n160": [
    "front-brake-pad:P", "rear-brake-pad", "front-brake-disc", "rear-brake-disc", "front-caliper", "caliper-seal-kit", "brake-switch",
    "chain-sprocket-kit:F", "chain-slider",
    "clutch-plate-set", "clutch-housing", "clutch-cable", "throttle-cable",
    "air-filter", "oil-filter", "spark-plug", "valve-seal-set",
    "fuel-injector", "carburettor", "ignition-coil", "regulator-rectifier", "ignition-switch", "tail-lamp",
    "fork-oil-seal", "steering-bearing", "wheel-bearing", "mirror-set", "rear-fender",
  ],
  "bajaj-pulsar-n250": [
    "front-brake-pad", "rear-brake-pad", "front-brake-disc", "rear-brake-disc", "front-brake-hose",
    "chain-sprocket-kit", "clutch-plate-set", "clutch-cable", "throttle-cable",
    "air-filter", "oil-filter", "spark-plug", "oil-pump",
    "throttle-body", "fuel-pump", "regulator-rectifier", "speedometer",
    "fork-oil-seal", "fork-dust-seal", "steering-bearing", "wheel-bearing",
  ],
  "bajaj-pulsar-f250": [
    "front-brake-pad", "rear-brake-pad", "front-brake-disc", "rear-brake-disc",
    "chain-sprocket-kit", "clutch-plate-set", "clutch-cable", "throttle-cable",
    "air-filter", "oil-filter", "spark-plug", "regulator-rectifier", "fuel-tank-cap",
    "fork-oil-seal", "rear-shock", "steering-bearing", "wheel-bearing", "headlight-assembly",
  ],
  "bajaj-pulsar-ns125": [
    "front-brake-pad", "rear-brake-shoe", "front-brake-disc",
    "chain-sprocket-kit", "clutch-plate-set", "clutch-spring-set", "clutch-cable", "shift-fork-set", "shift-drum", "selector-shaft",
    "air-filter", "oil-filter", "spark-plug",
    "piston-kit", "gasket-set", "crankcase-cover-gasket", "cylinder-head",
    "ignition-coil", "starter-relay", "stator",
    "fork-oil-seal", "fork-bush-set", "steering-bearing", "wheel-bearing", "handlebar",
  ],
  "bajaj-discover-125": [
    "front-brake-pad", "rear-brake-shoe",
    "drive-chain", "chain-sprocket-kit", "front-sprocket", "rear-sprocket",
    "clutch-plate-set", "clutch-steel-plate-set", "clutch-cable",
    "air-filter", "oil-filter", "oil-strainer",
    "piston-kit", "piston-ring-set", "cylinder-kit", "cam-chain",
    "carb-repair-kit", "fuel-pipe", "ignition-coil", "magneto-rotor", "starter-relay", "indicator-relay",
    "fork-oil-seal", "wheel-bearing", "pillion-footrest",
  ],
  "bajaj-discover-110": [
    "front-brake-pad", "rear-brake-shoe",
    "chain-sprocket-kit", "clutch-plate-set", "clutch-hub", "clutch-cable",
    "air-filter", "oil-filter",
    "piston-kit", "cam-chain", "valve-set",
    "carburettor", "intake-rubber", "fuel-tap", "fuel-pipe", "ignition-coil", "plug-cap",
    "fork-oil-seal", "wheel-bearing", "front-fender", "side-panel",
  ],
  "bajaj-platina-100-es": [
    "front-brake-shoe", "rear-brake-shoe:F", "brake-shoe-spring", "front-brake-cable",
    "chain-sprocket-kit", "chain-cover", "clutch-plate-set", "clutch-cable", "throttle-cable",
    "air-filter", "spark-plug",
    "piston-kit", "cylinder-kit", "cam-chain", "rocker-arm", "starter-clutch",
    "fork-oil-seal", "steering-bearing", "wheel-bearing",
    "leg-guard", "mirror-set", "side-stand", "footrest",
  ],
  "bajaj-platina-110-h": [
    "front-brake-pad", "rear-brake-shoe", "front-brake-disc", "rear-brake-rod", "rear-brake-pedal",
    "chain-sprocket-kit", "clutch-plate-set", "clutch-cable", "throttle-cable", "gear-lever",
    "air-filter", "spark-plug",
    "piston-kit", "cam-chain", "handle-switch", "indicator-set",
    "fork-oil-seal", "steering-bearing", "wheel-bearing", "leg-guard", "mirror-set",
  ],
  "bajaj-ct-100-es": [
    "front-brake-shoe", "rear-brake-shoe", "front-brake-cable",
    "chain-sprocket-kit", "chain-adjuster", "clutch-plate-set", "clutch-cable", "throttle-cable",
    "air-filter", "spark-plug",
    "piston-kit", "cylinder-kit", "cam-chain", "camshaft", "crankshaft", "starter-motor",
    "fork-oil-seal", "wheel-bearing", "front-axle", "rear-axle", "wheel-spacer",
    "leg-guard", "mirror-set", "side-stand", "center-stand",
  ],

  // ── Honda ─────────────────────────────────────────────────────────────────
  "honda-shine-100": [
    "front-brake-shoe", "rear-brake-shoe:P", "front-brake-cable", "chain-sprocket-kit", "clutch-plate-set", "clutch-cable",
    "air-filter", "spark-plug:F", "battery:P", "piston-kit", "gear-lever", "rear-shock", "leg-guard", "oil-seal-kit",
  ],
  "honda-shine-100-dx": ["rear-brake-shoe", "air-filter"],
  "honda-dream-110": ["rear-brake-shoe", "chain-sprocket-kit", "air-filter"],
  "honda-livo": ["front-brake-pad", "drive-chain", "gasket-set", "clutch-cable", "wheel-bearing", "side-stand"],
  "honda-sp-125": ["front-brake-pad", "chain-sprocket-kit", "clutch-plate-set", "air-filter", "valve-set"],
  "honda-sp-160": ["front-brake-pad", "rear-brake-pad", "chain-sprocket-kit", "clutch-plate-set", "steering-bearing"],
  "honda-xblade": ["front-brake-pad", "chain-sprocket-kit"],
  "honda-hornet-2-0": ["front-brake-pad", "chain-sprocket-kit", "indicator-set", "front-fender"],
  "honda-nx200": ["front-brake-pad", "chain-sprocket-kit"],
  "honda-cbr-150r": ["front-brake-pad", "chain-sprocket-kit"],
  "honda-dio": ["rear-brake-shoe", "cvt-belt:P", "air-filter"],
  "honda-cb-shine": ["clutch-plate-set", "piston-kit"],
  "honda-cb-hornet-160r": ["chain-sprocket-kit"],

  // ── Yamaha (official parts are in official.ts) ────────────────────────────
  "yamaha-fzs-v4": [
    "front-brake-pad:F", "chain-sprocket-kit:P", "clutch-plate-set", "oil-filter:F", "battery", "throttle-cable",
    "fork-oil-seal", "rear-tyre", "mirror-set:F",
  ],
  "yamaha-r15-v4": [
    "front-brake-pad:P", "rear-brake-pad", "chain-sprocket-kit:FP", "gasket-set", "oil-filter", "spark-plug", "regulator-rectifier",
  ],
  "yamaha-mt15-v2": ["front-brake-pad", "rear-brake-pad", "chain-sprocket-kit", "headlight-assembly"],
  "yamaha-r15-v3": ["clutch-spring-set"],
  "yamaha-fzs-v2": ["clutch-cable", "rear-shock"],
  "yamaha-fz-x": ["front-brake-pad"],
  "yamaha-fz-25": ["front-brake-pad", "air-filter"],
  "yamaha-fazer-fi-v2": ["front-brake-pad"],
  "yamaha-saluto-125": ["rear-brake-shoe", "front-sprocket", "piston-kit", "carburettor", "clutch-cable"],
  "yamaha-aerox-155": ["front-brake-pad", "cvt-belt"],
  "yamaha-ray-zr-125-fi": ["cvt-belt"],
  "yamaha-ray-zr-113": ["cvt-belt"],

  // ── Suzuki ────────────────────────────────────────────────────────────────
  "suzuki-gixxer": [
    "front-brake-pad:P", "rear-brake-pad", "chain-sprocket-kit:P", "piston-ring-set", "clutch-plate-set", "oil-filter:P",
    "air-filter", "spark-plug", "throttle-cable", "fork-oil-seal",
  ],
  "suzuki-gixxer-sf": ["front-brake-pad", "rear-brake-pad", "chain-sprocket-kit", "air-filter", "oil-filter", "clutch-plate-set", "fuel-injector", "tail-lamp", "rear-tyre"],
  "suzuki-gixxer-250": ["front-brake-pad", "chain-sprocket-kit", "oil-filter"],
  "suzuki-gixxer-sf-250": ["front-brake-pad"],
  "suzuki-gixxer-monotone": ["rear-brake-shoe", "carburettor"],
  "suzuki-gsx-r150": ["front-brake-pad", "chain-sprocket-kit"],
  "suzuki-gsx-125": ["rear-brake-shoe", "clutch-cable", "gasket-set", "side-stand"],
  "suzuki-hayate-ep": ["front-brake-shoe", "chain-sprocket-kit", "cam-chain", "carburettor"],
  "suzuki-access-125": ["front-brake-pad", "rear-brake-shoe", "rear-brake-cable", "cvt-belt", "air-filter"],

  // ── TVS (genuine-parts families: plugs, pads, bearings, clutch plates, block-piston kits, chain sets)
  "tvs-apache-rtr-160-4v": [
    "front-brake-pad:P", "rear-brake-pad", "front-brake-disc", "chain-sprocket-kit:FP", "clutch-plate-set", "clutch-cable",
    "air-filter", "spark-plug", "cam-chain", "cylinder-kit", "wheel-bearing", "battery",
  ],
  "tvs-apache-rtr-160-2v": ["front-brake-pad", "chain-sprocket-kit", "clutch-plate-set", "air-filter", "spark-plug", "piston-kit", "rear-shock"],
  "tvs-raider-125": ["front-brake-pad", "rear-brake-shoe", "chain-sprocket-kit", "clutch-plate-set", "air-filter", "spark-plug", "carburettor"],
  "tvs-ntorq-125-re": ["front-brake-pad", "rear-brake-shoe", "air-filter", "cvt-belt"],
  "tvs-metro-plus-110": ["chain-sprocket-kit", "clutch-plate-set"],

  // ── Hero (genuine-parts families: air cleaner, clutch friction kit, speedometer drive and cable,
  //    clutch and throttle cables, rear shock, ball bearing, disc pad, brake shoe, chain kit, cam chain, cylinder/gasket)
  "hero-splendor-plus-se": ["front-brake-shoe", "rear-brake-shoe:P", "chain-sprocket-kit:P", "piston-kit", "cylinder-kit", "rear-shock", "leg-guard"],
  "hero-splendor-plus-xtec": ["rear-brake-shoe", "air-filter", "clutch-cable", "speedometer-cable", "speedometer-drive"],
  "hero-splendor-plus-xtec-2-0": ["chain-sprocket-kit", "air-filter"],
  "hero-splendor-plus-sports": ["rear-brake-shoe"],
  "hero-hf-deluxe": ["rear-brake-shoe", "chain-sprocket-kit", "clutch-plate-set", "air-filter", "spark-plug:P", "cam-chain", "carburettor", "gasket-set"],
  "hero-hf-deluxe-new": ["front-brake-shoe"],
  "hero-passion-xpro": ["rear-brake-shoe", "clutch-cable"],
  "hero-glamour": ["front-brake-pad", "rear-brake-shoe", "chain-sprocket-kit", "battery"],
  "hero-ignitor-techno": ["front-brake-pad", "clutch-plate-set"],
  "hero-xtreme-125r": ["front-brake-pad", "chain-sprocket-kit"],
  "hero-hunk-150": ["rear-brake-pad", "chain-sprocket-kit"],
  "hero-hunk-150r": ["front-brake-pad", "front-sprocket", "clutch-plate-set"],
  "hero-xpulse-200-4v": ["front-brake-pad", "chain-sprocket-kit"],
  "hero-pleasure": ["front-brake-shoe", "cvt-belt", "wheel-bearing"],
  "hero-maestro-edge-xtec": ["cvt-belt", "air-filter"],
  "hero-xoom-110": ["cvt-belt"],

  // ── Runner ────────────────────────────────────────────────────────────────
  "runner-bullet-100": ["front-brake-pad:P", "rear-brake-shoe", "chain-sprocket-kit:F", "clutch-cable", "mirror-set", "fuel-pipe"],
  "runner-bullet-100-v2": ["front-brake-pad", "rear-brake-shoe", "chain-sprocket-kit"],
  "runner-royal-plus-110": ["front-brake-pad", "rear-brake-shoe", "air-filter", "chain-sprocket-kit", "clutch-cable"],
  "runner-turbo-125": ["front-brake-pad", "piston-kit", "clutch-plate-set", "chain-sprocket-kit"],
  "runner-cheeta-100": ["front-brake-shoe", "rear-brake-shoe", "front-brake-cable", "chain-sprocket-kit", "clutch-plate-set"],
  "runner-f100-6a": ["rear-brake-shoe"],
  "runner-ad80s-deluxe": ["spark-plug", "leg-guard"],
  "runner-ad80s-alloy": ["rear-brake-shoe"],
  "runner-kite-plus-110": ["front-brake-pad"],
  "runner-knight-rider-150": ["front-brake-pad", "rear-brake-shoe"],
  "runner-knight-rider-v2-150": ["front-brake-pad", "rear-brake-pad", "drive-chain", "chain-sprocket-kit"],
  "runner-xtreet-150": ["front-brake-pad", "rear-brake-pad"],
  "runner-bolt-165r": ["front-brake-pad", "rear-brake-pad"],
  "runner-skooty-110": ["front-brake-pad", "rear-brake-shoe", "cvt-belt"],
};

/**
 * Pairings that an official source names for the model, so the record's fitment is
 * "manufacturer-listed" instead of "needs-confirmation".
 */
const BAJAJ_MANUALS = "https://www.bajajauto.com/en-bd/-/media/globalbajajauto/common-media/owners-manual/";
export const officialFitment: Record<string, { name: string; url: string }> = {
  // Owner's manual maintenance charts list replacing the engine oil filter and cleaning the oil strainer.
  "bajaj-pulsar-150:oil-filter": { name: "Bajaj Pulsar 150 owner's manual", url: `${BAJAJ_MANUALS}pulsar/150-td.pdf` },
  "bajaj-discover-110:oil-filter": { name: "Bajaj Discover owner's manual", url: `${BAJAJ_MANUALS}discover/110.pdf` },
  "bajaj-discover-125:oil-filter": { name: "Bajaj Discover owner's manual", url: `${BAJAJ_MANUALS}discover/110.pdf` },
  "bajaj-discover-125:oil-strainer": { name: "Bajaj Discover owner's manual", url: `${BAJAJ_MANUALS}discover/110.pdf` },
};
