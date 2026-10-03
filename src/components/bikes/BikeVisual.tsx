import Image from "next/image";
import type { ImageAsset } from "@/config/images";
import { cx } from "@/lib/cx";
import { shown } from "@/lib/images";
import type { BikeClass } from "@/lib/types";
import { BikeArt, bikeClassLabel } from "./BikeArt";

/**
 * Motorcycle image slot. Shows the model's photo only when its rights allow it (supplied by the
 * distributor or approved), otherwise the original line drawing for its body style. Photos sit in a
 * fixed frame with `object-contain`, so wheels, lights and badges are never cropped and cards with
 * differently shaped photos still line up.
 */
export function BikeVisual({
  bikeClass,
  image,
  name,
  className,
  sizes = "(min-width: 1024px) 25vw, 50vw",
  annotate = true,
  tone = "dark",
  priority = false,
  hover = "zoom",
}: {
  bikeClass: BikeClass;
  /** The model's image slot from the manifest (see lib/images.ts: motorcycleImage). */
  image?: ImageAsset;
  /** Bike name for the accessible label, e.g. "Yamaha FZS V4". */
  name: string;
  className?: string;
  sizes?: string;
  annotate?: boolean;
  tone?: "dark" | "light";
  priority?: boolean;
  /** Reaction to hovering the surrounding .group: a slight zoom, or zoom and roll 6px forward. */
  hover?: "zoom" | "ride" | "none";
}) {
  const photo = shown(image);
  const motion = cx(
    hover !== "none" && "transition-[scale,translate] duration-emphasis ease-card group-hover:scale-[1.04]",
    hover === "ride" && "group-hover:translate-x-1.5",
  );
  if (photo) {
    return (
      <div className={cx("relative overflow-hidden", tone === "dark" ? "studio-dark" : "studio", className)}>
        <Image
          src={photo.src}
          alt={photo.alt}
          fill
          sizes={sizes}
          priority={priority}
          className={cx("object-contain p-[5%]", motion)}
          style={photo.position ? { objectPosition: photo.position } : undefined}
        />
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
        className={cx("h-full max-h-full w-[88%]", motion)}
      />
    </div>
  );
}

/** Caption for a large bike image: who supplied the photo, or that the drawing is not the exact model. */
export function bikeImageCaption(image: ImageAsset | undefined, bikeClass: BikeClass): string {
  const photo = shown(image);
  if (photo) {
    if (photo.rightsStatus === "dealer-supplied" && photo.requestFrom) return `Official image supplied by ${photo.requestFrom}`;
    return photo.imageSource === "official-brand" ? "Official manufacturer image, used with permission" : photo.alt;
  }
  return `Line drawing of a ${bikeClassLabel(bikeClass)}, not the exact model`;
}
