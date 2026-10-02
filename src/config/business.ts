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

  address: {
    street: "N401",
    locality: "Madhupur",
    country: "Bangladesh",
    countryCode: "BD",
    /** One line, for display. */
    full: "N401, Madhupur, Bangladesh",
  },

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
      description: "Collect from our shop at N401, Madhupur.",
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
    encodeURIComponent("Nirob Autos, N401, Madhupur, Bangladesh"),

  /** Paste a Google Maps "Embed a map" src URL here to show a map on the contact page. */
  mapEmbedUrl: null as string | null,

  /** Add real profile URLs only. Empty means no social icons are shown. */
  social: [] as { label: string; url: string }[],
} as const;

export const primaryWhatsApp = business.whatsapp[0];

/** Text used wherever a price is not listed. */
export const PRICE_FALLBACK_LABEL = "Call for price";
