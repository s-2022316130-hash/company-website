import Image from "next/image";
import { getPhoto, type Photo, type PhotoKey } from "@/config/photos";
import { cx } from "@/lib/cx";

/**
 * A manifest photo that fills its (positioned, sized) parent. Use `decorative` for
 * background images whose meaning is carried by nearby text: they get alt="".
 */
export function PhotoFill({
  photo,
  sizes,
  priority = false,
  decorative = false,
  className,
  position,
}: {
  photo: Photo | PhotoKey | undefined;
  sizes: string;
  priority?: boolean;
  decorative?: boolean;
  className?: string;
  position?: string;
}) {
  const p = typeof photo === "string" ? getPhoto(photo) : photo;
  if (!p) return null;
  return (
    <Image
      src={p.src}
      alt={decorative ? "" : p.alt}
      fill
      sizes={sizes}
      priority={priority}
      className={cx("object-cover", className)}
      style={{ objectPosition: position ?? p.position ?? "center" }}
    />
  );
}
