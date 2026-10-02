/**
 * Single source of truth for Nirob Autos business details.
 * Change a phone number, address or opening time here and every page follows.
 */

export interface PhoneNumber {
  /** Shown to customers, local format. */
  display: string;
  /** E.164 format, used for tel: links and structured data. */
  e164: string;
}

export interface WhatsAppNumber extends PhoneNumber {
  /** Digits only, as wa.me expects (country code, no +). */
  waId: string;
}

export type FulfilmentMethod = "pickup" | "courier";

export const business = {
  name: "Nirob Autos",
  banglaName: "নিরব অটো'স",
  tagline: "Motorcycle Spare Parts & Products",
  description:
    "Motorcycle spare parts, maintenance products and accessories for popular bike brands, from our store in Madhupur.",

  /** Proprietor, as printed on the shop's business card. */
  proprietor: "Basir Uddin Ahmed",

  /** As printed on the shop's business card. */
  address: {
    street: "Mymensingh Road, Natun Bazar",
    locality: "Madhupur",
    region: "Tangail",
    country: "Bangladesh",
    countryCode: "BD",
    /** One line, for display. */
    full: "Mymensingh Road, Natun Bazar, Madhupur, Tangail",
    /** For tight spaces such as the top bar. */
    short: "Natun Bazar, Madhupur, Tangail",
  },

  /**
   * Dealerships printed on the shop's business card (shown by the owner, 2026-10-02):
   * dealer for these companies, selling their genuine parts at company price.
   * `brand` links each one to the motorcycle brand it supplies parts for.
   */
  dealerships: [
    { company: "Uttara Motors", brand: "bajaj", note: "Bajaj distributor in Bangladesh" },
    { company: "TVS Motors", brand: "tvs" },
    { company: "Runner Automobiles", brand: "runner" },
    { company: "Hero Honda", brand: "hero" },
  ],

  /** Card: "all kinds of original parts of Yamaha, Suzuki and Honda sold at affordable prices". Not a dealership. */
  originalPartsBrands: ["yamaha", "suzuki", "honda"],

  phones: {
    /** Number customers should call to place or confirm an order. */
    orders: { display: "01922-687809", e164: "+8801922687809" },
    /** Store landline/mobile listed for the shop itself. */
    store: { display: "01713-583784", e164: "+8801713583784" },
  } satisfies Record<string, PhoneNumber>,

  /** Order requests built from the cart go to the first number; the rest are offered as alternatives. */
  whatsapp: [
    { display: "01743-691619", e164: "+8801743691619", waId: "8801743691619" },
    { display: "01865-726312", e164: "+8801865726312", waId: "8801865726312" },
  ] satisfies WhatsAppNumber[],

  hours: {
    label: "Every day, 9:00 AM – 10:00 PM",
    opens: "09:00",
    closes: "22:00",
    days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
  },

  /** Confirmed by the owner: store pickup and nationwide courier. No cash-on-delivery or online payment. */
  fulfilment: {
    pickup: {
      label: "Store pickup",
      description: "Collect from our shop on Mymensingh Road, Natun Bazar, Madhupur.",
    },
    courier: {
      label: "Courier delivery",
      description: "Sent by courier anywhere in Bangladesh. We confirm the delivery charge with you first.",
    },
  } satisfies Record<FulfilmentMethod, { label: string; description: string }>,

  /**
   * Google Maps directions link. Built from the address text because exact
   * coordinates have not been supplied; replace with the shop's own Maps link when available.
   */
  directionsUrl:
    "https://www.google.com/maps/search/?api=1&query=" +
    encodeURIComponent("Nirob Autos, Natun Bazar, Madhupur, Tangail, Bangladesh"),

  /** Paste a Google Maps "Embed a map" src URL here to show a map on the contact page. */
  mapEmbedUrl: null as string | null,

  /** Add real profile URLs only. Empty means no social icons are shown. */
  social: [] as { label: string; url: string }[],
} as const;

export const primaryWhatsApp = business.whatsapp[0];

export type Dealership = (typeof business.dealerships)[number];

/** The dealership that covers a motorcycle brand, if the shop holds one. */
export function dealershipFor(brandSlug: string): Dealership | undefined {
  return business.dealerships.find((d) => d.brand === brandSlug);
}

/** True when the shop states it sells original parts for this brand without being its dealer. */
export function sellsOriginalParts(brandSlug: string): boolean {
  return (business.originalPartsBrands as readonly string[]).includes(brandSlug);
}

/** "Uttara Motors (Bajaj), TVS Motors, Runner Automobiles and Hero Honda" */
export function dealerList(): string {
  const parts = business.dealerships.map((d) => (d.brand === "bajaj" ? `${d.company} (Bajaj)` : d.company));
  return parts.length > 1 ? `${parts.slice(0, -1).join(", ")} and ${parts.at(-1)}` : (parts[0] ?? "");
}

/** Text used wherever a price is not listed. */
export const PRICE_FALLBACK_LABEL = "Call for price";
