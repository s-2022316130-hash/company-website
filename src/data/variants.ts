import type { VariantSpec } from "@/lib/types";

/**
 * Official per-variant specifications, keyed by model id.
 *
 * Restated as facts from each manufacturer's official Bangladesh spec page; no text or images are
 * copied. A field is left out when the page doesn't state it, or when the page contradicts itself
 * (the variant's `note` says so). Variants change between production years, so the site always
 * asks customers to confirm their bike before ordering.
 */

const BAJAJ_BD = "https://www.bajajauto.com/en-bd/bikes/";
const CHECKED = "2026-10-02";

function bajaj(slug: string, spec: Omit<VariantSpec, "source" | "checked">): VariantSpec {
  return { ...spec, source: `${BAJAJ_BD}${slug}`, checked: CHECKED };
}

export const modelVariants: Record<string, VariantSpec[]> = {
  "bajaj-pulsar-n250": [
    bajaj("pulsar-n250", {
      name: "Pulsar N250",
      engineCc: 249.07,
      valves: 2,
      fuel: "fi",
      cooling: "oil",
      abs: true,
      frontBrake: { type: "disc", sizeMm: 300 },
      rearBrake: { type: "disc", sizeMm: 230 },
      frontTyre: "110/70-17 54S",
      rearTyre: "140/70-17 66S",
      frontSuspension: "USD fork, 37 mm",
      rearSuspension: "Monoshock",
      battery: "12 V, 8 Ah VRLA",
      gears: 5,
    }),
  ],
  "bajaj-pulsar-f250": [
    bajaj("pulsar-f250", {
      name: "Pulsar F250",
      engineCc: 249.07,
      abs: true,
      frontBrake: { type: "disc", sizeMm: 300 },
      rearBrake: { type: "disc", sizeMm: 230 },
      frontTyre: "110/70-17, tubeless",
      rearTyre: "140/70-17, tubeless",
      frontSuspension: "USD fork",
      rearSuspension: "Monoshock, multi-step adjustable",
      battery: "12 V, 8 Ah VRLA",
      gears: 5,
    }),
  ],
  "bajaj-pulsar-n160": [
    bajaj("pulsar-n160", {
      name: "Pulsar N160",
      engineCc: 164.82,
      valves: 2,
      fuel: "fi",
      cooling: "air",
      abs: true,
      frontBrake: { type: "disc", sizeMm: 300 },
      rearBrake: { type: "disc", sizeMm: 230 },
      frontTyre: "100/80-17",
      rearTyre: "130/70-17",
      frontSuspension: "USD fork, 37 mm",
      rearSuspension: "Monoshock, Nitrox",
      battery: "12 V, 4 Ah VRLA",
      gears: 5,
    }),
    bajaj("pulsar-n160-dc-abs", {
      name: "Pulsar N160 DC ABS",
      engineCc: 164.82,
      valves: 2,
      fuel: "fi",
      cooling: "air",
      abs: true,
      frontBrake: { type: "disc", sizeMm: 300 },
      rearBrake: { type: "disc", sizeMm: 230 },
      frontTyre: "100/80-17",
      rearTyre: "130/70-17",
      rearSuspension: "Monoshock, Nitrox",
      battery: "12 V, 4 Ah VRLA",
      gears: 5,
    }),
    bajaj("pulsar-n160-td", {
      name: "Pulsar N160 TD",
      engineCc: 164.82,
      valves: 2,
      fuel: "carburettor",
      abs: true,
      frontBrake: { type: "disc", sizeMm: 260 },
      rearBrake: { type: "disc", sizeMm: 230 },
      frontTyre: "100/80-17, tubeless",
      rearTyre: "130/70-17, tubeless",
      rearSuspension: "Monoshock, Nitrox",
    }),
    bajaj("pulsar-n160-single-seat", {
      name: "Pulsar N160 Single Seat",
      engineCc: 164.82,
      valves: 2,
      fuel: "fi",
      cooling: "air",
      frontBrake: { type: "disc", sizeMm: 280 },
      rearBrake: { type: "disc", sizeMm: 230 },
      frontTyre: "100/80-17, tubeless",
      rearTyre: "130/70-17, tubeless",
      frontSuspension: "Telescopic fork",
      rearSuspension: "Monoshock, Nitrox",
    }),
  ],
  "bajaj-pulsar-150": [
    bajaj("pulsar-150-sd", {
      name: "Pulsar 150 SD",
      engineCc: 149.5,
      valves: 2,
      frontBrake: { type: "disc", sizeMm: 240 },
      rearBrake: { type: "drum", sizeMm: 130 },
      frontTyre: "80/100-17, tubeless",
      rearTyre: "100/90-17, tubeless",
      frontSuspension: "Telescopic fork",
      rearSuspension: "Twin shocks, Nitrox",
    }),
    bajaj("pulsar-150-sd-abs", {
      name: "Pulsar 150 SD ABS",
      engineCc: 149.5,
      valves: 2,
      abs: true,
      frontBrake: { type: "disc", sizeMm: 260 },
      rearBrake: { type: "drum", sizeMm: 130 },
      frontTyre: "80/100-17, tubeless",
      rearTyre: "100/90-17, tubeless",
      frontSuspension: "Telescopic fork",
      rearSuspension: "Twin shocks, Nitrox",
    }),
    bajaj("pulsar-150-td", {
      name: "Pulsar 150 TD",
      engineCc: 149.5,
      cooling: "air",
      frontBrake: { type: "disc", sizeMm: 260 },
      rearBrake: { type: "disc", sizeMm: 230 },
      frontTyre: "90/90-17, tubeless",
      rearTyre: "120/80-17, tubeless",
      frontSuspension: "Telescopic fork",
      rearSuspension: "Twin shocks, Nitrox",
      note: "The official page lists the front brake as \"single channel\", an ABS term, although this variant is not named ABS. Ask us to check your bike.",
    }),
    bajaj("pulsar-150-td-abs", {
      name: "Pulsar 150 TD ABS",
      engineCc: 149.5,
      abs: true,
      frontBrake: { type: "disc" },
      rearBrake: { type: "disc" },
      frontSuspension: "Telescopic fork",
      rearSuspension: "Twin shocks, Nitrox",
      note: "Brake and tyre sizes are left out: the official page gives the same figures as the single-disc model, which doesn't match a twin-disc variant.",
    }),
  ],
  "bajaj-pulsar-ns125": [
    bajaj("pulsar-ns125", {
      name: "Pulsar NS125",
      engineCc: 124.45,
      valves: 4,
      cooling: "air",
      frontBrake: { type: "disc", sizeMm: 240 },
      rearBrake: { type: "drum", sizeMm: 130 },
      frontTyre: "80/100-17, tubeless",
      rearTyre: "100/90-17, tubeless",
      frontSuspension: "Telescopic fork",
      rearSuspension: "Monoshock",
      battery: "4 Ah VRLA",
    }),
  ],
  "bajaj-discover-125": [
    bajaj("discover-125-disc", {
      name: "Discover 125 Disc",
      engineCc: 124.5,
      frontBrake: { type: "disc", sizeMm: 200 },
      frontSuspension: "Telescopic, 140 mm travel",
      rearSuspension: "Nitrox, 120 mm travel",
    }),
  ],
  "bajaj-discover-110": [
    bajaj("discover-110-disc", {
      name: "Discover 110 Disc",
      engineCc: 115.45,
      frontBrake: { type: "disc", sizeMm: 240 },
      rearBrake: { type: "drum", sizeMm: 110 },
      frontTyre: "100/80-17 46P, tubeless",
      rearTyre: "100/90-17 53P, tubeless",
      frontSuspension: "Telescopic, 140 mm travel",
      rearSuspension: "Nitrox gas-filled, 120 mm travel",
    }),
  ],
  "bajaj-platina-110-h": [
    bajaj("platina-110-h", {
      name: "Platina 110 H",
      engineCc: 115.45,
      cooling: "air",
      frontBrake: { type: "disc", sizeMm: 240 },
      rearBrake: { type: "drum", sizeMm: 110 },
      frontTyre: "80/100-17 46P, tubeless",
      rearTyre: "80/100-17 53P, tubeless",
      frontSuspension: "Hydraulic telescopic fork",
      rearSuspension: "SOS Nitrox",
    }),
  ],
  "bajaj-platina-100-es": [
    bajaj("platina-100-es", {
      name: "Platina 100 ES",
      engineCc: 99.59,
      valves: 2,
      frontBrake: { type: "drum", sizeMm: 130 },
      rearBrake: { type: "drum", sizeMm: 110 },
      frontTyre: "2.75-17 41P",
      rearTyre: "3.00-17 50P",
      frontSuspension: "Hydraulic telescopic fork",
      rearSuspension: "SNS",
    }),
  ],
  "bajaj-ct-100-es": [
    bajaj("ct-100-es", {
      name: "CT 100 ES",
      engineCc: 102,
      cooling: "air",
      frontBrake: { type: "drum", sizeMm: 110 },
      rearBrake: { type: "drum", sizeMm: 110 },
      frontTyre: "2.75-17 41P, tube type",
      rearTyre: "3.00-17 50P, tube type",
      frontSuspension: "Hydraulic telescopic fork",
      rearSuspension: "SNS",
    }),
  ],
};
