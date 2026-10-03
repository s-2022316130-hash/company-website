"use client";

import { usePathname } from "next/navigation";
import { useLayoutEffect, useRef, type ReactNode } from "react";
import { duration, easing, prefersReducedMotion } from "@/lib/motion";

/**
 * Plays a short enter animation on its wrapper whenever `watch` changes, but not on the first
 * render, so the initial page load paints immediately. Runs before paint, so the new content never
 * flashes at full opacity first. Uses transform and opacity only.
 */
export function AnimateOnChange({
  watch,
  distance = 8,
  axis = "y",
  className,
  children,
}: {
  watch: string;
  /** Travel in px: upward for "y", from the right for "x". */
  distance?: number;
  axis?: "x" | "y";
  className?: string;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const previous = useRef(watch);

  useLayoutEffect(() => {
    if (previous.current === watch) return;
    previous.current = watch;
    const el = ref.current;
    if (!el || prefersReducedMotion() || typeof el.animate !== "function") return;
    el.animate([{ opacity: 0, translate: axis === "x" ? `${distance}px 0` : `0 ${distance}px` }, { opacity: 1, translate: "0 0" }], {
      duration: duration.small,
      easing: easing.ui,
    });
  }, [watch, distance, axis]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

/** Route change: the incoming page fades up 8px (150–250ms per the motion system). */
export function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  return <AnimateOnChange watch={pathname}>{children}</AnimateOnChange>;
}
