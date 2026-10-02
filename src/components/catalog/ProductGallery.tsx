"use client";

import { useState } from "react";
import Image from "next/image";
import { cx } from "@/lib/cx";
import type { CategoryIcon, ProductImage as ProductImageData } from "@/lib/types";
import { ProductImage } from "./ProductImage";

export function ProductGallery({ images, icon, name }: { images: ProductImageData[]; icon: CategoryIcon; name: string }) {
  const [active, setActive] = useState(0);
  const current = images[active];

  return (
    <div className="space-y-3">
      <div className="card overflow-hidden">
        <ProductImage
          image={current}
          icon={icon}
          priority
          // Without a photo, a shorter placeholder keeps the name and price above the fold on phones.
          aspect={images.length > 0 ? "aspect-square" : "aspect-[2/1] lg:aspect-square"}
          sizes="(min-width: 1024px) 45vw, 100vw"
          placeholderLabel="Product photo coming soon"
        />
      </div>
      {images.length > 1 && (
        <ul className="flex gap-2 overflow-x-auto pb-1" aria-label={`${name} photos`}>
          {images.map((img, i) => (
            <li key={img.src} className="shrink-0">
              <button
                type="button"
                onClick={() => setActive(i)}
                aria-label={`Show photo ${i + 1} of ${images.length}`}
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
