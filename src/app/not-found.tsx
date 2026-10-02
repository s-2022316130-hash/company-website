import type { Metadata } from "next";
import Link from "next/link";
import { Bike, Home, Wrench } from "lucide-react";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false },
};

export default function NotFound() {
  return (
    <div className="container-page py-16">
      <div className="card mx-auto flex max-w-xl flex-col items-center px-6 py-12 text-center">
        <span className="tech-grid mb-5 grid size-16 place-items-center rounded-full">
          <Wrench className="size-7 text-steel" aria-hidden="true" />
        </span>
        <p className="eyebrow">Error 404</p>
        <h1 className="mt-2 font-display text-3xl font-bold text-ink">We couldn&apos;t find that part.</h1>
        <p className="mt-2 text-muted">The page may have moved, or the link is wrong. Try the shop or find parts by your bike.</p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link href="/shop" className="btn btn-primary">
            Shop parts
          </Link>
          <Link href="/part-finder" className="btn btn-outline">
            <Bike className="size-4" aria-hidden="true" /> Find your bike
          </Link>
          <Link href="/" className="btn btn-ghost">
            <Home className="size-4" aria-hidden="true" /> Return home
          </Link>
        </div>
      </div>
    </div>
  );
}
