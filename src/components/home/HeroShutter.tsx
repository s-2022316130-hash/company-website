"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

/**
 * The homepage's one authored moment: a garage shutter rolls up off the hero (the shop's emblem is a
 * motorcycle in a garage), a work-light line rides its bottom edge, and the headline lines rise out
 * from behind it.
 *
 * The shutter is plain CSS (.hero-shutter) and covers the hero only until this runs; if JavaScript
 * never arrives, a CSS fallback lifts it. Hero content is never hidden by default. Reduced motion:
 * no shutter, content simply fades in.
 */
export function HeroShutter() {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const shutter = ref.current;
      const hero = shutter?.closest(".hero");
      if (!shutter || !hero) return;
      const q = gsap.utils.selector(hero);
      shutter.style.animation = "none";

      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const tl = gsap.timeline({ defaults: { ease: "expo.out" } });
        tl.fromTo(q(".hero-media img"), { scale: 1.08 }, { scale: 1, duration: 1.8, ease: "power3.out" }, 0)
          .to(shutter, { yPercent: -100, duration: 1.05, ease: "expo.inOut" }, 0.15)
          .fromTo(q("[data-hero-line] > span"), { yPercent: 105 }, { yPercent: 0, duration: 0.9, stagger: 0.08 }, 0.55)
          .fromTo(
            q("[data-hero-rise]"),
            { autoAlpha: 0, y: 18 },
            { autoAlpha: 1, y: 0, duration: 0.8, stagger: 0.07, clearProps: "transform,opacity,visibility" },
            0.75,
          )
          .set(shutter, { display: "none" });
      });
      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(shutter, { display: "none" });
        gsap.fromTo(q("[data-hero-rise], [data-hero-line]"), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.4, clearProps: "opacity,visibility" });
      });
    },
    { scope: ref },
  );

  return (
    <div ref={ref} aria-hidden="true" className="hero-shutter">
      <span className="hero-shutter__light" />
    </div>
  );
}
