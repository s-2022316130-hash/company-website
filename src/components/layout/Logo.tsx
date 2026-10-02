import Link from "next/link";
import { business } from "@/config/business";

/** Text wordmark. Replace the "N" mark with the shop's logo file when one is supplied. */
export function Logo({ inverted = false }: { inverted?: boolean }) {
  return (
    <Link href="/" className="flex shrink-0 items-center gap-2.5" aria-label={`${business.name} home`}>
      <span
        className="grid size-10 place-items-center rounded-lg bg-brand font-display text-xl font-bold text-white"
        aria-hidden="true"
      >
        N
      </span>
      <span className="leading-none">
        <span
          className={`block font-display text-lg font-bold uppercase tracking-wide ${inverted ? "text-white" : "text-ink"}`}
        >
          {business.name}
        </span>
        <span lang="bn" className={`mt-0.5 block text-[0.8125rem] ${inverted ? "text-white/75" : "text-muted"}`}>
          {business.banglaName}
        </span>
      </span>
    </Link>
  );
}
