import Image from "next/image";
import Link from "next/link";
import { business } from "@/config/business";
import { shopLogo } from "@/config/images";
import { cx } from "@/lib/cx";

/**
 * The shop's motorcycle-in-garage emblem (no name band), from the owner's logo. `tone` picks the
 * version for the background: black ink on light, white ink on dark. Decorative where a name sits
 * beside it; pass `label` when it stands alone.
 */
export function LogoMark({
  tone = "dark",
  className = "h-9",
  label,
  priority = false,
}: {
  tone?: "light" | "dark";
  className?: string;
  label?: string;
  priority?: boolean;
}) {
  const mark = tone === "dark" ? shopLogo.markDark : shopLogo.mark;
  return (
    <Image
      src={mark.src}
      alt={label ?? ""}
      width={mark.width}
      height={mark.height}
      priority={priority}
      sizes="96px"
      className={cx("w-auto shrink-0 object-contain", className)}
    />
  );
}

/** The full logo: emblem, "Since 2000" and the Bangla name, for the footer, About and Contact pages. */
export function LogoEmblem({
  tone = "dark",
  className = "h-24",
  sizes = "320px",
}: {
  tone?: "light" | "dark";
  className?: string;
  sizes?: string;
}) {
  const logo = tone === "dark" ? shopLogo.fullDark : shopLogo.full;
  return (
    <Image
      src={logo.src}
      alt={`${business.name} (${business.banglaName}) logo, since ${business.foundedYear}`}
      width={logo.width}
      height={logo.height}
      sizes={sizes}
      className={cx("w-auto object-contain", className)}
    />
  );
}

/** Header logo: emblem plus the name in English and Bangla. */
export function Logo({ inverted = false }: { inverted?: boolean }) {
  return (
    <Link href="/" className="group/logo flex shrink-0 items-center gap-2.5" aria-label={`${business.name} home`}>
      <LogoMark
        tone={inverted ? "dark" : "light"}
        priority
        className="h-8 transition-[scale] duration-small ease-ui group-hover/logo:scale-[1.04] sm:h-9"
      />
      <span className="leading-none">
        <span className={`display block text-[1.3rem] tracking-[0.04em] sm:text-[1.35rem] ${inverted ? "text-white" : "text-ink"}`}>
          {business.name}
        </span>
        <span lang="bn" className={`mt-0.5 block text-[0.8125rem] ${inverted ? "text-on-dark-muted" : "text-muted"}`}>
          {business.banglaName}
        </span>
      </span>
    </Link>
  );
}
