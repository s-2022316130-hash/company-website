/**
 * Motion tokens for animations driven from JavaScript (Web Animations API). They mirror the CSS
 * tokens in app/globals.css (--transition-duration-* and --ease-*); motion.test.ts keeps the two in step.
 */
export const duration = {
  fast: 150,
  small: 220,
  standard: 360,
  emphasis: 600,
  cinematic: 1200,
} as const;

export const easing = {
  ui: "cubic-bezier(0.2, 0, 0, 1)",
  card: "cubic-bezier(0.25, 1, 0.5, 1)",
  cinematic: "cubic-bezier(0.16, 1, 0.3, 1)",
  exit: "cubic-bezier(0.4, 0, 1, 1)",
} as const;

export function prefersReducedMotion(): boolean {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** Brief scale pulse for a changed counter or icon, e.g. the cart after an item is added. */
export function pulse(el: Element | null | undefined, scale = 1.12): void {
  if (!el || prefersReducedMotion() || typeof el.animate !== "function") return;
  el.animate([{ scale: "1" }, { scale: String(scale) }, { scale: "1" }], {
    duration: 300,
    easing: easing.ui,
  });
}
