import { describe, expect, it } from "vitest";
import { business } from "@/config/business";
import { shopVCard } from "./vcard";

describe("shop vCard", () => {
  const card = shopVCard();
  const lines = card.split("\r\n");

  it("is a vCard 3.0 with CRLF line endings", () => {
    expect(lines[0]).toBe("BEGIN:VCARD");
    expect(lines[1]).toBe("VERSION:3.0");
    expect(card.endsWith("END:VCARD\r\n")).toBe(true);
    expect(card.replace(/\r\n/g, "")).not.toContain("\n");
  });

  it("carries the card's numbers, email and address", () => {
    for (const n of [business.phones.orders, business.phones.store, business.phones.store2]) expect(card).toContain(`:${n.e164}`);
    for (const w of business.whatsapp) expect(card).toContain(w.e164);
    expect(card).toContain(`EMAIL;TYPE=INTERNET:${business.email}`);
    expect(card).toContain(String.raw`ADR;TYPE=WORK:;;Mymensingh Road (N401)\, Natun Bazar;Madhupur;Tangail;;Bangladesh`);
    expect(lines.filter((l) => l.startsWith(`TEL;`) && l.endsWith(business.phones.orders.e164))).toHaveLength(1);
  });
});
