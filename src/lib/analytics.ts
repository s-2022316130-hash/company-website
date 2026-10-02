/**
 * Analytics event points. No provider is connected: events are pushed to
 * `window.dataLayer` if a tag manager defines it later, and dispatched as a
 * DOM event so any provider can subscribe without touching components.
 */

export type AnalyticsEvent =
  | "product_view"
  | "product_search"
  | "filter_used"
  | "add_to_cart"
  | "remove_from_cart"
  | "begin_order"
  | "order_request_submitted"
  | "phone_click"
  | "whatsapp_click"
  | "directions_click"
  | "brand_view"
  | "model_view"
  | "category_view";

export type AnalyticsProps = Record<string, string | number | boolean | undefined>;

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
  }
}

export function track(event: AnalyticsEvent, props: AnalyticsProps = {}): void {
  if (typeof window === "undefined") return;
  window.dataLayer?.push({ event, ...props });
  window.dispatchEvent(new CustomEvent("nirob:analytics", { detail: { event, ...props } }));
}
