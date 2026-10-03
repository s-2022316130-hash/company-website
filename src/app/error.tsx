"use client";

import Link from "next/link";
import { useEffect } from "react";
import { RotateCcw, TriangleAlert } from "lucide-react";
import { business } from "@/config/business";

export default function RouteError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="container-page py-16">
      <div className="card relative isolate mx-auto flex max-w-xl flex-col items-center overflow-hidden px-6 pb-12 pt-10 text-center" role="alert">
        <div
          aria-hidden="true"
          className="tech-grid absolute inset-x-0 top-0 -z-10 h-40 [mask-image:linear-gradient(to_bottom,#000_30%,transparent)]"
        />
        <span className="grid size-14 place-items-center rounded-full bg-warning-soft ring-1 ring-warning/25">
          <TriangleAlert className="size-7 text-warning" aria-hidden="true" />
        </span>
        <h1 className="display mt-4 text-3xl text-ink">Something went wrong while loading these parts.</h1>
        <p className="mt-2 text-muted">
          Please try again. If it keeps happening, call {business.phones.orders.display} and we&apos;ll help directly.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <button type="button" onClick={reset} className="group btn btn-primary">
            <RotateCcw className="size-4 transition-transform duration-standard ease-ui group-hover:-rotate-45" aria-hidden="true" />
            Try again
          </button>
          <Link href="/shop" className="btn btn-outline">
            Browse parts
          </Link>
        </div>
      </div>
    </div>
  );
}
