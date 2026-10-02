import { PhotoFill } from "@/components/media/Photo";
import type { PhotoKey } from "@/config/photos";
import { cx } from "@/lib/cx";
import type { BikeClass } from "@/lib/types";
import { BikeArt, bikeClassLabel } from "./BikeArt";

/**
 * Bike image slot: a licensed photo of the exact model when one is supplied (model.image),
 * otherwise the line drawing for its body style on a blueprint background.
 */
export function BikeVisual({
  bikeClass,
  image,
  name,
  className,
  sizes = "(min-width: 1024px) 25vw, 50vw",
  annotate = true,
  tone = "dark",
}: {
  bikeClass: BikeClass;
  image?: PhotoKey;
  /** Bike name for the accessible label, e.g. "Yamaha FZS V4". */
  name: string;
  className?: string;
  sizes?: string;
  annotate?: boolean;
  tone?: "dark" | "light";
}) {
  if (image) {
    return (
      <div className={cx("relative overflow-hidden", className)}>
        <PhotoFill photo={image} sizes={sizes} />
      </div>
    );
  }
  return (
    <div
      className={cx(
        "relative flex items-center justify-center overflow-hidden",
        tone === "dark" ? "blueprint text-on-dark" : "tech-grid text-steel",
        className,
      )}
    >
      <BikeArt
        bikeClass={bikeClass}
        annotate={annotate}
        title={`Line drawing of a ${bikeClassLabel(bikeClass)}, representing the ${name}`}
        className="h-full max-h-full w-[88%] transition-transform duration-500 group-hover:scale-[1.04]"
      />
    </div>
  );
}
