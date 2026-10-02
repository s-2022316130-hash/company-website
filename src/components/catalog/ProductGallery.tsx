"use client";

import { useState } from "react";
import Image from "next/image";
import { Camera } from "lucide-react";
import { cx } from "@/lib/cx";
import type { BikeClass, CategoryIcon, DisplayImage, ProductImage as ProductImageData } from "@/lib/types";
import { ProductImage } from "./ProductImage";

/**
 * Product gallery. Shows the item's own photos when the shop has supplied them; otherwise one
 * representative category photo, captioned as not the exact item.
 */
export function ProductGallery({
  images,
  fallback,
  icon,
  bikeClass,
  label,
  name,
}: {
  images: ProductImageData[];
  /** Representative image used when there are no photos of the exact item. */
  fallback?: DisplayImage;
  icon: CategoryIcon;
  bikeClass?: BikeClass;
  label?: string;
  name: string;
}) {
  const [active, setActive] = useState(0);
  const own: DisplayImage[] = images.map((img) => ({ ...img, representative: false }));
  const current = own[active] ?? fallback;

  return (
    <div className="space-y-3">
      <div className="card overflow-hidden">
        <ProductImage
          image={current}
          icon={icon}
          bikeClass={bikeClass}
          label={label}
          priority
          aspect="aspect-[4/3] lg:aspect-square"
          sizes="(min-width: 1024px) 45vw, 100vw"
        />
      </div>
      {current?.representative && (
        <p className="flex items-start gap-2 text-sm text-muted">
          <Camera className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
          Representative photo, not the exact item for sale. Ask for a photo of the actual part on WhatsApp.
        </p>
      )}
      {own.length > 1 && (
        <ul className="flex gap-2 overflow-x-auto pb-1" aria-label={`${name} photos`}>
          {own.map((img, i) => (
            <li key={img.src} className="shrink-0">
              <button
                type="button"
                onClick={() => setActive(i)}
                aria-label={`Show photo ${i + 1} of ${own.length}`}
                aria-pressed={i === active}
                className={cx(
                  "relative block size-16 overflow-hidden rounded-lg border-2 bg-surface sm:size-20",
                  i === active ? "border-brand" : "border-line hover:border-line-strong",
                )}
              >
                <Image src={img.src} alt="" fill sizes="80px" className="object-contain p-1" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
