"use client";

import Link from "next/link";
import { useEffect } from "react";
import { TriangleAlert } from "lucide-react";
import { business } from "@/config/business";

export default function RouteError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="container-page py-16">
      <div className="card mx-auto flex max-w-xl flex-col items-center px-6 py-12 text-center" role="alert">
        <TriangleAlert className="size-10 text-warning" aria-hidden="true" />
        <h1 className="mt-4 font-display text-2xl font-bold text-ink">Something went wrong loading this page</h1>
        <p className="mt-2 text-muted">
          Please try again. If it keeps happening, call {business.phones.orders.display} and we&apos;ll help directly.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <button type="button" onClick={reset} className="btn btn-primary">
            Try again
          </button>
          <Link href="/" className="btn btn-outline">
            Return home
          </Link>
        </div>
      </div>
    </div>
  );
}
