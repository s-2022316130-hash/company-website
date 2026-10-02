import { PRICE_FALLBACK_LABEL } from "@/config/business";

const takaFormatter = new Intl.NumberFormat("en-BD", { maximumFractionDigits: 0 });

/** "৳1,250", or the call-for-price label when no price is set. Never invents a value. */
export function formatPrice(amount: number | undefined): string {
  if (amount === undefined) return PRICE_FALLBACK_LABEL;
  return `৳${takaFormatter.format(amount)}`;
}

export function pluralize(count: number, singular: string, plural = `${singular}s`): string {
  return `${count} ${count === 1 ? singular : plural}`;
}
