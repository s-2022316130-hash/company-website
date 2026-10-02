import type { OwnerManualFacts } from "@/lib/types";

/**
 * Maintenance facts from official owner's manuals, keyed by model id.
 *
 * Restated from the PDFs Bajaj publishes on bajajauto.com/en-bd/owners-zone (read 2026-10-02). Only facts
 * are taken (grades, quantities, part types, intervals); no text or images are copied. Where a manual
 * contradicts itself the value is left out or both figures are noted. Manuals can be older than the
 * current line-up (for example the Discover manual describes a drum-brake Discover 110), so brake and
 * tyre details come from the spec pages in `variants.ts` instead.
 */

const BAJAJ_MANUALS = "https://www.bajajauto.com/en-bd/-/media/globalbajajauto/common-media/owners-manual/";
const CHECKED = "2026-10-02";

const discoverCommon = {
  source: `${BAJAJ_MANUALS}discover/110.pdf`,
  checked: CHECKED,
  covers: "Discover 110 and Discover 125 owner's manual",
  sparkPlug: { types: "Champion PRZ9HC or Bosch UR4AC", count: 2, gap: "0.7–0.8 mm" },
  battery: "12 V, 5 Ah MF",
  brakeFluid: "DOT 3 or DOT 4 (front disc versions); replace every 30,000 km or 2 years",
  replaceIntervals: ["Brake shoes: every 15,000 km, or sooner if worn past the wear indicator"],
  tyrePressurePsi: { front: 25, rearSolo: 28.5, rearPillion: 32 },
  chain: { slackMm: "25–35 mm", lubrication: "Non-sealed chain: SAE 90 oil or chain spray every 500 km" },
  bulbs: [
    { label: "Headlamp", value: "12 V, 35/35 W" },
    { label: "Tail / stop lamp", value: "5/21 W bulb" },
    { label: "Turn indicators", value: "12 V, 10 W (4)" },
    { label: "Number plate lamp", value: "12 V, 3 W" },
  ],
  fuelSystem: "carburettor",
  serviceSchedule: "500–750 km, 4,500–5,000 km, 9,500–10,000 km, then every 5,000 km",
} satisfies Partial<OwnerManualFacts>;

const discoverOilNote =
  "The manual gives two oil-change intervals: after the first service then every 10,000 km in the engine oil section, but a change at every service in the maintenance chart. Ask us before you plan your next change.";

export const ownerManuals: Record<string, OwnerManualFacts> = {
  "bajaj-pulsar-150": {
    covers: "Pulsar 150, 150 Classic and 150 Twin Disc owner's manual, rev. 09 (May 2019)",
    source: `${BAJAJ_MANUALS}pulsar/150-td.pdf`,
    checked: CHECKED,
    engineOil: {
      grade: "SAE 20W50, API SL or JASO MA",
      serviceFillMl: 1000,
      overhaulFillMl: 1100,
      changeEvery: "After the first service, then every 5,000 km",
      topUpEvery: "Every 2,500 km",
    },
    sparkPlug: { types: "Champion RG4HC", count: 2, gap: "0.7–0.8 mm" },
    battery: "12 V, 4 Ah VRLA",
    brakeFluid: "DOT 3 or DOT 4; replace every 30,000 km or 2 years",
    replaceIntervals: ["Brake shoes and pads: every 15,000 km"],
    tyrePressurePsi: { front: 25, rearSolo: 28.5, rearPillion: 32 },
    chain: { slackMm: "25–35 mm", lubrication: "SAE 90 oil every 500 km" },
    bulbs: [
      { label: "Headlamp", value: "35/35 W, with two 5 W pilot lamps" },
      { label: "Tail / stop lamp", value: "LED" },
      { label: "Turn indicators", value: "10 W (4)" },
      { label: "Number plate lamp", value: "5 W" },
    ],
    fuelSystem: "carburettor",
    serviceSchedule: "500–750 km, 4,500–5,000 km, 9,500–10,000 km, then every 5,000 km",
    notes: ["The manual gives the spark plug gap as 0.7–0.8 mm in the specifications and 0.6–0.8 mm in the maintenance section."],
  },
  "bajaj-discover-110": {
    ...discoverCommon,
    engineOil: { grade: "SAE 10W30, API SL", serviceFillMl: 1000, overhaulFillMl: 1100, topUpEvery: "Every 5,000 km" },
    notes: [discoverOilNote],
  },
  "bajaj-discover-125": {
    ...discoverCommon,
    engineOil: { grade: "SAE 20W50, API SL or JASO MA", serviceFillMl: 1000, overhaulFillMl: 1100, topUpEvery: "Every 5,000 km" },
    notes: [discoverOilNote],
  },
};
