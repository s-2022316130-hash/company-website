"use client";

import { useEffect, useRef, type CSSProperties, type HTMLAttributes } from "react";

type RevealTag = "div" | "section" | "ul" | "ol" | "li" | "article" | "aside" | "figure";

/**
 * One shared IntersectionObserver for every reveal on the page. An element is only hidden if its
 * first report shows it below the fold, so content already on screen (or above it, after a restored
 * scroll) is never hidden after it has been painted. Each element animates once, then is released.
 */
let observer: IntersectionObserver | undefined;
const decided = new WeakSet<Element>();

function getObserver(): IntersectionObserver | undefined {
  if (observer || typeof IntersectionObserver === "undefined") return observer;
  observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        const el = entry.target as HTMLElement;
        if (!decided.has(el)) {
          decided.add(el);
          if (entry.boundingClientRect.top < window.innerHeight) {
            el.dataset.revealState = "shown";
            observer?.unobserve(el);
          } else {
            el.dataset.revealState = "pending";
          }
        } else if (entry.isIntersecting) {
          el.dataset.revealState = "in";
          observer?.unobserve(el);
        }
      }
    },
    // Trigger once the element's top is about a fifth of the way up the viewport.
    { rootMargin: "0px 0px -18% 0px" },
  );
  return observer;
}

/**
 * Fades content up as it scrolls into view (CSS in globals.css, "Scroll reveal").
 * - variant "self": the element itself moves.
 * - variant "group": the element stays put; descendants marked .reveal-item and the children of
 *   .reveal-list follow one after another, 70ms apart. `base` offsets where the list starts.
 */
export function Reveal({
  as = "div",
  variant = "group",
  base,
  className,
  style,
  children,
  ...rest
}: {
  as?: RevealTag;
  variant?: "self" | "group";
  /** Number of steps before the first .reveal-list child, e.g. 2 after a heading and description. */
  base?: number;
} & HTMLAttributes<HTMLElement>) {
  // Typed as a div for JSX; the observer only needs an Element, whichever tag `as` renders.
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    const io = getObserver();
    if (!el || !io || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    io.observe(el);
    return () => io.unobserve(el);
  }, []);

  const Tag = as as "div";
  return (
    <Tag
      {...rest}
      ref={ref}
      data-reveal={variant}
      className={className}
      style={base ? ({ ...style, "--reveal-base": base } as CSSProperties) : style}
    >
      {children}
    </Tag>
  );
}
