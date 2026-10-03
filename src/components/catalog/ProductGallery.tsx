"use client";

import { useState } from "react";
import Image from "next/image";
import { Camera } from "lucide-react";
import { cx } from "@/lib/cx";
import type { CategoryIcon, DisplayImage, PartArtKind, ProductImage as ProductImageData } from "@/lib/types";
import { ProductImage } from "./ProductImage";

/**
 * Product gallery. Shows the item's own photos when the shop has supplied them, crossfading between
 * them (220ms) when a thumbnail is chosen; otherwise a photo of the part type or an illustration,
 * captioned as not the exact item. Hovering the frame on desktop zooms the photo slightly.
 */
export function ProductGallery({
  images,
  fallback,
  art,
  icon,
  label,
  name,
}: {
  images: ProductImageData[];
  /** Representative image used when there are no photos of the exact item. */
  fallback?: DisplayImage;
  art?: PartArtKind;
  icon: CategoryIcon;
  label?: string;
  name: string;
}) {
  const [active, setActive] = useState(0);
  const own: DisplayImage[] = images.map((img) => ({ ...img, representative: false }));
  const current = own[active] ?? fallback;
  const frame = "aspect-[4/3] lg:aspect-square";

  return (
    <div className="space-y-3">
      <div className="group card overflow-hidden">
        {own.length > 1 ? (
          <div className={cx("relative w-full overflow-hidden bg-surface", frame)}>
            {own.map((img, i) => (
              <Image
                key={img.src}
                src={img.src}
                alt={i === active ? img.alt : ""}
                aria-hidden={i === active ? undefined : true}
                fill
                sizes="(min-width: 1024px) 45vw, 100vw"
                priority={i === 0}
                className={cx(
                  "object-contain p-2 transition-[opacity,scale] duration-small ease-ui group-hover:scale-[1.03]",
                  i === active ? "opacity-100" : "opacity-0",
                )}
              />
            ))}
          </div>
        ) : (
          <ProductImage
            image={current}
            art={art}
            icon={icon}
            label={label}
            priority
            zoom
            aspect={frame}
            sizes="(min-width: 1024px) 45vw, 100vw"
          />
        )}
      </div>
      {(current?.representative || (!current && art)) && (
        <p className="flex items-start gap-2 text-sm text-muted">
          <Camera className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
          {current ? "Representative photo" : "Illustration of the part type"}, not the exact item for sale. Ask for a
          photo of the actual part on WhatsApp.
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
                  "relative block size-16 overflow-hidden rounded-lg border-2 bg-surface transition-[border-color,opacity] duration-fast sm:size-20",
                  i === active ? "border-brand" : "border-line opacity-80 hover:border-line-strong hover:opacity-100",
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
