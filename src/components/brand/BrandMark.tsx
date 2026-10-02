import Image from "next/image";
import { cx } from "@/lib/cx";
import { brandLogo, shown } from "@/lib/images";

/**
 * A brand's official logo once the distributor has supplied it (or its use is approved); until then
 * the brand name in the site's display type, never a redrawn logo. Only the logo's height is set, so
 * it keeps its own proportions and is never stretched or filtered.
 */
export function BrandMark({
  slug,
  name,
  className,
  logoClassName = "h-8",
  fallback = "text",
}: {
  slug: string;
  name: string;
  /** Classes for the text fallback. */
  className?: string;
  /** Height (and any spacing) for the logo image. */
  logoClassName?: string;
  /** "none" renders nothing without a logo, for places that already show the name. */
  fallback?: "text" | "none";
}) {
  const logo = shown(brandLogo(slug));
  if (logo) {
    return (
      <Image
        src={logo.src}
        alt={name}
        width={logo.width ?? 240}
        height={logo.height ?? 80}
        className={cx("w-auto max-w-full object-contain", logoClassName)}
      />
    );
  }
  if (fallback === "none") return null;
  return <span className={cx("display", className)}>{name}</span>;
}
