import Link from "next/link";
import { business } from "@/config/business";

/** Hex-nut mark with an "N". A placeholder identity until the shop supplies its own logo. */
export function LogoMark({ className = "size-10" }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={className} aria-hidden="true">
      <path d="M20 1.5 36.5 11v18L20 38.5 3.5 29V11Z" fill="#c2410c" stroke="#f26b21" strokeWidth="1" strokeLinejoin="round" />
      <circle cx="20" cy="20" r="12.5" fill="none" stroke="#9a3412" strokeWidth="1.6" />
      <path d="M14 27V13h3.4l6.2 8.9V13H27v14h-3.4l-6.2-8.9V27Z" fill="#fff" />
    </svg>
  );
}

export function Logo({ inverted = false }: { inverted?: boolean }) {
  return (
    <Link href="/" className="flex shrink-0 items-center gap-2.5" aria-label={`${business.name} home`}>
      <LogoMark />
      <span className="leading-none">
        <span className={`display block text-[1.35rem] tracking-[0.04em] ${inverted ? "text-white" : "text-ink"}`}>
          {business.name}
        </span>
        <span lang="bn" className={`mt-0.5 block text-[0.8125rem] ${inverted ? "text-on-dark-muted" : "text-muted"}`}>
          {business.banglaName}
        </span>
      </span>
    </Link>
  );
}
