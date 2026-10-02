"use client";

import Image from "next/image";
import { useState } from "react";
import { ImageOff } from "lucide-react";
import { CategoryIcon } from "@/components/ui/CategoryIcon";
import { cx } from "@/lib/cx";
import type { CategoryIcon as CategoryIconName, ProductImage as ProductImageData } from "@/lib/types";

/**
 * Square product image with lazy loading and a neutral placeholder when
 * no photo exists or the file fails to load. Never substitutes a stock photo.
 */
export function ProductImage({
  image,
  icon,
  sizes = "(min-width: 1280px) 22vw, (min-width: 768px) 30vw, 48vw",
  priority = false,
  className,
  placeholderLabel = "Photo coming soon",
}: {
  image?: ProductImageData;
  icon: CategoryIconName;
  sizes?: string;
  priority?: boolean;
  className?: string;
  placeholderLabel?: string;
}) {
  const [failed, setFailed] = useState(false);
  const showImage = image && !failed;

  return (
    <div className={cx("relative aspect-square w-full overflow-hidden bg-surface", className)}>
      {showImage ? (
        <Image
          src={image.src}
          alt={image.alt}
          fill
          sizes={sizes}
          priority={priority}
          className="object-contain p-2"
          onError={() => setFailed(true)}
        />
      ) : (
        <div className="tech-grid flex size-full flex-col items-center justify-center gap-2 text-steel">
          {failed ? (
            <ImageOff className="size-8 opacity-60" aria-hidden="true" />
          ) : (
            <CategoryIcon name={icon} className="size-10 opacity-60 sm:size-12" />
          )}
          <span className="text-xs font-medium text-muted">{failed ? "Image unavailable" : placeholderLabel}</span>
        </div>
      )}
    </div>
  );
}
