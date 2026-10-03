import { business } from "@/config/business";
import { siteUrl } from "@/config/site";

/** Escape a vCard text value (RFC 6350 §3.4): backslash, comma, semicolon and newlines. */
function esc(value: string): string {
  return value.replace(/\\/g, "\\\\").replace(/,/g, "\\,").replace(/;/g, "\\;").replace(/\r?\n/g, "\\n");
}

/**
 * The shop's details as a vCard 3.0, the format phones import when a customer taps "Save contact".
 * Built from config/business.ts, like everything else, so the card never drifts from the site.
 */
export function shopVCard(): string {
  const { address } = business;
  const phones = [
    { type: "WORK,VOICE", e164: business.phones.orders.e164 },
    { type: "WORK", e164: business.phones.store.e164 },
    { type: "WORK", e164: business.phones.store2.e164 },
    ...business.whatsapp
      .filter((w) => w.e164 !== business.phones.orders.e164)
      .map((w) => ({ type: "CELL", e164: w.e164 })),
  ];
  const lines = [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `FN:${esc(business.name)}`,
    `N:;${esc(business.name)};;;`,
    `ORG:${esc(business.name)}`,
    `NICKNAME:${esc(business.banglaName)}`,
    `TITLE:${esc(business.tagline)}`,
    ...phones.map((p) => `TEL;TYPE=${p.type}:${p.e164}`),
    `EMAIL;TYPE=INTERNET:${business.email}`,
    `ADR;TYPE=WORK:;;${esc(address.street)};${esc(address.locality)};${esc(address.region)};;${esc(address.country)}`,
    `URL:${siteUrl}`,
    `NOTE:${esc(
      `${business.trade} since ${business.foundedYear}. Open ${business.hours.label.toLowerCase()}. ` +
        `WhatsApp ${business.whatsapp.map((w) => w.display).join(", ")}. ` +
        `${business.mobileBanking.services.join(" and ")}: ${business.mobileBanking.number.display}.`,
    )}`,
    "END:VCARD",
  ];
  return `${lines.join("\r\n")}\r\n`;
}
