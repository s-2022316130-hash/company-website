import { shopVCard } from "@/lib/vcard";

/** "Save contact": the shop's details as a vCard that phones add to their contacts. Built at deploy time. */
export const dynamic = "force-static";

export function GET() {
  return new Response(shopVCard(), {
    headers: {
      "Content-Type": "text/vcard; charset=utf-8",
      "Content-Disposition": 'attachment; filename="nirob-autos.vcf"',
    },
  });
}
