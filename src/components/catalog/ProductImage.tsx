"use client";

import Image from "next/image";
import { useState } from "react";
import { BikeArt } from "@/components/bikes/BikeArt";
import { CategoryIcon } from "@/components/ui/CategoryIcon";
import { GearRing } from "@/components/ui/Mechanical";
import { cx } from "@/lib/cx";
import type { BikeClass, CategoryIcon as CategoryIconName, DisplayImage } from "@/lib/types";

/**
 * Product image with lazy loading and a graceful fallback chain:
 * exact photo → representative photo (both via `image`) → bike drawing → category placeholder.
 * A file that fails to load drops to the next step instead of showing a broken image.
 */
export function ProductImage({
  image,
  icon,
  bikeClass,
  label,
  sizes = "(min-width: 1280px) 22vw, (min-width: 768px) 30vw, 48vw",
  priority = false,
  className,
  aspect = "aspect-square",
  zoom = false,
}: {
  image?: DisplayImage;
  icon: CategoryIconName;
  /** Drawing to fall back to when there is no photo (the product's bike). */
  bikeClass?: BikeClass;
  /** Short part-type label shown on the placeholder, e.g. "Brake Pads". */
  label?: string;
  sizes?: string;
  priority?: boolean;
  className?: string;
  aspect?: string;
  /** Scale the photo slightly when the surrounding .group is hovered. */
  zoom?: boolean;
}) {
  const [failed, setFailed] = useState(false);
  const photo = image && !failed ? image : undefined;

  return (
    <div className={cx("relative w-full overflow-hidden bg-graphite", aspect, className)}>
      {photo ? (
        <Image
          src={photo.src}
          alt={photo.alt}
          fill
          sizes={sizes}
          priority={priority}
          className={cx(
            photo.representative ? "object-cover" : "bg-surface object-contain p-2",
            zoom && "transition-transform duration-700 ease-out group-hover:scale-[1.06]",
          )}
          style={photo.position ? { objectPosition: photo.position } : undefined}
          onError={() => setFailed(true)}
        />
      ) : (
        <div className="blueprint flex size-full flex-col items-center justify-center gap-1 p-3 text-on-dark">
          {bikeClass ? (
            <BikeArt bikeClass={bikeClass} className="w-4/5 opacity-80" />
          ) : (
            <span className="relative grid size-20 place-items-center">
              <GearRing className="absolute inset-0 text-on-dark-muted opacity-50" />
              <CategoryIcon name={icon} className="relative size-8 text-brand-bright" />
            </span>
          )}
          {label && (
            <span className="text-center font-display text-xs font-semibold uppercase tracking-[0.14em] text-on-dark-muted">
              {label}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
