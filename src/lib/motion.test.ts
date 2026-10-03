import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { duration, easing } from "./motion";

const css = readFileSync(join(process.cwd(), "src/app/globals.css"), "utf8");

function token(name: string): string | undefined {
  return css.match(new RegExp(`--${name}:\\s*([^;]+);`))?.[1].trim();
}

describe("motion tokens", () => {
  it("JavaScript durations match the CSS tokens", () => {
    for (const [name, ms] of Object.entries(duration)) {
      expect(token(`transition-duration-${name}`), name).toBe(`${ms}ms`);
    }
  });

  it("JavaScript easings match the CSS tokens", () => {
    for (const [name, curve] of Object.entries(easing)) {
      expect(token(`ease-${name}`), name).toBe(curve);
    }
  });

  it("durations stay inside the brief's timing scale", () => {
    expect(duration.fast).toBeGreaterThanOrEqual(120);
    expect(duration.fast).toBeLessThanOrEqual(180);
    expect(duration.small).toBeGreaterThanOrEqual(180);
    expect(duration.small).toBeLessThanOrEqual(250);
    expect(duration.standard).toBeGreaterThanOrEqual(300);
    expect(duration.standard).toBeLessThanOrEqual(450);
    expect(duration.emphasis).toBeGreaterThanOrEqual(500);
    expect(duration.emphasis).toBeLessThanOrEqual(800);
    expect(duration.cinematic).toBeGreaterThanOrEqual(800);
    expect(duration.cinematic).toBeLessThanOrEqual(1400);
  });

  it("reduced motion switches off movement, scroll-linked effects and loops", () => {
    const block = css.slice(css.indexOf("@media (prefers-reduced-motion: reduce)"));
    expect(block).toContain("animation-timeline: auto !important");
    expect(block).toContain("animation-iteration-count: 1 !important");
    expect(block).toContain("transition-duration: 0.01ms !important");
  });

  it("reveals only hide content when motion is allowed", () => {
    const pending = css.indexOf('[data-reveal-state="pending"]');
    const gate = css.lastIndexOf("@media (prefers-reduced-motion: no-preference)", pending);
    expect(pending).toBeGreaterThan(0);
    expect(gate).toBeGreaterThan(0);
  });
});
