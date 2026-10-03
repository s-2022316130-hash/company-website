"use client";

import { Children, isValidElement, useEffect, useId, useRef, useState, type ReactNode } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cx } from "@/lib/cx";
import { prefersReducedMotion } from "@/lib/motion";

/** Breakpoint from which the rail becomes an ordinary grid. Literal class strings so Tailwind sees them. */
const gridModes = {
  sm: { list: "sm:mx-0 sm:grid sm:overflow-visible sm:px-0 sm:[mask-image:none]", sentinel: "sm:hidden", arrows: "" },
  md: { list: "md:mx-0 md:grid md:overflow-visible md:px-0 md:[mask-image:none]", sentinel: "md:hidden", arrows: "" },
  lg: { list: "lg:mx-0 lg:grid lg:overflow-visible lg:px-0 lg:[mask-image:none]", sentinel: "lg:hidden", arrows: "md:grid lg:hidden" },
} as const;

/**
 * Horizontal rail of cards: swipe on phones, arrow buttons on larger screens, or a grid from
 * `gridFrom` up. The thin scrollbar stays visible; the edges fade only on the side where cards are
 * hidden. Edge detection uses two sentinel items and an IntersectionObserver, so nothing runs while
 * scrolling.
 */
export function ScrollRail({
  label,
  children,
  itemClassName,
  tone = "light",
  gridFrom,
  gridCols,
  className,
}: {
  /** Accessible name for the list, e.g. "Featured parts". */
  label: string;
  children: ReactNode;
  /** Card widths per breakpoint, e.g. "w-[72%] sm:w-[42%] lg:w-[22.5%]". */
  itemClassName: string;
  tone?: "light" | "dark";
  gridFrom?: keyof typeof gridModes;
  /** Grid columns once it is a grid, e.g. "sm:grid-cols-2 lg:grid-cols-4". */
  gridCols?: string;
  className?: string;
}) {
  const id = useId();
  const trackRef = useRef<HTMLUListElement>(null);
  const startRef = useRef<HTMLLIElement>(null);
  const endRef = useRef<HTMLLIElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);
  const grid = gridFrom ? gridModes[gridFrom] : undefined;

  useEffect(() => {
    const track = trackRef.current;
    if (!track || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.target === startRef.current) setAtStart(e.isIntersecting);
          if (e.target === endRef.current) setAtEnd(e.isIntersecting);
        }
      },
      { root: track },
    );
    if (startRef.current) io.observe(startRef.current);
    if (endRef.current) io.observe(endRef.current);
    return () => io.disconnect();
  }, []);

  const scroll = (dir: -1 | 1) => {
    const track = trackRef.current;
    if (!track) return;
    track.scrollBy({ left: dir * track.clientWidth * 0.85, behavior: prefersReducedMotion() ? "auto" : "smooth" });
  };

  const dark = tone === "dark";
  const arrow = cx(
    "absolute top-1/2 z-(--z-raised) hidden size-11 -translate-y-1/2 place-items-center rounded-full border shadow-float transition-[opacity,scale,background-color] duration-small ease-ui",
    "disabled:pointer-events-none disabled:scale-90 disabled:opacity-0",
    dark ? "border-white/15 bg-graphite-2 text-white hover:bg-graphite-3" : "border-line bg-surface text-ink hover:bg-canvas",
    grid ? grid.arrows : "md:grid",
  );
  const sentinel = cx("w-px", grid?.sentinel);

  return (
    <div className={cx("relative", className)}>
      <ul
        ref={trackRef}
        id={`${id}-rail`}
        aria-label={label}
        data-more-before={atStart ? undefined : ""}
        data-more-after={atEnd ? undefined : ""}
        className={cx(
          "rail reveal-list -mx-4 -my-3 gap-3 px-4 py-3 [scroll-padding-inline:1rem] sm:-mx-6 sm:gap-4 sm:px-6 sm:[scroll-padding-inline:1.5rem] md:mx-0 md:px-0 md:[scroll-padding-inline:0]",
          dark && "rail-dark",
          grid?.list,
          gridCols,
        )}
      >
        <li ref={startRef} aria-hidden="true" className={cx(sentinel, "-mr-3 sm:-mr-4")} style={{ scrollSnapAlign: "none" }} />
        {Children.toArray(children).map((child, i) => (
          <li key={isValidElement(child) && child.key != null ? child.key : i} className={cx("flex", itemClassName)}>
            {child}
          </li>
        ))}
        <li ref={endRef} aria-hidden="true" className={cx(sentinel, "-ml-3 sm:-ml-4")} style={{ scrollSnapAlign: "none" }} />
      </ul>
      <button type="button" className={cx(arrow, "-left-4")} onClick={() => scroll(-1)} disabled={atStart} aria-controls={`${id}-rail`} aria-label="Scroll back">
        <ChevronLeft className="size-5" aria-hidden="true" />
      </button>
      <button type="button" className={cx(arrow, "-right-4")} onClick={() => scroll(1)} disabled={atEnd} aria-controls={`${id}-rail`} aria-label="Scroll forward">
        <ChevronRight className="size-5" aria-hidden="true" />
      </button>
    </div>
  );
}
