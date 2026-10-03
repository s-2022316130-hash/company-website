import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Bike, Search } from "lucide-react";
import { BikeArt } from "@/components/bikes/BikeArt";
import { GaugeArc } from "@/components/ui/Mechanical";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false },
};

/** 404: a blueprint motorcycle heading off the road, one line of humour, and the two ways back to parts. */
export default function NotFound() {
  return (
    <section className="blueprint relative isolate -mb-16 overflow-hidden text-on-dark" aria-labelledby="not-found-title">
      <div aria-hidden="true" className="fins absolute inset-0 -z-10 opacity-60" />
      <div className="container-page grid min-h-[70svh] items-center gap-10 py-16 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:py-24">
        <div className="animate-fade-up">
          <p className="label-tech text-brand-bright">Error 404 · Page not found</p>
          <h1 id="not-found-title" className="display mt-3 text-feature text-white">
            Looks like this part took the wrong turn.
          </h1>
          <p className="mt-4 max-w-md text-on-dark">
            The page may have moved, or the link is wrong. The parts are still here: search the shop or start from your
            motorcycle.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link href="/shop" className="group btn btn-primary btn-lg">
              <Search className="size-4" aria-hidden="true" /> Shop parts
            </Link>
            <Link href="/part-finder" className="btn btn-outline-dark btn-lg">
              <Bike className="size-5" aria-hidden="true" /> Find your bike
            </Link>
          </div>
          <Link
            href="/"
            className="group mt-5 inline-flex min-h-10 items-center gap-1.5 text-sm font-semibold text-on-dark-muted transition-colors hover:text-white"
          >
            Or go to the homepage
            <ArrowRight className="size-4 transition-transform duration-small ease-ui group-hover:translate-x-1" aria-hidden="true" />
          </Link>
        </div>
        <div aria-hidden="true" className="relative mx-auto w-full max-w-xl">
          <GaugeArc className="absolute -top-6 right-2 w-28 text-on-dark-muted" needle={0.94} />
          <BikeArt bikeClass="street" annotate className="w-full -rotate-3 text-on-dark opacity-90" />
          <p className="display mt-2 text-center text-[clamp(4rem,10vw,7rem)] leading-none text-white/[0.08]">404</p>
        </div>
      </div>
    </section>
  );
}
